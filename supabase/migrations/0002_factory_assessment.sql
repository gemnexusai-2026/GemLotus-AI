-- ============================================================
-- GemLotus AI
-- Module 2 — Factory Assessment
--
-- Purpose:
-- Complete evidence-first factory capability assessment.
--
-- Architecture:
-- assessment_snapshots
--        ↓
-- assessment_factory_profiles
--        ↓
-- assessment_factory_evidence
--
-- No scoring logic is hard-coded in UI.
-- ============================================================

create table if not exists public.assessment_factory_profiles (
  id uuid primary key default gen_random_uuid(),

  assessment_id uuid not null unique
    references public.assessment_snapshots(id)
    on delete cascade,

  created_by uuid
    references auth.users(id)
    on delete set null,

  -- ----------------------------------------------------------
  -- 01 FACTORY IDENTITY
  -- ----------------------------------------------------------

  factory_name text,
  ownership_type text,
  ownership_name text,

  factory_registration_number text,
  factory_license_number text,

  -- ----------------------------------------------------------
  -- 02 LOCATION
  -- ----------------------------------------------------------

  address_line1 text,
  address_line2 text,
  city text,
  district text,
  state text,
  pincode text,

  latitude numeric(12,8),
  longitude numeric(12,8),

  premises_type text,
  premises_area numeric(20,2),
  premises_area_unit text default 'sq_ft',

  -- ----------------------------------------------------------
  -- 03 INFRASTRUCTURE
  -- ----------------------------------------------------------

  built_up_area numeric(20,2),
  production_area numeric(20,2),
  storage_area numeric(20,2),
  office_area numeric(20,2),

  power_connection_available boolean default false,
  power_capacity numeric(20,2),
  power_capacity_unit text default 'kva',

  water_available boolean default false,
  drainage_available boolean default false,

  loading_unloading_available boolean default false,
  internal_transport_available boolean default false,

  -- ----------------------------------------------------------
  -- 04 MACHINERY
  -- ----------------------------------------------------------

  machinery_count integer default 0,
  owned_machinery_count integer default 0,
  leased_machinery_count integer default 0,

  machinery_details jsonb not null default '[]'::jsonb,

  -- ----------------------------------------------------------
  -- 05 MANUFACTURING PROCESS
  -- ----------------------------------------------------------

  manufacturing_process_available boolean default false,
  process_description text,

  process_flow_document_available boolean default false,

  -- ----------------------------------------------------------
  -- 06 PRODUCTION CAPACITY
  -- ----------------------------------------------------------

  production_capacity numeric(20,2),
  production_capacity_unit text,

  current_utilization_percent numeric(5,2),

  shifts_per_day integer,
  working_days_per_month integer,

  monthly_production_capacity numeric(20,2),

  -- ----------------------------------------------------------
  -- 07 MANPOWER
  -- ----------------------------------------------------------

  total_workers integer default 0,
  technical_workers integer default 0,
  supervisory_workers integer default 0,
  quality_workers integer default 0,

  manpower_details jsonb not null default '[]'::jsonb,

  -- ----------------------------------------------------------
  -- 08 QUALITY
  -- ----------------------------------------------------------

  quality_control_available boolean default false,
  quality_department_available boolean default false,

  inspection_process_available boolean default false,
  incoming_inspection_available boolean default false,
  in_process_inspection_available boolean default false,
  final_inspection_available boolean default false,

  quality_system_description text,

  -- ----------------------------------------------------------
  -- 09 TESTING
  -- ----------------------------------------------------------

  testing_facility_available boolean default false,

  testing_equipment_details jsonb not null default '[]'::jsonb,

  external_testing_used boolean default false,
  external_testing_details text,

  -- ----------------------------------------------------------
  -- 10 RAW MATERIAL / STORAGE
  -- ----------------------------------------------------------

  raw_material_storage_available boolean default false,
  finished_goods_storage_available boolean default false,

  inventory_control_available boolean default false,

  storage_details text,

  -- ----------------------------------------------------------
  -- 11 SAFETY / COMPLIANCE
  -- ----------------------------------------------------------

  fire_safety_available boolean default false,
  fire_noc_available boolean default false,

  electrical_safety_available boolean default false,
  worker_safety_system_available boolean default false,

  safety_training_available boolean default false,

  safety_details text,

  -- ----------------------------------------------------------
  -- 12 ASSESSMENT STATE
  -- ----------------------------------------------------------

  completion_percent numeric(5,2) not null default 0,

  readiness_score numeric(6,2) not null default 0,

  risk_level text not null default 'not_assessed',

  status text not null default 'draft',

  section_status jsonb not null default '{}'::jsonb,

  assessment_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint factory_completion_valid
    check (
      completion_percent >= 0
      and completion_percent <= 100
    ),

  constraint factory_readiness_valid
    check (
      readiness_score >= 0
      and readiness_score <= 100
    ),

  constraint factory_risk_level_valid
    check (
      risk_level in (
        'not_assessed',
        'low',
        'moderate',
        'high',
        'critical'
      )
    ),

  constraint factory_status_valid
    check (
      status in (
        'draft',
        'in_progress',
        'ready_for_review',
        'submitted',
        'under_review',
        'completed'
      )
    )
);


