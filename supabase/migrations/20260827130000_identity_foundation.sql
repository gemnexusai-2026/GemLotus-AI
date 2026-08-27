-- GemLotus AI — Identity Foundation
-- Phase 1: OEM Assessment OS

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_members_role_check
    check (role in ('owner','admin','member','reviewer')),
  constraint organization_members_unique
    unique (organization_id, user_id)
);

create index if not exists idx_organization_members_user
  on public.organization_members(user_id);

create index if not exists idx_organization_members_org
  on public.organization_members(organization_id);

create index if not exists idx_organizations_created_by
  on public.organizations(created_by);

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;

grant select, insert, update
on public.profiles to authenticated;

grant select, insert, update
on public.organizations to authenticated;

grant select, insert, update
on public.organization_members to authenticated;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile
on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

create or replace function public.set_identity_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at
on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_identity_updated_at();

drop trigger if exists organizations_updated_at
on public.organizations;

create trigger organizations_updated_at
before update on public.organizations
for each row
execute function public.set_identity_updated_at();

drop trigger if exists organization_members_updated_at
on public.organization_members;

create trigger organization_members_updated_at
before update on public.organization_members
for each row
execute function public.set_identity_updated_at();
