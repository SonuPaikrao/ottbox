-- Add columns for device tracking
alter table public.analytics_logs 
add column if not exists device_type text, -- 'mobile', 'desktop', 'tablet'
add column if not exists browser text,
add column if not exists os text;

-- Add column for activity description
add column if not exists activity_type text default 'visit'; -- 'signup', 'login', 'watch', 'visit'
