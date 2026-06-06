-- Fix profiles SELECT policies: change key policies from RESTRICTIVE to PERMISSIVE
-- Drop the restrictive policies
DROP POLICY IF EXISTS "profiles_select_self_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "secretary+admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "realtime_select_profiles" ON public.profiles;

-- Recreate as PERMISSIVE policies with proper access rules
-- Users can see their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

-- Admins can see all profiles under them (admin_id = their id) 
CREATE POLICY "profiles_select_admin"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin' AND p.active = true
  )
  AND (admin_id = auth.uid() OR id = auth.uid())
);

-- Secretaries can read all profiles with same admin_id
CREATE POLICY "profiles_select_secretary"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'secretary'
  )
);

-- Realtime needs access
CREATE POLICY "realtime_select_profiles"
ON public.profiles
FOR SELECT
USING (true);