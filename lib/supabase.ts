
import { createClient } from '@supabase/supabase-js';

// Validate environment variables in production
const isProduction = import.meta.env.PROD;

if (isProduction) {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing required Supabase environment variables in production. ' +
      'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
 * NOTE: Row Level Security (RLS) policies must be configured in Supabase
 * to ensure proper data security. The anon key should only have read access
 * or very limited write access through RLS policies.
 * 
 * RLS Policy Example for leads table:
 * 
 * -- Allow insert only from authenticated users
 * CREATE POLICY "Users can insert their own leads"
 * ON leads
 * FOR INSERT
 * WITH CHECK (auth.uid()::text = email);
 * 
 * -- Allow read access
 * CREATE POLICY "Anyone can read leads"
 * ON leads
 * FOR SELECT
 * USING (true);
 */
