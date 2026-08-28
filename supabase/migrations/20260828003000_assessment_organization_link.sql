-- GemLotus AI — Assessment Organization Link
-- Phase 1: OEM Assessment OS

alter table public.assessment_snapshots
  add column if not exists organization_id uuid
  references public.organizations(id)
  on delete restrict;

create index if not exists idx_assessment_snapshots_organization
  on public.assessment_snapshots(organization_id);
