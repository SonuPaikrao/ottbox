-- Create the 'admins' table
create table public.admins (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.admins enable row level security;

-- Allow anyone to read the admins list (needed for login check, or restrict to auth users)
-- Ideally, only authenticated users should read this to check if THEY are an admin.
create policy "Allow authenticated users to read admins"
  on public.admins for select
  to authenticated
  using (true);

-- Allow only service_role (Admin API) to insert/delete (Manual management via Supabase Console for now)
-- or you can insert your first admin manually in SQL Editor:
-- insert into public.admins (email) values ('your-email@gmail.com');
