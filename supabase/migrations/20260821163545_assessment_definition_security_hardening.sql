-- ============================================================
-- GemLotus AI
-- Module 1 — Assessment Definition Security Hardening
--
-- Purpose:
-- 1. Remove anonymous access to assessment definitions
-- 2. Remove duplicate SELECT policies
-- 3. Keep authenticated users read-only on definitions
-- 4. Keep admin-only definition writes through RLS
-- 5. Preserve owner/admin snapshot security
-- 6. Do NOT modify the original 0001 migration
-- ============================================================


-- ============================================================
-- 1. REMOVE ANONYMOUS SELECT POLICIES
-- ============================================================

drop policy if exists assessment_entity_types_select
  on public.entity_types;

drop policy if exists assessment_oem_sub_types_select
  on public.oem_sub_types;

drop policy if exists assessment_checklist_categories_select
  on public.checklist_categories;

drop policy if exists assessment_checklist_items_select
  on public.checklist_items;

drop policy if exists assessment_fee_slabs_select
  on public.fee_slabs;

drop policy if exists assessment_rules_select
  on public.assessment_rules;


-- ============================================================
-- 2. REMOVE ANONYMOUS TABLE PRIVILEGES
--
-- RLS is the security boundary, but database privileges should
-- also follow least-privilege principles.
-- ============================================================

revoke all
on table public.entity_types
from anon;

revoke all
on table public.oem_sub_types
from anon;

revoke all
on table public.checklist_categories
from anon;

revoke all
on table public.checklist_items
from anon;

revoke all
on table public.fee_slabs
from anon;

revoke all
on table public.assessment_rules
from anon;

revoke all
on table public.assessment_snapshots
from anon;


-- ============================================================
-- 3. REMOVE EXCESS AUTHENTICATED TABLE PRIVILEGES
--
-- We explicitly grant only the operations required by the
-- current Module 1 architecture.
-- ============================================================

revoke all
on table public.entity_types
from authenticated;

revoke all
on table public.oem_sub_types
from authenticated;

revoke all
on table public.checklist_categories
from authenticated;

revoke all
on table public.checklist_items
from authenticated;

revoke all
on table public.fee_slabs
from authenticated;

revoke all
on table public.assessment_rules
from authenticated;

revoke all
on table public.assessment_snapshots
from authenticated;


-- ============================================================
-- 4. AUTHENTICATED DEFINITION READ ACCESS
--
-- Normal authenticated users may read active definition data.
-- RLS determines which rows are visible.
-- ============================================================

grant select
on table public.entity_types
to authenticated;

grant select
on table public.oem_sub_types
to authenticated;

grant select
on table public.checklist_categories
to authenticated;

grant select
on table public.checklist_items
to authenticated;

grant select
on table public.fee_slabs
to authenticated;

grant select
on table public.assessment_rules
to authenticated;


-- ============================================================
-- 5. AUTHENTICATED WRITE PRIVILEGES
--
-- RLS policies restrict these operations to administrators.
--
-- This means:
--
-- Normal authenticated user:
-- SELECT only
--
-- Admin:
-- SELECT + INSERT + UPDATE + DELETE
-- ============================================================

grant insert, update, delete
on table public.entity_types
to authenticated;

grant insert, update, delete
on table public.oem_sub_types
to authenticated;

grant insert, update, delete
on table public.checklist_categories
to authenticated;

grant insert, update, delete
on table public.checklist_items
to authenticated;

grant insert, update, delete
on table public.fee_slabs
to authenticated;

grant insert, update, delete
on table public.assessment_rules
to authenticated;


-- ============================================================
-- 6. ASSESSMENT SNAPSHOT PRIVILEGES
--
-- Snapshots are user-owned historical records.
--
-- Current architecture allows:
-- SELECT
-- INSERT
-- UPDATE
--
-- DELETE is intentionally NOT granted.
-- Historical assessment snapshots should not be casually deleted.
-- ============================================================

grant select, insert, update
on table public.assessment_snapshots
to authenticated;


-- ============================================================
-- 7. REMOVE DUPLICATE AUTHENTICATED SELECT POLICY
--
-- assessment_rules currently has both:
--
-- assessment_rules_authenticated_read
-- assessment_rules_select
--
-- Keep only the canonical authenticated-read policy.
-- ============================================================

drop policy if exists assessment_rules_select
  on public.assessment_rules;


-- ============================================================
-- 8. NORMALIZE ACTIVE-DEFINITION READ POLICIES
--
-- Recreate canonical authenticated-only policies so their
-- behavior is explicit and deterministic.
-- ============================================================

drop policy if exists entity_types_authenticated_read
  on public.entity_types;

create policy entity_types_authenticated_read
on public.entity_types
for select
to authenticated
using (
  is_active = true
);


drop policy if exists oem_sub_types_authenticated_read
  on public.oem_sub_types;

create policy oem_sub_types_authenticated_read
on public.oem_sub_types
for select
to authenticated
using (
  is_active = true
);


drop policy if exists checklist_categories_authenticated_read
  on public.checklist_categories;

