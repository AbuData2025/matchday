-- Run this in the Supabase SQL Editor if you already ran the original schema.sql
-- (adds the "set your own next match" fields to profiles).

alter table public.profiles
  add column if not exists next_match_opponent text,
  add column if not exists next_match_kickoff timestamptz;
