import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Rate limiting store (in-memory, resets on cold start)
// For production, use Upstash Redis: https://upstash.com/docs/redis/features/ratelimit
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 5; // requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

// Email schema validation
const quoteEmailSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim().optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
  company: z.string().max(100).trim().optional().or(z.literal('')),
  address: z.string().max(500).trim().optional().or(z.literal('')),
  serviceType: z.string(),
  units: z.coerce.number().int().min(1).max(100),
  duration: z.coerce.number().int().min(1).max(365),
  startDate: z.string().optional().or(z.literal('')),
  eventType: z.string().optional().or(z.literal('')),
  attendees: z.coerce.number().int().min(1).max(100000).optional(),
  notes: z.string().max(1000).trim().optional().or(z.literal('')),
  // Honeypot field - should always be empty
  website_url: z.string().optional(),
});

type QuoteEmailData = z.infer<typeof quoteEmailSchema>;

// Send email via Resend API
async function sendQuoteEmail(data: QuoteEmailData): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'info@coastalcleanrentals.com';
  
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Quote Request - ${data.serviceType}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0066cc 0%, #004499 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🚽 New Quote Request</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">Coastal Clean Rentals</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e9ecef;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600; width: 140px;">Service:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">${data.serviceType}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Units:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">${data.units}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Duration:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">${data.duration} days</td>
          </tr>
          ${data.startDate ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Start Date:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">${data.startDate}</td>
          </tr>
          ` : ''}
          ${data.eventType ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Event Type:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">${data.eventType}</td>
          </tr>
          ` : ''}
          ${data.attendees ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Attendees:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">${data.attendees}</td>
          </tr>
          ` : ''}
        </table>

        <h3 style="margin: 24px 0 12px 0; font-size: 16px; color: #0066cc;">Contact Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: 600; width: 140px;">Name:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Phone:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;"><a href="tel:${data.phone}" style="color: #0066cc; text-decoration: none;">${data.phone}</a></td>
          </tr>
          ${data.email ? `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;"><a href="mailto:${data.email}" style="color: #0066cc; text-decoration: none;">${data.email}</a></td>
          </tr>
          ` : ''}
          ${data.company ? `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Company:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">${data.company}</td>
          </tr>
          ` : ''}
          ${data.address ? `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: 600; vertical-align: top;">Address:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">${data.address}</td>
          </tr>
          ` : ''}
        </table>

        ${data.notes ? `
        <h3 style="margin: 24px 0 12px 0; font-size: 16px; color: #0066cc;">Additional Notes</h3>
        <p style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e9ecef; margin: 0;">${data.notes}</p>
        ` : ''}

        <div style="margin-top: 24px; padding: 16px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
          <strong style="color: #1565c0;">Action Required:</strong>
          <span style="color: #1976d2;"> Contact the customer within 60 minutes for the best conversion rate.</span>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
        <p style="margin: 0;">Submitted from coastalcleanrentals.com</p>
        <p style="margin: 4px 0 0 0;">${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</p>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Coastal Clean Rentals <quotes@coastalcleanrentals.com>',
        to: [BUSINESS_EMAIL],
        subject: `New Quote Request - ${data.serviceType} (${data.units} unit${data.units > 1 ? 's' : ''}) - ${data.name}`,
        html: htmlContent,
        reply_to: data.email || undefined,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', responseData);
      return { success: false, error: responseData.message || 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Check rate limit for IP
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    // New or expired - create new record
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

  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for development
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Honeypot check - reject if filled
  const honeypotValue = request.body.website_url;
  if (honeypotValue && honeypotValue.length > 0) {
    // Silently reject - don't reveal to spammer
    return response.status(200).json({ success: true, message: 'Request received' });
  }

  // Rate limiting by IP
  const clientIP = request.headers['x-forwarded-for']?.toString().split(',')[0].trim() || 
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
      retryAfter 
    });
  }

  response.setHeader('X-RateLimit-Limit', RATE_LIMIT);
  response.setHeader('X-RateLimit-Remaining', rateLimit.remaining);

  // Validate request body
  const parseResult = quoteEmailSchema.safeParse(request.body);

  if (!parseResult.success) {
    const errors = parseResult.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return response.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }

  const data = parseResult.data;

  // Send email notification
  const emailResult = await sendQuoteEmail(data);

  if (!emailResult.success) {
    console.error('Failed to send quote email:', emailResult.error);
    return response.status(500).json({ 
      error: emailResult.error || 'Failed to process request' 
    });
  }

  // Return success
  return response.status(200).json({ 
    success: true, 
    message: 'Quote request submitted successfully' 
  });
}
