-- ============================================================
-- GemLotus AI
-- Module 1 — Assessment Definition Foundation
-- Migration: 0001_assessment_definition_foundation.sql
--
-- Canonical order:
-- entity_types
-- → oem_sub_types
-- → checklist_categories
-- → checklist_items
-- → fee_slabs
-- → assessment_rules
-- → assessment_snapshots
--
-- Design principles:
-- 1. Database-driven assessment definition
-- 2. One Master Assessment Core
-- 3. No hard-coded checklist
-- 4. Versionable definitions
-- 5. Snapshot-based assessment integrity
-- 6. Deterministic fee resolution
-- 7. RLS-first security
-- ============================================================


-- ============================================================
-- EXTENSIONS
-- ============================================================

create extension if not exists pgcrypto;


-- ============================================================
-- COMMON UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 1. ENTITY TYPES
-- ============================================================

create table if not exists public.entity_types (
  id uuid primary key default gen_random_uuid(),

  code text not null unique,
  name text not null,
  description text,

  is_active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint entity_types_code_format
    check (code ~ '^[a-z0-9_]+$')
);


create index if not exists idx_entity_types_active_sort
  on public.entity_types (is_active, sort_order);


drop trigger if exists trg_entity_types_updated_at
  on public.entity_types;

create trigger trg_entity_types_updated_at
before update on public.entity_types
for each row
execute function public.set_updated_at();


-- ============================================================
-- 2. OEM SUB TYPES
-- ============================================================

create table if not exists public.oem_sub_types (
  id uuid primary key default gen_random_uuid(),

  entity_type_id uuid not null
    references public.entity_types(id)
    on delete restrict,

  code text not null unique,
  name text not null,
  description text,

  is_active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint oem_sub_types_code_format
    check (code ~ '^[a-z0-9_]+$')
);


create index if not exists idx_oem_sub_types_entity
  on public.oem_sub_types (entity_type_id);

create index if not exists idx_oem_sub_types_active_sort
  on public.oem_sub_types (is_active, sort_order);


drop trigger if exists trg_oem_sub_types_updated_at
  on public.oem_sub_types;

create trigger trg_oem_sub_types_updated_at
before update on public.oem_sub_types
for each row
execute function public.set_updated_at();


-- ============================================================
-- 3. CHECKLIST CATEGORIES
-- EXACT CANONICAL 13-CATEGORY ORDER
-- ============================================================

create table if not exists public.checklist_categories (
  id uuid primary key default gen_random_uuid(),

  code text not null unique,
  name text not null,
  description text,

  sort_order integer not null unique,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint checklist_categories_code_format
    check (code ~ '^[a-z0-9_]+$'),

  constraint checklist_categories_sort_order_positive
    check (sort_order > 0)
);


create index if not exists idx_checklist_categories_active_sort
  on public.checklist_categories (is_active, sort_order);


drop trigger if exists trg_checklist_categories_updated_at
  on public.checklist_categories;

create trigger trg_checklist_categories_updated_at
before update on public.checklist_categories
for each row
execute function public.set_updated_at();


-- ============================================================
-- 4. CHECKLIST ITEMS
-- ============================================================

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),

  category_id uuid not null
    references public.checklist_categories(id)
    on delete restrict,

  code text not null unique,
  title text not null,
  description text,

  item_type text not null default 'document',

  is_mandatory boolean not null default false,

  evidence_required boolean not null default true,

  applicability jsonb not null default '{}'::jsonb,

  evidence_requirements jsonb not null default '{}'::jsonb,

  scoring_weight numeric(8,3) not null default 0,

  version integer not null default 1,

  is_active boolean not null default true,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint checklist_items_item_type
    check (
      item_type in (
        'document',
        'physical',
        'process',
        'verification',
        'photo',
        'video',
        'financial',
        'certificate',
        'declaration',
        'other'
      )
    ),

  constraint checklist_items_weight_nonnegative
    check (scoring_weight >= 0),

  constraint checklist_items_version_positive
    check (version > 0)
);


