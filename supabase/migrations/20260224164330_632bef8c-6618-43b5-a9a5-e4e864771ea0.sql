
CREATE OR REPLACE FUNCTION public.get_users_by_admin(admin_uuid uuid)
RETURNS SETOF public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT *
  FROM public.profiles
  WHERE admin_id = admin_uuid
  ORDER BY created_at DESC;
$$;
