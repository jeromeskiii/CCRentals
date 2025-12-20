
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('Supabase URL is missing. Set VITE_SUPABASE_URL in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
