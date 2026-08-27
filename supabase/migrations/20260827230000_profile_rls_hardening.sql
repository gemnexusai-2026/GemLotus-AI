-- GemLotus AI — Profile RLS Hardening
-- Phase 1: OEM Assessment OS

alter table public.profiles
  enable row level security;

drop policy if exists profiles_owner_select
  on public.profiles;

create policy profiles_owner_select
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);

drop policy if exists profiles_owner_insert
  on public.profiles;

create policy profiles_owner_insert
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
);

drop policy if exists profiles_owner_update
  on public.profiles;

create policy profiles_owner_update
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);
