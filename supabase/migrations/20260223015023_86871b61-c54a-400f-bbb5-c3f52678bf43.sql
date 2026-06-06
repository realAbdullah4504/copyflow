
-- Add SELECT policy for principals on classes table
CREATE POLICY "classes_select_principal"
ON public.classes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'principal'
  )
);
