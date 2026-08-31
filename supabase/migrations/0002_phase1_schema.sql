-- NavUrja — Phase 1 schema (backend + admin console)
-- Run this whole file in Supabase → SQL Editor. Safe to re-run (idempotent
-- table/column creation); adjust if you've hand-edited anything since.

-- ============================================================
-- Staff & FBO accounts (mirrors auth.users, adds role + org link)
-- ============================================================
create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  phone text,
  role text not null default 'fbo_owner'
    check (role in ('admin','city_manager','sales_exec','hub_operator','collector','fbo_owner','fbo_staff')),
  org_id uuid, -- logical ref to organizations(id); FK added below once that table exists
  active boolean not null default true
);

-- ============================================================
-- Organizations (FBOs) & their outlets
-- ============================================================
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  legal_name text not null,
  brand_name text,
  gstin text,
  fssai_license_no text,
  segment text not null
    check (segment in ('Restaurants','Hotels','Cloud Kitchens','Caterers','Food Businesses','Commercial Kitchens')),
  owner_user_id uuid, -- logical ref to app_users(id)
  owner_phone text,
  owner_email text,
  kyc_status text not null default 'pending' check (kyc_status in ('pending','verified','rejected')),
  rate_override_per_kg numeric,
  city text,
  status text not null default 'active' check (status in ('active','paused','churned')),
  lead_id uuid -- traceability back to the originating lead, FK added below
);

alter table public.app_users
  drop constraint if exists app_users_org_id_fkey;
alter table public.app_users
  add constraint app_users_org_id_fkey foreign key (org_id) references public.organizations(id);

create table if not exists public.outlets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text not null,
  city text not null,
  lat double precision,
  lng double precision,
  contact_name text,
  contact_phone text,
  access_notes text,
  pickup_cadence text not null default 'weekly'
    check (pickup_cadence in ('daily','twice_weekly','weekly','biweekly','on_demand')),
  status text not null default 'active' check (status in ('active','paused','churned'))
);

-- ============================================================
-- Leads (created in Phase 0) — link to the org they convert into
-- ============================================================
alter table public.leads add column if not exists converted_org_id uuid references public.organizations(id);
alter table public.leads add column if not exists assigned_to uuid references public.app_users(id);

alter table public.organizations
  drop constraint if exists organizations_lead_id_fkey;
alter table public.organizations
  add constraint organizations_lead_id_fkey foreign key (lead_id) references public.leads(id);

-- ============================================================
-- Rate cards — never hardcode a price in application code
-- ============================================================
create table if not exists public.rate_cards (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  city text not null,
  segment text not null
    check (segment in ('Restaurants','Hotels','Cloud Kitchens','Caterers','Food Businesses','Commercial Kitchens')),
  quality_grade text not null default 'standard' check (quality_grade in ('standard','premium','low')),
  rate_per_kg numeric not null,
  effective_from date not null default current_date,
  effective_to date,
  active boolean not null default true
);

-- ============================================================
-- Pickup requests & the collection ledger
-- ============================================================
create table if not exists public.pickup_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  requested_by uuid references public.app_users(id),
  requested_window_start timestamptz,
  requested_window_end timestamptz,
  estimated_kg numeric,
  status text not null default 'requested'
    check (status in ('requested','scheduled','assigned','in_progress','completed','failed','cancelled')),
  failure_reason text,
  assigned_collector_id uuid references public.app_users(id)
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  pickup_request_id uuid references public.pickup_requests(id),
  outlet_id uuid not null references public.outlets(id),
  collector_id uuid references public.app_users(id),
  collected_at timestamptz not null default now(),
  gross_kg numeric,
  tare_kg numeric,
  net_kg numeric not null check (net_kg > 0),
  quality_grade text not null default 'standard' check (quality_grade in ('standard','premium','low')),
  rate_per_kg numeric not null,
  deductions numeric not null default 0,
  gross_amount numeric generated always as (net_kg * rate_per_kg) stored,
  net_payable numeric generated always as (net_kg * rate_per_kg - deductions) stored,
  gps_lat double precision,
  gps_lng double precision,
  photo_url text,
  confirmation_otp_verified boolean not null default false,
  containers_in int not null default 0,
  containers_out int not null default 0,
  signature_url text,
  notes text,
  entered_by uuid references public.app_users(id),
  entry_method text not null default 'manual' check (entry_method in ('manual','app'))
);

