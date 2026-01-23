import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
 * NOTE: Row Level Security (RLS) policies must be configured in Supabase
 * to ensure proper data security. The anon key should only have read access
 * or be protected by RLS policies that prevent unauthorized writes.
 *
 * IMPORTANT: Lead creation must go through the /api/leads endpoint
 * (server-side with rate limiting and bot protection), NOT direct inserts.
 * The public client should not have write access to the leads table.
 *
 * RLS Policy Example for leads table:
 *
 * -- Disable all access to leads table via public anon key
 * -- Only server-side (service role) can insert
 * CREATE POLICY "No public writes"
 * ON leads
 * FOR INSERT
 * WITH CHECK (false);
 *
 * -- Allow read-only access if needed for specific use cases
 * CREATE POLICY "Public read access"
 * ON leads
 * FOR SELECT
 * USING (true);
 *
 * -- Admin access (if using service role via server)
 * CREATE POLICY "Service role full access"
 * ON leads
 * USING (auth.role() = 'service_role');
 */
