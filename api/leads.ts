import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { leadSubmissionSchema } from '../lib/validation';

// Rate limiting store (in-memory, resets on cold start)
// For production, use Upstash Redis: https://upstash.com/docs/redis/features/ratelimit
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 5; // requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

// Check rate limit for IP
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    const newRecord = { count: 1, resetAt: now + RATE_LIMIT_WINDOW };
    rateLimitStore.set(ip, newRecord);
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count, resetAt: record.resetAt };
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Honeypot check - reject if filled
  const honeypotValue = request.body.website_url;
  if (honeypotValue && honeypotValue.length > 0) {
    return response.status(200).json({ success: true, message: 'Request received' });
  }

  // Rate limiting by IP
  const clientIP =
    request.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    request.headers['x-vercel-forwarded-for']?.toString() ||
    'unknown';

  const rateLimit = checkRateLimit(clientIP);

  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    response.setHeader('Retry-After', retryAfter);
    response.setHeader('X-RateLimit-Limit', RATE_LIMIT);
    response.setHeader('X-RateLimit-Remaining', 0);
    return response.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter,
    });
  }

  response.setHeader('X-RateLimit-Limit', RATE_LIMIT);
  response.setHeader('X-RateLimit-Remaining', rateLimit.remaining);

  const parseResult = leadSubmissionSchema.safeParse(request.body);

  if (!parseResult.success) {
    const errors = parseResult.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return response.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  const { website_url, ...leadData } = parseResult.data;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase server credentials not configured');
    return response.status(500).json({ error: 'Server not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from('leads').insert([leadData]);

  if (error) {
    console.error('API Error creating lead:', error);

    if (error.code === '23505') {
      return response.status(409).json({
        error: 'A lead with this information already exists.',
        code: 'DUPLICATE_ENTRY',
      });
    }

    if (error.code === '42501') {
      return response.status(403).json({
        error: 'Permission denied. Please contact support.',
        code: 'PERMISSION_DENIED',
      });
    }

    return response.status(500).json({
      error: 'Unable to submit your request. Please try again or contact support.',
      code: 'SUBMISSION_ERROR',
    });
  }

  return response.status(200).json({
    success: true,
    message: 'Lead submitted successfully',
  });
}