create index if not exists idx_checklist_items_category
  on public.checklist_items (category_id);

create index if not exists idx_checklist_items_active
  on public.checklist_items (is_active);

create index if not exists idx_checklist_items_applicability
  on public.checklist_items using gin (applicability);


drop trigger if exists trg_checklist_items_updated_at
  on public.checklist_items;

create trigger trg_checklist_items_updated_at
before update on public.checklist_items
for each row
execute function public.set_updated_at();


-- ============================================================
-- 5. FEE SLABS
--
-- Deterministic fee inputs:
-- entity type
-- OEM subtype
-- turnover slab
-- assessment type
-- ============================================================

create table if not exists public.fee_slabs (
  id uuid primary key default gen_random_uuid(),

  entity_type_id uuid not null
    references public.entity_types(id)
    on delete restrict,

  oem_sub_type_id uuid
    references public.oem_sub_types(id)
    on delete restrict,

  assessment_type text not null,

  turnover_slab_code text not null,

  min_turnover numeric(20,2),
  max_turnover numeric(20,2),

  currency_code char(3) not null default 'INR',

  base_fee numeric(20,2) not null,

  gst_percent numeric(5,2) not null default 18.00,

  is_active boolean not null default true,

  version integer not null default 1,

  effective_from timestamptz not null default now(),
  effective_until timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fee_slabs_base_fee_nonnegative
    check (base_fee >= 0),

  constraint fee_slabs_gst_valid
    check (gst_percent >= 0 and gst_percent <= 100),

  constraint fee_slabs_turnover_valid
    check (
      min_turnover is null
      or max_turnover is null
      or min_turnover <= max_turnover
    ),

  constraint fee_slabs_currency_upper
    check (currency_code = upper(currency_code)),

  constraint fee_slabs_version_positive
    check (version > 0)
);


create index if not exists idx_fee_slabs_resolution
  on public.fee_slabs (
    entity_type_id,
    oem_sub_type_id,
    assessment_type,
    turnover_slab_code,
    is_active
  );


drop trigger if exists trg_fee_slabs_updated_at
  on public.fee_slabs;

create trigger trg_fee_slabs_updated_at
before update on public.fee_slabs
for each row
execute function public.set_updated_at();


-- ============================================================
-- 6. ASSESSMENT RULES
-- ============================================================

create table if not exists public.assessment_rules (
  id uuid primary key default gen_random_uuid(),

  code text not null unique,
  name text not null,
  description text,

  rule_type text not null,

  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '{}'::jsonb,

  priority integer not null default 100,

  version integer not null default 1,

  is_active boolean not null default true,

  effective_from timestamptz not null default now(),
  effective_until timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint assessment_rules_priority_positive
    check (priority > 0),

  constraint assessment_rules_version_positive
    check (version > 0)
);


create index if not exists idx_assessment_rules_active_priority
  on public.assessment_rules (is_active, priority);

create index if not exists idx_assessment_rules_conditions
  on public.assessment_rules using gin (conditions);


drop trigger if exists trg_assessment_rules_updated_at
  on public.assessment_rules;

create trigger trg_assessment_rules_updated_at
before update on public.assessment_rules
for each row
execute function public.set_updated_at();


-- ============================================================
-- 7. ASSESSMENT SNAPSHOTS
--
-- Snapshot freezes the definition used by an assessment.
--
-- This prevents future checklist/rule/fee changes from
-- silently changing historical assessments.
-- ============================================================

