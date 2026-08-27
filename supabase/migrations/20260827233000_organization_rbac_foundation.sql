-- GemLotus AI — Organization RBAC Foundation
-- Phase 1: OEM Assessment OS

-- ============================================================
-- HELPER: CURRENT USER IS MEMBER OF ORGANIZATION
-- ============================================================

create or replace function public.is_organization_member(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = auth.uid()
  );
$$;

-- ============================================================
-- HELPER: CURRENT USER ROLE IN ORGANIZATION
-- ============================================================

create or replace function public.organization_role(
  target_organization_id uuid
)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.organization_members
  where organization_id = target_organization_id
    and user_id = auth.uid()
  limit 1;
$$;

-- ============================================================
-- HELPER: CURRENT USER IS ORG ADMIN / OWNER
-- ============================================================

create or replace function public.is_organization_admin(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

-- ============================================================
-- ORGANIZATIONS — READ
-- ============================================================

drop policy if exists organizations_member_select
  on public.organizations;

create policy organizations_member_select
on public.organizations
for select
to authenticated
using (
  public.is_organization_member(id)
  or created_by = auth.uid()
  or public.is_admin()
);

-- ============================================================
-- ORGANIZATIONS — INSERT
-- ============================================================

drop policy if exists organizations_owner_insert
  on public.organizations;

create policy organizations_owner_insert
on public.organizations
for insert
to authenticated
with check (
  created_by = auth.uid()
);

-- ============================================================
-- ORGANIZATIONS — UPDATE
-- ============================================================

drop policy if exists organizations_admin_update
  on public.organizations;

create policy organizations_admin_update
on public.organizations
for update
to authenticated
using (
  public.is_organization_admin(id)
  or public.is_admin()
)
with check (
  public.is_organization_admin(id)
  or public.is_admin()
);

-- ============================================================
-- ORGANIZATION MEMBERS — READ
-- ============================================================

drop policy if exists organization_members_member_select
  on public.organization_members;

create policy organization_members_member_select
on public.organization_members
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_organization_member(organization_id)
  or public.is_admin()
);

-- ============================================================
-- ORGANIZATION MEMBERS — INSERT
-- ============================================================

drop policy if exists organization_members_admin_insert
  on public.organization_members;

create policy organization_members_admin_insert
on public.organization_members
for insert
to authenticated
with check (
  public.is_organization_admin(organization_id)
  or public.is_admin()
);

-- ============================================================
-- ORGANIZATION MEMBERS — UPDATE
-- ============================================================

drop policy if exists organization_members_admin_update
  on public.organization_members;

create policy organization_members_admin_update
on public.organization_members
for update
to authenticated
using (
  public.is_organization_admin(organization_id)
  or public.is_admin()
)
with check (
  public.is_organization_admin(organization_id)
  or public.is_admin()
);


-- ============================================================
-- GRANTS
-- ============================================================

revoke execute
on function public.is_organization_member(uuid)
from public;

revoke execute
on function public.organization_role(uuid)
from public;

revoke execute
on function public.is_organization_admin(uuid)
from public;

grant execute
on function public.is_organization_member(uuid)
to authenticated;

grant execute
on function public.organization_role(uuid)
to authenticated;

grant execute
on function public.is_organization_admin(uuid)
to authenticated;

