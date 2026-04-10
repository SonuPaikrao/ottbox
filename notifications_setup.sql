-- Create Notifications Table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade, -- null for global? or specific user
  title text not null,
  message text not null,
  type text default 'info', -- 'info', 'warning', 'success', 'error'
  is_global boolean default false, -- if true, shown to all users
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table notifications enable row level security;

-- Policies
-- Users can view their own notifications
create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id or is_global = true);

-- Admins can view/insert/update/delete all (handled via service role in API, but good to have)
-- (Skipping specific admin RLS as we use Service Role for admin ops)
