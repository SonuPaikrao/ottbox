-- Analytics Table to track user locations
create table if not exists public.analytics_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  ip_address text,
  country text,
  region text,
  city text,
  latitude float,
  longitude float,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Allow anyone (anon) to insert logs (so we track guests too)
alter table public.analytics_logs enable row level security;

create policy "Enable insert for all users"
  on public.analytics_logs for insert
  to anon, authenticated
  with check (true);

-- RLS: Only admins can view logs
create policy "Enable select for admins only"
  on public.analytics_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.admins 
      where email = auth.jwt() ->> 'email'
    )
  );
