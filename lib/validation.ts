import { z } from 'zod';

// Lead submission validation schema (form fields only)
export const leadSubmissionSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().email('Invalid email address').toLowerCase().trim().optional()
  ),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format')
    .transform((val) => {
      // Normalize to E.164 format
      const digits = val.replace(/\D/g, '');
      if (digits.length === 10) {
        return `+1${digits}`;
      }
      return val;
    }),
  service_type: z.string().optional(), // Dropdown
  is_emergency: z.boolean().default(false),
  preferred_time_window: z.string().optional(),
  source: z.string().optional(),
  status: z.string().default('new'),
  notes: z.string().optional(),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

// Full lead data type
export interface LeadData extends LeadSubmission {
  // keeping these optional for backward compatibility or if we decide to re-add them
  estimated_units?: number;
  event_details?: {
    people: number;
    hours: number;
  };
}

// Safe parsing utilities
export const safeParseInt = (value: string | number, defaultValue: number = 0): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? defaultValue : Math.floor(value);
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const safeParseFloat = (value: string | number, defaultValue: number = 0): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? defaultValue : value;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    throw new TypeError('sanitizeInput expects a string');
  }
  // Remove potentially dangerous characters to prevent XSS
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\0/g, '') // Remove null bytes
    .trim(); // Trim whitespace
};

export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {
    throw new TypeError('sanitizeEmail expects a string');
  }
  // Normalize email addresses
  return email.toLowerCase().trim();
};

// Safe localStorage wrapper
export const safeLocalStorage = {
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Failed to read from localStorage (key: ${key}):`, error);
      return defaultValue;
    }
  },
  setItem: (key: string, value: unknown): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to write to localStorage (key: ${key}):`, error);
      return false;
    }
  },
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove from localStorage (key: ${key}):`, error);
      return false;
    }
  },
};

// Rate limiting utilities
// ⚠️ SECURITY: Client-side rate limiting is fundamentally insecure and has been removed.
// Client-side checks can be bypassed by: disabling JS, incognito mode, clearing storage,
// DevTools manipulation, or any HTTP client.
//
// CORRECT SOLUTION: Implement server-side rate limiting in Supabase Edge Functions
// or your backend API with per-IP/per-user tracking.
//
// References:
// - Supabase rate limiting: https://supabase.com/docs/guides/functions/rate-limiting
// - OWASP Rate Limit Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Rate_Limiting_Cheat_Sheet.html
//
// If client-side UI feedback is needed for UX purposes, the server should return
// rate-limit headers (Retry-After, X-RateLimit-Limit) that the client displays.
