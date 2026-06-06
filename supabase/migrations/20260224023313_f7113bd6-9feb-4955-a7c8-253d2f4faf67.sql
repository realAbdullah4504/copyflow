
-- 1. Make class_id nullable in attendance
ALTER TABLE attendance ALTER COLUMN class_id DROP NOT NULL;

-- 2. Drop old unique constraint and add new one (student_id + lesson_date)
DO $$ 
BEGIN
  -- Try to drop the composite unique constraint
  BEGIN
    ALTER TABLE attendance DROP CONSTRAINT attendance_student_id_class_id_lesson_date_key;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
END $$;

-- Add new unique constraint without class_id
ALTER TABLE attendance ADD CONSTRAINT attendance_student_id_lesson_date_key UNIQUE (student_id, lesson_date);

-- 3. Create terms table
CREATE TABLE public.terms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  academic_year text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT terms_unique_name_year UNIQUE (name, academic_year)
);

ALTER TABLE terms ENABLE ROW LEVEL SECURITY;

-- Terms readable by all authenticated users
CREATE POLICY "terms_select_authenticated" ON terms FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Admin can manage terms
CREATE POLICY "terms_admin_manage" ON terms FOR ALL 
USING (is_admin(auth.uid()));

-- Secretary can manage terms
CREATE POLICY "terms_secretary_manage" ON terms FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'secretary'));

-- 4. Seed terms for current academic year (2025-26)
INSERT INTO terms (name, academic_year, start_date, end_date, is_active) VALUES
  ('Term 1', '2025-26', '2025-09-01', '2025-12-18', false),
  ('Term 2', '2025-26', '2026-01-05', '2026-03-26', true),
  ('Term 3', '2025-26', '2026-03-30', '2026-06-25', false);

-- 5. Create absence_alert_notes table
CREATE TABLE public.absence_alert_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  term_id uuid NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  noted_at timestamptz NOT NULL DEFAULT now(),
  noted_by uuid REFERENCES profiles(id),
  last_absence_date date NOT NULL,
  CONSTRAINT alert_notes_student_term UNIQUE (student_id, term_id)
);

ALTER TABLE absence_alert_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alert_notes_admin_all" ON absence_alert_notes FOR ALL 
USING (EXISTS (
  SELECT 1 FROM students s 
  WHERE s.id = absence_alert_notes.student_id 
    AND s.admin_id = auth.uid() 
    AND is_admin(auth.uid())
));

CREATE POLICY "alert_notes_secretary_all" ON absence_alert_notes FOR ALL 
USING (EXISTS (
  SELECT 1 FROM students s 
  JOIN profiles p ON p.id = auth.uid() 
  WHERE s.id = absence_alert_notes.student_id 
    AND p.role = 'secretary' 
    AND p.admin_id = s.admin_id
));
