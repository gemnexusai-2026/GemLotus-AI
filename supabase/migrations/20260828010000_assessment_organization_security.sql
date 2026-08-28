-- GemLotus AI — Organization Scoped Assessment Security
-- Phase 1: OEM Assessment OS

drop policy if exists assessment_snapshots_owner_read
  on public.assessment_snapshots;

drop policy if exists assessment_snapshots_owner_insert
  on public.assessment_snapshots;

drop policy if exists assessment_snapshots_owner_update
  on public.assessment_snapshots;

create policy assessment_snapshots_organization_read
on public.assessment_snapshots
for select
to authenticated
using (
  (
    organization_id is not null
    and exists (
      select 1
      from public.organization_members om
      where om.organization_id = assessment_snapshots.organization_id
        and om.user_id = auth.uid()
    )
  )
  or (
    organization_id is null
    and created_by = auth.uid()
  )
  or public.is_admin()
);

create policy assessment_snapshots_organization_insert
on public.assessment_snapshots
for insert
to authenticated
with check (
  (
    organization_id is not null
    and exists (
      select 1
      from public.organization_members om
      where om.organization_id = assessment_snapshots.organization_id
        and om.user_id = auth.uid()
    )
    and created_by = auth.uid()
  )
  or (
    organization_id is null
    and created_by = auth.uid()
  )
  or public.is_admin()
);

create policy assessment_snapshots_organization_update
on public.assessment_snapshots
for update
to authenticated
using (
  (
    organization_id is not null
    and exists (
      select 1
      from public.organization_members om
      where om.organization_id = assessment_snapshots.organization_id
        and om.user_id = auth.uid()
    )
  )
  or (
    organization_id is null
    and created_by = auth.uid()
  )
  or public.is_admin()
)
with check (
  (
    organization_id is not null
    and exists (
      select 1
      from public.organization_members om
      where om.organization_id = assessment_snapshots.organization_id
        and om.user_id = auth.uid()
    )
    and created_by = auth.uid()
  )
  or (
    organization_id is null
    and created_by = auth.uid()
  )
  or public.is_admin()
);
