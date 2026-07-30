-- MatchDay — Supabase schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run.

-- 1. Profiles: one row per account, keyed to the built-in auth.users table.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  club text not null default 'The Ballers FC',
  position text not null default 'Outfield',
  foot text not null default 'Right',
  height text not null default '—',
  jersey text not null default '—',
  theme jsonb not null,
  next_match_opponent text,
  next_match_kickoff timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone signed in can view profiles (needed so you can see your brother's name/theme).
create policy "profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- You can only create/edit your own profile row.
create policy "users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 2. Matches: one row per logged match, owned by the account that logged it.
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  opponent text not null,
  date date not null,
  home_team text not null,
  home_score int not null default 0,
  away_score int not null default 0,
  goals int not null default 0,
  assists int not null default 0,
  clean_sheet boolean not null default false,
  motm boolean not null default false,
  rating numeric not null default 0,
  position text not null default '',
  minutes int not null default 90,
  feeling text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;

-- Only the account that logged a match can see, add, edit, or delete it.
create policy "users can view their own matches"
  on public.matches for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert their own matches"
  on public.matches for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own matches"
  on public.matches for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete their own matches"
  on public.matches for delete
  to authenticated
  using (auth.uid() = user_id);
