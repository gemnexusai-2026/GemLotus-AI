-- GemLotus AI — Organization Bootstrap
-- Phase 1: OEM Assessment OS

create or replace function public.create_organization_with_owner(
  organization_name text,
  organization_slug text
)
returns public.organizations
language plpgsql
security definer
set search_path = public
as $$
declare
  new_organization public.organizations;
begin
  if auth.uid() is null then
    raise exception 'AUTHENTICATION_REQUIRED';
  end if;

  if organization_name is null
     or length(trim(organization_name)) < 2 then
    raise exception 'ORGANIZATION_NAME_INVALID';
  end if;

  if organization_slug is null
     or length(trim(organization_slug)) < 2 then
    raise exception 'ORGANIZATION_SLUG_INVALID';
  end if;

  insert into public.organizations (
    name,
    slug,
    created_by
  )
  values (
    trim(organization_name),
    lower(trim(organization_slug)),
    auth.uid()
  )
  returning * into new_organization;

  insert into public.organization_members (
    organization_id,
    user_id,
    role
  )
  values (
    new_organization.id,
    auth.uid(),
    'owner'
  );

  return new_organization;
end;
$$;

revoke execute
on function public.create_organization_with_owner(text, text)
from public;

grant execute
on function public.create_organization_with_owner(text, text)
to authenticated;
