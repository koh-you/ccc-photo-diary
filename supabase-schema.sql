-- CCC Supabase schema
-- Run this in Supabase SQL Editor after creating a project.

create table if not exists public.ccc_entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  payload jsonb not null,
  deleted_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.ccc_entries enable row level security;

drop policy if exists "ccc_entries_select_own" on public.ccc_entries;
drop policy if exists "ccc_entries_insert_own" on public.ccc_entries;
drop policy if exists "ccc_entries_update_own" on public.ccc_entries;
drop policy if exists "ccc_entries_delete_own" on public.ccc_entries;

create policy "ccc_entries_select_own"
on public.ccc_entries
for select
using (auth.uid() = user_id);

create policy "ccc_entries_insert_own"
on public.ccc_entries
for insert
with check (auth.uid() = user_id);

create policy "ccc_entries_update_own"
on public.ccc_entries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "ccc_entries_delete_own"
on public.ccc_entries
for delete
using (auth.uid() = user_id);

create index if not exists ccc_entries_updated_at_idx
on public.ccc_entries (user_id, updated_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ccc-photos',
  'ccc-photos',
  false,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ccc_photos_select_own" on storage.objects;
drop policy if exists "ccc_photos_insert_own" on storage.objects;
drop policy if exists "ccc_photos_update_own" on storage.objects;
drop policy if exists "ccc_photos_delete_own" on storage.objects;

create policy "ccc_photos_select_own"
on storage.objects
for select
using (
  bucket_id = 'ccc-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "ccc_photos_insert_own"
on storage.objects
for insert
with check (
  bucket_id = 'ccc-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "ccc_photos_update_own"
on storage.objects
for update
using (
  bucket_id = 'ccc-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'ccc-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "ccc_photos_delete_own"
on storage.objects
for delete
using (
  bucket_id = 'ccc-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
