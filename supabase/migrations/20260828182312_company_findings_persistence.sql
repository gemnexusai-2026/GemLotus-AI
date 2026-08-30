create table if not exists public.assessment_company_findings (
  id uuid primary key default gen_random_uuid(),

  assessment_id uuid not null
    references public.assessment_snapshots(id)
    on delete cascade,

  organization_id uuid
    references public.organizations(id)
    on delete restrict,

  company_id text not null,

  title text not null default '',
  description text not null default '',

  severity text not null default 'observation'
    check (
      severity in (
        'observation',
        'minor',
        'major',
        'critical'
      )
    ),

  requirement text not null default '',
  evidence_reference text not null default '',

  corrective_action text not null default '',

  corrective_action_status text not null default 'open'
    check (
      corrective_action_status in (
        'open',
        'in_progress',
        'closed'
      )
    ),

  remarks text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_company_findings_assessment
  on public.assessment_company_findings(assessment_id);

create index if not exists idx_company_findings_organization
  on public.assessment_company_findings(organization_id);

create index if not exists idx_company_findings_company
  on public.assessment_company_findings(company_id);

create index if not exists idx_company_findings_severity
  on public.assessment_company_findings(severity);

create index if not exists idx_company_findings_status
  on public.assessment_company_findings(corrective_action_status);

alter table public.assessment_company_findings
enable row level security;

drop policy if exists "company_findings_select"
on public.assessment_company_findings;

drop policy if exists "company_findings_insert"
on public.assessment_company_findings;

drop policy if exists "company_findings_update"
on public.assessment_company_findings;

drop policy if exists "company_findings_delete"
on public.assessment_company_findings;

create policy "company_findings_select"
on public.assessment_company_findings
for select
to authenticated
using (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_findings.assessment_id
      and (
        a.created_by = auth.uid()
        or exists (
          select 1
          from public.organization_members om
          where om.organization_id = a.organization_id
            and om.user_id = auth.uid()
        )
      )
  )
);

create policy "company_findings_insert"
on public.assessment_company_findings
for insert
to authenticated
with check (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_findings.assessment_id
      and (
        a.created_by = auth.uid()
        or exists (
          select 1
          from public.organization_members om
          where om.organization_id = a.organization_id
            and om.user_id = auth.uid()
        )
      )
  )
);

create policy "company_findings_update"
on public.assessment_company_findings
for update
to authenticated
using (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_findings.assessment_id
      and (
        a.created_by = auth.uid()
        or exists (
          select 1
          from public.organization_members om
          where om.organization_id = a.organization_id
            and om.user_id = auth.uid()
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_findings.assessment_id
      and (
        a.created_by = auth.uid()
        or exists (
          select 1
          from public.organization_members om
          where om.organization_id = a.organization_id
            and om.user_id = auth.uid()
        )
      )
  )
);

create policy "company_findings_delete"
on public.assessment_company_findings
for delete
to authenticated
using (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_findings.assessment_id
      and (
        a.created_by = auth.uid()
        or exists (
          select 1
          from public.organization_members om
          where om.organization_id = a.organization_id
            and om.user_id = auth.uid()
        )
      )
  )
);

grant select, insert, update, delete
on table public.assessment_company_findings
to authenticated;

create or replace function public.set_company_finding_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_company_finding_updated_at
on public.assessment_company_findings;

create trigger trg_company_finding_updated_at
before update on public.assessment_company_findings
for each row
execute function public.set_company_finding_updated_at();
