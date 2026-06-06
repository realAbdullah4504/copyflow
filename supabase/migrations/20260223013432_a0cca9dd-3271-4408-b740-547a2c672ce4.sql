
-- Allow principals and secretaries to read schedules (they need it for the schedule view)
CREATE POLICY "schedules_select_principal_secretary" ON public.schedules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('principal', 'secretary', 'admin')
  ));

-- Allow teachers to read their own schedules
CREATE POLICY "schedules_select_own_teacher" ON public.schedules FOR SELECT
  USING (teacher_id = auth.uid());

-- Allow admin/secretary to manage schedules
CREATE POLICY "schedules_insert_admin_secretary" ON public.schedules FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'secretary')
  ));

CREATE POLICY "schedules_update_admin_secretary" ON public.schedules FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'secretary')
  ));

CREATE POLICY "schedules_delete_admin_secretary" ON public.schedules FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'secretary')
  ));
