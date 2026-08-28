create table if not exists public.assessment_company_documents (
  id uuid primary key default gen_random_uuid(),

  assessment_id uuid not null
    references public.assessment_snapshots(id)
    on delete cascade,

  organization_id uuid
    references public.organizations(id)
    on delete restrict,

  company_id text not null,

  document_type text not null,
  document_name text not null default '',
  document_number text not null default '',

  issuing_authority text not null default '',

  issue_date date,
  expiry_date date,

  validity_status text not null default 'unknown'
    check (
      validity_status in (
        'valid',
        'expiring',
        'expired',
        'not_applicable',
        'unknown'
      )
    ),

  verification_status text not null default 'pending'
    check (
      verification_status in (
        'pending',
        'verified',
        'rejected',
        'needs_review'
      )
    ),

  file_name text not null default '',
  file_reference text not null default '',

  is_mandatory boolean not null default false,
  is_current boolean not null default false,

  verified_by text not null default '',
  verification_date date,

  remarks text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_company_documents_assessment
  on public.assessment_company_documents(assessment_id);

create index if not exists idx_company_documents_organization
  on public.assessment_company_documents(organization_id);

create index if not exists idx_company_documents_company
  on public.assessment_company_documents(company_id);

create index if not exists idx_company_documents_type
  on public.assessment_company_documents(document_type);

alter table public.assessment_company_documents enable row level security;

drop policy if exists "company_documents_select" on public.assessment_company_documents;
drop policy if exists "company_documents_insert" on public.assessment_company_documents;
drop policy if exists "company_documents_update" on public.assessment_company_documents;
drop policy if exists "company_documents_delete" on public.assessment_company_documents;

create policy "company_documents_select"
on public.assessment_company_documents
for select
to authenticated
using (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_documents.assessment_id
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

create policy "company_documents_insert"
on public.assessment_company_documents
for insert
to authenticated
with check (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_documents.assessment_id
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

create policy "company_documents_update"
on public.assessment_company_documents
for update
to authenticated
using (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_documents.assessment_id
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
    where a.id = assessment_company_documents.assessment_id
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

create policy "company_documents_delete"
on public.assessment_company_documents
for delete
to authenticated
using (
  exists (
    select 1
    from public.assessment_snapshots a
    where a.id = assessment_company_documents.assessment_id
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

create or replace function public.set_company_document_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_company_document_updated_at
on public.assessment_company_documents;

create trigger trg_company_document_updated_at
before update on public.assessment_company_documents
for each row
execute function public.set_company_document_updated_at();
