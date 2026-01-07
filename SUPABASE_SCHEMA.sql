-- Leads Table Schema
-- Run this in your Supabase SQL Editor

create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null,
  email text, -- Optional
  service_type text,
  is_emergency boolean default false,
  preferred_time_window text,
  source text,
  status text default 'new',
  notes text
);

-- Optional: Enable Row Level Security (RLS)
alter table public.leads enable row level security;

-- Policy: Allow inserts from anyone (anon)
create policy "Allow generic inserts"
on public.leads
for insert
to anon
with check (true);

-- Policy: Allow reads only for authenticated users (service role/admin)
create policy "Allow authenticated reads"
on public.leads
for select
to authenticated
using (true);