create policy checklist_categories_authenticated_read
on public.checklist_categories
for select
to authenticated
using (
  is_active = true
);


drop policy if exists checklist_items_authenticated_read
  on public.checklist_items;

create policy checklist_items_authenticated_read
on public.checklist_items
for select
to authenticated
using (
  is_active = true
);


drop policy if exists fee_slabs_authenticated_read
  on public.fee_slabs;

create policy fee_slabs_authenticated_read
on public.fee_slabs
for select
to authenticated
using (
  is_active = true
);


drop policy if exists assessment_rules_authenticated_read
  on public.assessment_rules;

create policy assessment_rules_authenticated_read
on public.assessment_rules
for select
to authenticated
using (
  is_active = true
);


-- ============================================================
-- 9. VERIFY RLS IS ENABLED
-- ============================================================

alter table public.entity_types
  enable row level security;

alter table public.oem_sub_types
  enable row level security;

alter table public.checklist_categories
  enable row level security;

alter table public.checklist_items
  enable row level security;

alter table public.fee_slabs
  enable row level security;

alter table public.assessment_rules
  enable row level security;

alter table public.assessment_snapshots
  enable row level security;


-- ============================================================
-- 10. ENSURE ADMIN WRITE POLICIES EXIST
--
-- These are idempotent: existing policies are replaced.
-- ============================================================


-- ENTITY TYPES

drop policy if exists entity_types_admin_insert
  on public.entity_types;

create policy entity_types_admin_insert
on public.entity_types
for insert
to authenticated
with check (
  public.is_admin()
);


drop policy if exists entity_types_admin_update
  on public.entity_types;

create policy entity_types_admin_update
on public.entity_types
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


drop policy if exists entity_types_admin_delete
  on public.entity_types;

create policy entity_types_admin_delete
on public.entity_types
for delete
to authenticated
using (
  public.is_admin()
);


-- OEM SUB TYPES

drop policy if exists oem_sub_types_admin_insert
  on public.oem_sub_types;

create policy oem_sub_types_admin_insert
on public.oem_sub_types
for insert
to authenticated
with check (
  public.is_admin()
);


drop policy if exists oem_sub_types_admin_update
  on public.oem_sub_types;

create policy oem_sub_types_admin_update
on public.oem_sub_types
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


drop policy if exists oem_sub_types_admin_delete
  on public.oem_sub_types;

create policy oem_sub_types_admin_delete
on public.oem_sub_types
for delete
to authenticated
using (
  public.is_admin()
);


-- CHECKLIST CATEGORIES

drop policy if exists checklist_categories_admin_insert
  on public.checklist_categories;

create policy checklist_categories_admin_insert
on public.checklist_categories
for insert
to authenticated
with check (
  public.is_admin()
);


drop policy if exists checklist_categories_admin_update
  on public.checklist_categories;

create policy checklist_categories_admin_update
on public.checklist_categories
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


drop policy if exists checklist_categories_admin_delete
  on public.checklist_categories;

create policy checklist_categories_admin_delete
on public.checklist_categories
for delete
to authenticated
using (
  public.is_admin()
);


-- CHECKLIST ITEMS

drop policy if exists checklist_items_admin_insert
  on public.checklist_items;

create policy checklist_items_admin_insert
on public.checklist_items
for insert
to authenticated
with check (
  public.is_admin()
);


drop policy if exists checklist_items_admin_update
  on public.checklist_items;

create policy checklist_items_admin_update
on public.checklist_items
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


drop policy if exists checklist_items_admin_delete
  on public.checklist_items;

create policy checklist_items_admin_delete
on public.checklist_items
for delete
to authenticated
using (
  public.is_admin()
);


-- FEE SLABS

drop policy if exists fee_slabs_admin_insert
  on public.fee_slabs;

create policy fee_slabs_admin_insert
on public.fee_slabs
for insert
to authenticated
with check (
  public.is_admin()
);


drop policy if exists fee_slabs_admin_update
  on public.fee_slabs;

create policy fee_slabs_admin_update
on public.fee_slabs
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


drop policy if exists fee_slabs_admin_delete
  on public.fee_slabs;

create policy fee_slabs_admin_delete
on public.fee_slabs
for delete
to authenticated
using (
  public.is_admin()
);


-- ASSESSMENT RULES

drop policy if exists assessment_rules_admin_insert
  on public.assessment_rules;

create policy assessment_rules_admin_insert
on public.assessment_rules
for insert
to authenticated
with check (
  public.is_admin()
);


drop policy if exists assessment_rules_admin_update
  on public.assessment_rules;

create policy assessment_rules_admin_update
on public.assessment_rules
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


drop policy if exists assessment_rules_admin_delete
  on public.assessment_rules;

create policy assessment_rules_admin_delete
on public.assessment_rules
for delete
to authenticated
using (
  public.is_admin()
);


-- ============================================================
-- 11. SNAPSHOT SECURITY
--
-- Owner or admin only.
-- Delete remains intentionally unavailable.
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
-- END OF MODULE 1 SECURITY HARDENING
-- ============================================================