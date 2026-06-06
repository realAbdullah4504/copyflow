
-- Allow principals to view all attendance records
CREATE POLICY "principal_read_attendance"
ON public.attendance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'principal'
  )
);