create table if not exists public.assessment_snapshots (
  id uuid primary key default gen_random_uuid(),

  created_by uuid
    references auth.users(id)
    on delete set null,

  entity_type_id uuid not null
    references public.entity_types(id)
    on delete restrict,

  oem_sub_type_id uuid
    references public.oem_sub_types(id)
    on delete restrict,

  assessment_type text not null,

  turnover_amount numeric(20,2),
  turnover_slab_code text,

  definition_version integer not null default 1,

  checklist_snapshot jsonb not null default '[]'::jsonb,
  rules_snapshot jsonb not null default '[]'::jsonb,
  fee_snapshot jsonb not null default '{}'::jsonb,

  base_fee numeric(20,2),
  gst_percent numeric(5,2),
  gst_amount numeric(20,2),
  total_fee numeric(20,2),

  payment_status text not null default 'unpaid',

  status text not null default 'draft',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint assessment_snapshots_payment_status
    check (
      payment_status in (
        'unpaid',
        'pending',
        'paid',
        'failed',
        'refunded'
      )
    ),

  constraint assessment_snapshots_status
    check (
      status in (
        'draft',
        'active',
        'in_progress',
        'submitted',
        'under_review',
        'completed',
        'cancelled'
      )
    ),

  constraint assessment_snapshots_definition_version
    check (definition_version > 0)
);


create index if not exists idx_assessment_snapshots_created_by
  on public.assessment_snapshots (created_by);

create index if not exists idx_assessment_snapshots_entity
  on public.assessment_snapshots (
    entity_type_id,
    oem_sub_type_id
  );

create index if not exists idx_assessment_snapshots_status
  on public.assessment_snapshots (status);


drop trigger if exists trg_assessment_snapshots_updated_at
  on public.assessment_snapshots;

create trigger trg_assessment_snapshots_updated_at
before update on public.assessment_snapshots
for each row
execute function public.set_updated_at();


-- ============================================================
-- SEED: ENTITY TYPES
-- ============================================================

insert into public.entity_types
  (code, name, description, sort_order)
values
  (
    'oem_manufacturer',
    'OEM / Manufacturer',
    'Indian OEM or manufacturer operating its own manufacturing capability.',
    1
  ),
  (
    'indian_oem_reseller',
    'Indian OEM Reseller',
    'Indian reseller representing or distributing OEM products.',
    2
  ),
  (
    'foreign_oem_reseller',
    'Foreign OEM Reseller',
    'Indian entity representing or reselling a foreign OEM.',
    3
  ),
  (
    'service_provider',
    'Service Provider',
    'Entity primarily providing services rather than manufactured products.',
    4
  )
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();


-- ============================================================
-- SEED: OEM SUB TYPES
--
-- Canonical Form A / OEM-Manufacturer subtypes
-- ============================================================

insert into public.oem_sub_types
  (
    entity_type_id,
    code,
    name,
    description,
    sort_order
  )
select
  et.id,
  v.code,
  v.name,
  v.description,
  v.sort_order
from public.entity_types et
cross join (
  values
    (
      'in_house_manufacturing',
      'In-house Manufacturing',
      'Products are manufactured within the OEM/manufacturer own facility.',
      1
    ),
    (
      'third_party_contract_manufacturing',
      'Third-party / Contract Manufacturing',
      'Products are manufactured through an external third-party or contract manufacturer.',
      2
    ),
    (
      'deemed_oem',
      'Deemed OEM',
      'Entity qualifies under the applicable deemed-OEM definition.',
      3
    ),
    (
      'brand_owner',
      'Brand Owner',
      'Entity owns the product brand and is responsible for the applicable OEM representation.',
      4
    )
) as v(code, name, description, sort_order)
where et.code = 'oem_manufacturer'
on conflict (code) do update
set
  entity_type_id = excluded.entity_type_id,
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();


-- ============================================================
-- SEED: CANONICAL 13 CHECKLIST CATEGORIES
-- ============================================================

insert into public.checklist_categories
  (code, name, description, sort_order)
