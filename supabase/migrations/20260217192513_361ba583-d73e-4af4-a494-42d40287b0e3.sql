-- Fix the self-referencing policy that causes infinite recursion
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_secretary" ON public.profiles;

-- Use existing is_admin() security definer function instead
CREATE POLICY "profiles_select_admin"
ON public.profiles
FOR SELECT
USING (
  public.is_admin(auth.uid())
);