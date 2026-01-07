import { supabase } from './supabase';
import { LeadSubmission } from './validation';

/**
 * API Service Layer
 * Centralized API calls for better maintainability and testing
 */

export const api = {
    /**
     * Lead Management
     */
    leads: {
        /**
         * Create a new lead submission
         */
        create: async (data: LeadSubmission) => {
            const { error } = await supabase
                .from('leads')
                .insert([data])
                .select();

            if (error) {
                console.error('API Error creating lead:', error);
                throw new Error('Failed to submit lead. Please try again.');
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
                throw new Error('Failed to fetch leads.');
            }

            return data;
        }
    }
};

/**
 * Type guards and validators
 */
export const validateLead = (data: unknown): data is LeadSubmission => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'name' in data &&
        'email' in data &&
        'phone' in data
    );
};