values
  (
    'legal_documentation',
    'Legal Documentation',
    'Legal identity, registration and statutory documentation.',
    1
  ),
  (
    'product_information',
    'Product Information',
    'Product identity, specifications, catalogues and related information.',
    2
  ),
  (
    'order_history',
    'Order History',
    'Historical orders, supply records and relevant transaction evidence.',
    3
  ),
  (
    'compliance_assurance',
    'Compliance & Assurance',
    'Regulatory, statutory, certification and assurance evidence.',
    4
  ),
  (
    'process_documentation',
    'Process Documentation',
    'Manufacturing, operational and documented process controls.',
    5
  ),
  (
    'operational_efficiency',
    'Operational Efficiency',
    'Operational capability, capacity and efficiency evidence.',
    6
  ),
  (
    'quality_assurance',
    'Quality Assurance',
    'Quality management systems and assurance practices.',
    7
  ),
  (
    'territory_logistics',
    'Territory & Logistics',
    'Geographic coverage, delivery capability and logistics readiness.',
    8
  ),
  (
    'supplier_management',
    'Supplier Management',
    'Supplier qualification, sourcing and supplier-control practices.',
    9
  ),
  (
    'quality_control_customer_service',
    'Quality Control & Customer Service',
    'Quality control systems, complaint handling and customer service capability.',
    10
  ),
  (
    'safety_standards',
    'Safety Standards',
    'Workplace, product and operational safety controls.',
    11
  ),
  (
    'warranty_r_and_d',
    'Warranty & R&D',
    'Warranty capability, product support and research/development capability.',
    12
  ),
  (
    'intellectual_property',
    'Intellectual Property',
    'Trademarks, patents, designs, copyrights and related IP evidence.',
    13
  )
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();


-- ============================================================
-- RLS
-- ============================================================

alter table public.entity_types enable row level security;
alter table public.oem_sub_types enable row level security;
alter table public.checklist_categories enable row level security;
alter table public.checklist_items enable row level security;
alter table public.fee_slabs enable row level security;
alter table public.assessment_rules enable row level security;
alter table public.assessment_snapshots enable row level security;


-- ============================================================
-- ADMIN HELPER
--
-- Admin role is expected inside Supabase auth app_metadata:
--
-- {
--   "role": "admin"
-- }
--
-- This avoids exposing write access to normal authenticated users.
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    auth.jwt() -> 'app_metadata' ->> 'role',
    ''
  ) = 'admin';
$$;


-- ============================================================
-- READ POLICIES
-- ============================================================

drop policy if exists entity_types_authenticated_read
  on public.entity_types;

create policy entity_types_authenticated_read
on public.entity_types
for select
to authenticated
using (true);


drop policy if exists oem_sub_types_authenticated_read
  on public.oem_sub_types;

create policy oem_sub_types_authenticated_read
on public.oem_sub_types
for select
to authenticated
using (true);


drop policy if exists checklist_categories_authenticated_read
  on public.checklist_categories;

create policy checklist_categories_authenticated_read
on public.checklist_categories
for select
to authenticated
using (true);


drop policy if exists checklist_items_authenticated_read
  on public.checklist_items;

create policy checklist_items_authenticated_read
on public.checklist_items
for select
to authenticated
using (true);


drop policy if exists fee_slabs_authenticated_read
  on public.fee_slabs;

create policy fee_slabs_authenticated_read
on public.fee_slabs
for select
to authenticated
using (true);


drop policy if exists assessment_rules_authenticated_read
  on public.assessment_rules;

create policy assessment_rules_authenticated_read
on public.assessment_rules
for select
to authenticated
using (true);


-- ============================================================
-- ADMIN WRITE POLICIES
-- ============================================================

drop policy if exists entity_types_admin_insert
  on public.entity_types;

create policy entity_types_admin_insert
on public.entity_types
for insert
to authenticated
with check (public.is_admin());


drop policy if exists entity_types_admin_update
  on public.entity_types;

create policy entity_types_admin_update
on public.entity_types
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


drop policy if exists entity_types_admin_delete
  on public.entity_types;

