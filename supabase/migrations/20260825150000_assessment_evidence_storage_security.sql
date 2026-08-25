-- ============================================================
-- FACTORY / ASSESSMENT EVIDENCE STORAGE SECURITY
-- ============================================================

drop policy if exists assessment_evidence_owner_read
on storage.objects;

create policy assessment_evidence_owner_read
on storage.objects
for select
to authenticated
using (
  bucket_id = 'assessment-evidence'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.assessment_snapshots a
      where a.id::text = (storage.foldername(name))[1]
        and a.created_by = auth.uid()
    )
  )
);


drop policy if exists assessment_evidence_owner_insert
on storage.objects;

create policy assessment_evidence_owner_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'assessment-evidence'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.assessment_snapshots a
      where a.id::text = (storage.foldername(name))[1]
        and a.created_by = auth.uid()
    )
  )
);


drop policy if exists assessment_evidence_owner_update
on storage.objects;

create policy assessment_evidence_owner_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'assessment-evidence'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.assessment_snapshots a
      where a.id::text = (storage.foldername(name))[1]
        and a.created_by = auth.uid()
    )
  )
)
with check (
  bucket_id = 'assessment-evidence'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.assessment_snapshots a
      where a.id::text = (storage.foldername(name))[1]
        and a.created_by = auth.uid()
    )
  )
);

-- No DELETE policy.
-- Assessment evidence remains auditable.