-- ============================================================
-- FACTORY EVIDENCE
-- ============================================================

create table if not exists public.assessment_factory_evidence (
  id uuid primary key default gen_random_uuid(),

  assessment_id uuid not null
    references public.assessment_snapshots(id)
    on delete cascade,

  factory_profile_id uuid
    references public.assessment_factory_profiles(id)
    on delete cascade,

  section_code text not null,

  evidence_type text not null,

  title text not null,

  description text,

  file_path text,

  file_name text,

  mime_type text,

  verification_status text not null default 'pending',

  verified_by uuid
    references auth.users(id)
    on delete set null,

  verified_at timestamptz,

  remarks text,

  created_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint factory_evidence_type_valid
    check (
      evidence_type in (
        'document',
        'photo',
        'video',
        'certificate',
        'declaration',
        'other'
      )
    ),

  constraint factory_evidence_verification_valid
    check (
      verification_status in (
        'pending',
        'accepted',
        'rejected',
        'needs_review'
      )
    )
);


create index if not exists idx_factory_profiles_assessment
on public.assessment_factory_profiles(assessment_id);


create index if not exists idx_factory_evidence_assessment
on public.assessment_factory_evidence(assessment_id);


create index if not exists idx_factory_evidence_section
on public.assessment_factory_evidence(
  assessment_id,
  section_code
);


-- ============================================================
-- UPDATED AT
-- ============================================================

drop trigger if exists trg_factory_profiles_updated_at
on public.assessment_factory_profiles;

create trigger trg_factory_profiles_updated_at
before update
on public.assessment_factory_profiles
for each row
execute function public.set_updated_at();


drop trigger if exists trg_factory_evidence_updated_at
on public.assessment_factory_evidence;

create trigger trg_factory_evidence_updated_at
before update
on public.assessment_factory_evidence
for each row
execute function public.set_updated_at();


-- ============================================================
-- RLS
-- ============================================================

alter table public.assessment_factory_profiles
enable row level security;

alter table public.assessment_factory_evidence
enable row level security;


-- ============================================================
-- PROFILE POLICIES
-- ============================================================

create policy factory_profile_owner_select
on public.assessment_factory_profiles
for select
to authenticated
using (
  created_by = auth.uid()
  or public.is_admin()
);


create policy factory_profile_owner_insert
on public.assessment_factory_profiles
for insert
to authenticated
with check (
  created_by = auth.uid()
  or public.is_admin()
);


create policy factory_profile_owner_update
on public.assessment_factory_profiles
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
-- EVIDENCE POLICIES
-- ============================================================

create policy factory_evidence_owner_select
on public.assessment_factory_evidence
for select
to authenticated
using (
  created_by = auth.uid()
  or public.is_admin()
);


create policy factory_evidence_owner_insert
on public.assessment_factory_evidence
for insert
to authenticated
with check (
  created_by = auth.uid()
  or public.is_admin()
);


create policy factory_evidence_owner_update
on public.assessment_factory_evidence
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


-- No DELETE for assessment evidence.
-- Historical evidence should remain auditable.


grant select, insert, update
on public.assessment_factory_profiles
to authenticated;


grant select, insert, update
on public.assessment_factory_evidence
to authenticated;


-- ============================================================
-- END MODULE 2
-- ============================================================