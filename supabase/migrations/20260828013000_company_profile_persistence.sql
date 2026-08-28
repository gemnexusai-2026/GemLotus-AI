-- GemLotus AI — Company Legal Profile Persistence
-- Phase 1: OEM Assessment OS

create table if not exists public.assessment_company_profiles (
  id uuid primary key default gen_random_uuid(),

  assessment_id uuid not null unique
    references public.assessment_snapshots(id)
    on delete cascade,

  organization_id uuid
    references public.organizations(id)
    on delete restrict,

  company_id text not null,

  company_data jsonb not null default '{}'::jsonb,

  created_by uuid not null
    references auth.users(id)
    on delete restrict,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assessment_company_profiles add column if not exists organization_id uuid references public.organizations(id) on delete restrict;

create index if not exists idx_assessment_company_profiles_assessment
  on public.assessment_company_profiles(assessment_id);

create index if not exists idx_assessment_company_profiles_organization
  on public.assessment_company_profiles(organization_id);

alter table public.assessment_company_profiles enable row level security;

drop policy if exists assessment_company_profiles_select
  on public.assessment_company_profiles;

drop policy if exists assessment_company_profiles_insert
  on public.assessment_company_profiles;

drop policy if exists assessment_company_profiles_update
  on public.assessment_company_profiles;

drop policy if exists assessment_company_profiles_delete
  on public.assessment_company_profiles;

create policy assessment_company_profiles_select
on public.assessment_company_profiles
for select
to authenticated
using (
  (
    organization_id is not null
    and exists (
      select 1
      from public.organization_members om
      where om.organization_id = assessment_company_profiles.organization_id
        and om.user_id = auth.uid()
    )
  )
  or (
    organization_id is null
    and created_by = auth.uid()
  )
  or public.is_admin()
);

create policy assessment_company_profiles_insert
on public.assessment_company_profiles
for insert
to authenticated
with check (
  (
    created_by = auth.uid()
    and (
      (
        organization_id is not null
        and exists (
          select 1
          from public.organization_members om
          where om.organization_id = assessment_company_profiles.organization_id
            and om.user_id = auth.uid()
        )
      )
      or organization_id is null
    )
  )
  or public.is_admin()
);

create policy assessment_company_profiles_update
on public.assessment_company_profiles
for update
to authenticated
using (
  (
    organization_id is not null
    and exists (
      select 1
      from public.organization_members om
      where om.organization_id = assessment_company_profiles.organization_id
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
    created_by = auth.uid()
    and (
      (
        organization_id is not null
        and exists (
          select 1
          from public.organization_members om
          where om.organization_id = assessment_company_profiles.organization_id
            and om.user_id = auth.uid()
        )
      )
      or organization_id is null
    )
  )
  or public.is_admin()
);

create policy assessment_company_profiles_delete
on public.assessment_company_profiles
for delete
to authenticated
using (
  created_by = auth.uid()
  or public.is_admin()
);

create or replace function public.set_assessment_company_profiles_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_assessment_company_profiles_updated_at
  on public.assessment_company_profiles;

create trigger trg_assessment_company_profiles_updated_at
before update on public.assessment_company_profiles
for each row
execute function public.set_assessment_company_profiles_updated_at();

