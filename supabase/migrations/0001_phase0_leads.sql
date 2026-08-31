-- NavUrja — Phase 0 schema (website lead capture)
-- Already applied directly via the Supabase SQL Editor. Recorded here for
-- history; safe to re-run.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'converted', 'dead')),
  source text not null default 'website_pickup_form',

  name text not null,
  phone text not null,
  email text not null,
  business_name text not null,
  business_type text not null,
  pickup_location text not null,
  oil_quantity_kg numeric,
  pickup_date date,
  message text
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

-- Locked down: no policies = no access via the public anon key.
-- Only the server-side service role key (used in our API routes) can read/write.
alter table public.leads enable row level security;
alter table public.newsletter_subscribers enable row level security;
