-- 1. Create 'admins' table
create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.admins enable row level security;

-- 3. Policy: Allow authenticated users to check the whitelist
-- (This ensures the API/Frontend can query if the logged-in user is an admin)
create policy "Allow authenticated users to read admins"
  on public.admins for select
  to authenticated
  using (true);

-- 4. INSERT ADMIN EMAIL (Whitelist)
-- Ye command aapke email ko whitelist kar degi.
insert into public.admins (email)
values ('paikraov58@gmail.com')
on conflict (email) do nothing;

-- NOTE: 
-- Is query se sirf 'Permission' milegi.
-- Aapko 'Authentication' (Login) ke liye Supabase Dashboard > Authentication > Users mein jakar
-- User create karna padega (agar nahi hai) with:
-- Email: paikraov58@gmail.com
-- Password: AdminSonu@412