create policy entity_types_admin_delete
on public.entity_types
for delete
to authenticated
using (public.is_admin());


drop policy if exists oem_sub_types_admin_insert
  on public.oem_sub_types;

create policy oem_sub_types_admin_insert
on public.oem_sub_types
for insert
to authenticated
with check (public.is_admin());


drop policy if exists oem_sub_types_admin_update
  on public.oem_sub_types;

create policy oem_sub_types_admin_update
on public.oem_sub_types
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


drop policy if exists oem_sub_types_admin_delete
  on public.oem_sub_types;

create policy oem_sub_types_admin_delete
on public.oem_sub_types
for delete
to authenticated
using (public.is_admin());


drop policy if exists checklist_categories_admin_insert
  on public.checklist_categories;

create policy checklist_categories_admin_insert
on public.checklist_categories
for insert
to authenticated
with check (public.is_admin());


drop policy if exists checklist_categories_admin_update
  on public.checklist_categories;

create policy checklist_categories_admin_update
on public.checklist_categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


drop policy if exists checklist_categories_admin_delete
  on public.checklist_categories;

create policy checklist_categories_admin_delete
on public.checklist_categories
for delete
to authenticated
using (public.is_admin());


drop policy if exists checklist_items_admin_insert
  on public.checklist_items;

create policy checklist_items_admin_insert
on public.checklist_items
for insert
to authenticated
with check (public.is_admin());


drop policy if exists checklist_items_admin_update
  on public.checklist_items;

create policy checklist_items_admin_update
on public.checklist_items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


drop policy if exists checklist_items_admin_delete
  on public.checklist_items;

create policy checklist_items_admin_delete
on public.checklist_items
for delete
to authenticated
using (public.is_admin());


drop policy if exists fee_slabs_admin_insert
  on public.fee_slabs;

create policy fee_slabs_admin_insert
on public.fee_slabs
for insert
to authenticated
with check (public.is_admin());


drop policy if exists fee_slabs_admin_update
  on public.fee_slabs;

create policy fee_slabs_admin_update
on public.fee_slabs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


drop policy if exists fee_slabs_admin_delete
  on public.fee_slabs;

create policy fee_slabs_admin_delete
on public.fee_slabs
for delete
to authenticated
using (public.is_admin());


drop policy if exists assessment_rules_admin_insert
  on public.assessment_rules;

create policy assessment_rules_admin_insert
on public.assessment_rules
for insert
to authenticated
with check (public.is_admin());


drop policy if exists assessment_rules_admin_update
  on public.assessment_rules;

create policy assessment_rules_admin_update
on public.assessment_rules
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


drop policy if exists assessment_rules_admin_delete
  on public.assessment_rules;

create policy assessment_rules_admin_delete
on public.assessment_rules
for delete
to authenticated
using (public.is_admin());


-- ============================================================
-- ASSESSMENT SNAPSHOT SECURITY
-- ============================================================

drop policy if exists assessment_snapshots_owner_read
  on public.assessment_snapshots;

create policy assessment_snapshots_owner_read
on public.assessment_snapshots
for select
to authenticated
using (
  created_by = auth.uid()
  or public.is_admin()
);


drop policy if exists assessment_snapshots_owner_insert
  on public.assessment_snapshots;

create policy assessment_snapshots_owner_insert
on public.assessment_snapshots
for insert
to authenticated
with check (
  created_by = auth.uid()
  or public.is_admin()
);


drop policy if exists assessment_snapshots_owner_update
  on public.assessment_snapshots;

create policy assessment_snapshots_owner_update
on public.assessment_snapshots
for update
to authenticated
using (
  created_by = auth.uid()
  or public.is_admin()
)
with check (
  created_by = auth.uid()
  or public.is_admin()
);


-- ============================================================
-- END OF MODULE 1 FOUNDATION MIGRATION
-- ============================================================