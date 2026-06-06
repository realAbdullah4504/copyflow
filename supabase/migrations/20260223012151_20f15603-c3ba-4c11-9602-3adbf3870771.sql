
-- Enums
CREATE TYPE public.conduct_grade AS ENUM ('S+', 'S', 'S*', 'S-');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- 1. Students table (NO teacher policy yet)
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  admin_id UUID NOT NULL REFERENCES public.profiles(id),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "secretary_read_students" ON public.students FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'secretary' AND p.admin_id = students.admin_id));
CREATE POLICY "admin_read_students" ON public.students FOR SELECT
  USING (admin_id = auth.uid() AND is_admin(auth.uid()));
CREATE POLICY "secretary_insert_students" ON public.students FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'secretary' AND p.admin_id = students.admin_id));
CREATE POLICY "admin_insert_students" ON public.students FOR INSERT
  WITH CHECK (admin_id = auth.uid() AND is_admin(auth.uid()));
CREATE POLICY "secretary_update_students" ON public.students FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'secretary' AND p.admin_id = students.admin_id));
CREATE POLICY "admin_update_students" ON public.students FOR UPDATE
  USING (admin_id = auth.uid() AND is_admin(auth.uid()));
CREATE POLICY "secretary_delete_students" ON public.students FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'secretary' AND p.admin_id = students.admin_id));
CREATE POLICY "admin_delete_students" ON public.students FOR DELETE
  USING (admin_id = auth.uid() AND is_admin(auth.uid()));

CREATE TRIGGER set_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Student enrollments
CREATE TABLE public.student_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, class_id, academic_year)
);
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "secretary_read_enrollments" ON public.student_enrollments FOR SELECT
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = student_enrollments.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_insert_enrollments" ON public.student_enrollments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = student_enrollments.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_update_enrollments" ON public.student_enrollments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = student_enrollments.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_delete_enrollments" ON public.student_enrollments FOR DELETE
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = student_enrollments.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "admin_all_enrollments" ON public.student_enrollments FOR ALL
  USING (EXISTS (SELECT 1 FROM students s WHERE s.id = student_enrollments.student_id AND s.admin_id = auth.uid() AND is_admin(auth.uid())));
CREATE POLICY "teacher_read_enrollments" ON public.student_enrollments FOR SELECT
  USING (EXISTS (SELECT 1 FROM classes c WHERE c.id = student_enrollments.class_id AND c.teacher_id = auth.uid()));

-- NOW add teacher read policy on students (enrollments exists)
CREATE POLICY "teacher_read_students" ON public.students FOR SELECT
  USING (EXISTS (SELECT 1 FROM student_enrollments se JOIN classes c ON c.id = se.class_id WHERE se.student_id = students.id AND c.teacher_id = auth.uid()));

-- 3. Attendance
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  lesson_date DATE NOT NULL,
  status public.attendance_status NOT NULL DEFAULT 'present',
  academic_year TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, class_id, lesson_date)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "secretary_read_attendance" ON public.attendance FOR SELECT
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = attendance.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_insert_attendance" ON public.attendance FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = attendance.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_update_attendance" ON public.attendance FOR UPDATE
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = attendance.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_delete_attendance" ON public.attendance FOR DELETE
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = attendance.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "admin_all_attendance" ON public.attendance FOR ALL
  USING (EXISTS (SELECT 1 FROM students s WHERE s.id = attendance.student_id AND s.admin_id = auth.uid() AND is_admin(auth.uid())));
CREATE POLICY "teacher_read_attendance" ON public.attendance FOR SELECT
  USING (EXISTS (SELECT 1 FROM classes c WHERE c.id = attendance.class_id AND c.teacher_id = auth.uid()));

CREATE TRIGGER set_attendance_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_attendance_class_date ON public.attendance(class_id, lesson_date);
CREATE INDEX idx_attendance_student ON public.attendance(student_id);

-- 4. Marks
CREATE TABLE public.marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  mark NUMERIC,
  conduct public.conduct_grade,
  academic_year TEXT NOT NULL,
  term TEXT NOT NULL DEFAULT 'Term 1',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, class_id, academic_year, term)
);
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "secretary_read_marks" ON public.marks FOR SELECT
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = marks.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_insert_marks" ON public.marks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = marks.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_update_marks" ON public.marks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = marks.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "secretary_delete_marks" ON public.marks FOR DELETE
  USING (EXISTS (SELECT 1 FROM students s JOIN profiles p ON p.id = auth.uid() WHERE s.id = marks.student_id AND p.role = 'secretary' AND p.admin_id = s.admin_id));
CREATE POLICY "admin_all_marks" ON public.marks FOR ALL
  USING (EXISTS (SELECT 1 FROM students s WHERE s.id = marks.student_id AND s.admin_id = auth.uid() AND is_admin(auth.uid())));
CREATE POLICY "teacher_read_marks" ON public.marks FOR SELECT
  USING (EXISTS (SELECT 1 FROM classes c WHERE c.id = marks.class_id AND c.teacher_id = auth.uid()));

CREATE TRIGGER set_marks_updated_at BEFORE UPDATE ON public.marks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_marks_student ON public.marks(student_id);
CREATE INDEX idx_marks_class_term ON public.marks(class_id, academic_year, term);
