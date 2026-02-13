-- Create the watch_parties table
create table public.watch_parties (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  creator_id uuid not null default auth.uid (),
  creator_username text not null,
  movie_id text not null,
  constraint watch_parties_pkey primary key (id),
  constraint watch_parties_creator_id_fkey foreign key (creator_id) references auth.users (id) on delete cascade
) tablespace pg_default;

-- Enable RLS
alter table public.watch_parties enable row level security;

-- Policy: Everyone can read parties (so they can join)
create policy "Enable read access for all users"
on public.watch_parties
as permissive
for select
to public
using (true);

-- Policy: Only authenticated users can insert (create) parties
create policy "Enable insert for authenticated users only"
on public.watch_parties
as permissive
for insert
to authenticated
with check ((auth.uid() = creator_id));

-- Realtime: Enable listening to this table (optional, for listing parties later)
alter publication supabase_realtime add table public.watch_parties;