-- ============================================================
-- Containers (the drum-tracking ECOIL builds "Refilled drum" features on)
-- ============================================================
create table if not exists public.hubs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  city text not null,
  name text not null,
  address text,
  storage_capacity_kg numeric,
  current_stock_kg numeric not null default 0
);

create table if not exists public.containers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text not null unique,
  type text not null check (type in ('barrel_200l','jerrycan_20l')),
  deposit_value numeric not null default 0,
  state text not null default 'at_hub' check (state in ('at_hub','with_outlet','in_transit','cleaning','retired')),
  current_outlet_id uuid references public.outlets(id),
  current_hub_id uuid references public.hubs(id)
);

create table if not exists public.container_movements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  container_id uuid not null references public.containers(id) on delete cascade,
  from_state text,
  to_state text not null,
  outlet_id uuid references public.outlets(id),
  collection_id uuid references public.collections(id),
  moved_by uuid references public.app_users(id)
);

-- ============================================================
-- Supply chain: hub -> processor
-- ============================================================
create table if not exists public.consignments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  hub_id uuid not null references public.hubs(id),
  dispatched_at timestamptz,
  total_kg numeric,
  weighbridge_slip_no text,
  lab_ffa_percent numeric,
  lab_moisture_percent numeric,
  sale_rate_per_kg numeric,
  invoice_no text,
  eway_bill_no text,
  processor_name text,
  status text not null default 'draft' check (status in ('draft','dispatched','delivered','invoiced'))
);

-- ============================================================
-- Money
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  mode text not null check (mode in ('cash','upi','bank','credit_note')),
  amount numeric not null,
  status text not null default 'pending' check (status in ('pending','settled','failed')),
  razorpay_ref text,
  settled_at timestamptz
);

create table if not exists public.cash_floats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  collector_id uuid not null references public.app_users(id),
  float_date date not null default current_date,
  opening_amount numeric not null default 0,
  disbursed_amount numeric not null default 0,
  closing_amount numeric,
  variance numeric generated always as (closing_amount - (opening_amount - disbursed_amount)) stored,
  reconciled boolean not null default false,
  unique (collector_id, float_date)
);

-- ============================================================
-- Compliance & impact
-- ============================================================
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  type text not null check (type in ('uco_disposal','carbon_reduction','carbon_credit')),
  period_start date not null,
  period_end date not null,
  aggregated_kg numeric not null,
  co2e_kg numeric,
  pdf_url text,
  serial_no text not null unique
);

create table if not exists public.impact_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null unique default current_date,
  total_kg_collected numeric not null default 0,
  total_businesses_served int not null default 0,
  total_cities int not null default 0,
  total_co2e_avoided_kg numeric not null default 0
);

-- ============================================================
-- RLS: locked down, same as Phase 0. No policies = no access via the
-- publishable/anon key. Every table is only ever touched by the Next.js
-- server (service role key) behind our own auth + role check in
-- middleware.ts. Add real per-role RLS policies before any client-side
-- Supabase calls are introduced (Phase 2/3 mobile apps will need them).
-- ============================================================
alter table public.app_users enable row level security;
alter table public.organizations enable row level security;
alter table public.outlets enable row level security;
alter table public.rate_cards enable row level security;
alter table public.pickup_requests enable row level security;
alter table public.collections enable row level security;
alter table public.hubs enable row level security;
alter table public.containers enable row level security;
alter table public.container_movements enable row level security;
alter table public.consignments enable row level security;
alter table public.payments enable row level security;
alter table public.cash_floats enable row level security;
alter table public.certificates enable row level security;
alter table public.impact_snapshots enable row level security;

-- ============================================================
-- Seed: one starter rate card so the admin console has something to show.
-- Adjust the number once you have a real quote from your first processor.
-- ============================================================
insert into public.rate_cards (city, segment, quality_grade, rate_per_kg)
select 'Jaipur', 'Restaurants', 'standard', 35
where not exists (select 1 from public.rate_cards);
