import { z } from 'zod';

// Lead submission validation schema (form fields only)
// Lead submission validation schema (form fields only)
export const leadSubmissionSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim()
        .optional()
        .or(z.literal('')),
    phone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number is too long')
        .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format')
        .transform(val => {
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
    notes: z.string().optional()
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

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .trim();
};

export const sanitizeEmail = (email: string): string => {
    return email.toLowerCase().trim();
};

export const normalizePhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
        return `+1${digits}`;
    }
    return phone;
};

// Rate limiting utilities
const submissionTimestamps: number[] = [];

export const checkRateLimit = (
    maxSubmissions: number = 3,
    timeWindowMs: number = 60 * 60 * 1000 // 1 hour
): boolean => {
    const now = Date.now();
    // Remove timestamps older than time window and update the array
    const recentTimestamps = submissionTimestamps.filter(
        timestamp => now - timestamp < timeWindowMs
    );
    // Update the array to only contain recent timestamps
    submissionTimestamps.length = 0;
    submissionTimestamps.push(...recentTimestamps);
    
    if (recentTimestamps.length >= maxSubmissions) {
        return false; // Rate limit exceeded
    }
    
    // Add current timestamp
    submissionTimestamps.push(now);
    return true;
};

export const getTimeUntilNextSubmission = (): number => {
    if (submissionTimestamps.length < 3) return 0;
    
    const oldestTimestamp = submissionTimestamps[0];
    const timeWindowMs = 60 * 60 * 1000; // 1 hour
    const timeRemaining = oldestTimestamp + timeWindowMs - Date.now();
    
    return Math.max(0, timeRemaining);
};
