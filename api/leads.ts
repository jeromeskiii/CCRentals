import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { leadSubmissionSchema, sanitizeInput } from '../lib/validation';

const RATE_LIMIT = 5; // requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

let rateLimiter: Ratelimit | null | undefined;

const getRateLimiter = () => {
  if (rateLimiter !== undefined) {
    return rateLimiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    rateLimiter = null;
    return rateLimiter;
  }

  rateLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT, `${RATE_LIMIT_WINDOW} ms`),
    analytics: true,
    prefix: 'ccrentals:leads',
  });

  return rateLimiter;
};

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

  const limiter = getRateLimiter();

  if (!limiter) {
    console.error('Upstash Redis credentials not configured');
    return response.status(500).json({ error: 'Server not configured' });
  }

  const rateLimit = await limiter.limit(`ip:${clientIP}`);

  if (!rateLimit.success) {
    const retryAfter = Math.ceil((rateLimit.reset - Date.now()) / 1000);
    response.setHeader('Retry-After', retryAfter);
    response.setHeader('X-RateLimit-Limit', rateLimit.limit);
    response.setHeader('X-RateLimit-Remaining', 0);
    return response.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter,
    });
  }

  response.setHeader('X-RateLimit-Limit', rateLimit.limit);
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

  const leadData = parseResult.data;

  const sanitizedLeadData = {
    ...leadData,
    name: sanitizeInput(leadData.name),
    notes: leadData.notes ? sanitizeInput(leadData.notes) : undefined,
    service_type: leadData.service_type ? sanitizeInput(leadData.service_type) : undefined,
    preferred_time_window: leadData.preferred_time_window
      ? sanitizeInput(leadData.preferred_time_window)
      : undefined,
    source: leadData.source ? sanitizeInput(leadData.source) : undefined,
  };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase server credentials not configured');
    return response.status(500).json({ error: 'Server not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from('leads').insert([sanitizedLeadData]);

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
