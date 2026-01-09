import { supabase } from './supabase';
import { leadSubmissionSchema, LeadSubmission } from './validation';

/**
 * API Service Layer
 * Centralized API calls with validation and specific error handling
 */

/**
 * API Error types for better error handling
 */
export class APIError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'APIError';
    }
}

export const api = {
    /**
     * Lead Management
     */
    leads: {
        /**
         * Create a new lead submission with validation and sanitization
         */
        create: async (data: LeadSubmission) => {
            // Validate input data structure
            const validation = leadSubmissionSchema.safeParse(data);
            if (!validation.success) {
                const firstError = validation.error.issues[0];
                throw new APIError(
                    firstError.message,
                    'VALIDATION_ERROR',
                    400,
                    validation.error.issues
                );
            }

            // Submit to database (Zod schema already handles normalization via transforms)
            const { error } = await supabase
                .from('leads')
                .insert([validation.data])
                .select();

            if (error) {
                console.error('API Error creating lead:', error);

                // Provide specific error messages based on error type
                if (error.code === '23505') {
                    throw new APIError(
                        'A lead with this information already exists.',
                        'DUPLICATE_ENTRY',
                        409
                    );
                }

                if (error.code === '42501') {
                    throw new APIError(
                        'Permission denied. Please contact support.',
                        'PERMISSION_DENIED',
                        403
                    );
                }

                if (error.message.includes('network')) {
                    throw new APIError(
                        'Network error. Please check your connection and try again.',
                        'NETWORK_ERROR',
                        0
                    );
                }

                // Generic error as fallback
                throw new APIError(
                    'Unable to submit your request. Please try again or contact support.',
                    'SUBMISSION_ERROR',
                    500,
                    error
                );
            }

            return { success: true };
        },

        /**
         * Get all leads (admin only)
         */
        list: async () => {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('API Error fetching leads:', error);

                if (error.code === '42501') {
                    throw new APIError(
                        'You do not have permission to view leads.',
                        'PERMISSION_DENIED',
                        403
                    );
                }

                throw new APIError(
                    'Failed to load leads. Please try again.',
                    'FETCH_ERROR',
                    500,
                    error
                );
            }

            return data;
        }
    }
};

/**
 * Type guards and validators
 */
export const validateLead = (data: unknown): data is LeadSubmission => {
    // Use Zod's safeParse for comprehensive runtime validation
    // This checks types, formats, and constraints defined in leadSubmissionSchema
    return leadSubmissionSchema.safeParse(data).success;
};
