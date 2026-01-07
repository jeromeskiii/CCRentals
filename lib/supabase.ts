
import { createClient } from '@supabase/supabase-js';

// Environment variables are validated in vite.config.ts
// They are defined at build time and will fail to build if missing
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
