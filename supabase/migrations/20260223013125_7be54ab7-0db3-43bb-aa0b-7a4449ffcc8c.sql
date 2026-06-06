
-- Fix infinite recursion: teacher_read_students -> student_enrollments -> students

-- Drop the problematic policies
DROP POLICY IF EXISTS "teacher_read_students" ON public.students;
DROP POLICY IF EXISTS "teacher_read_enrollments" ON public.student_enrollments;

-- Create a security definer function to check if a user is a teacher for a student
CREATE OR REPLACE FUNCTION public.is_teacher_for_student(p_student_id UUID, p_teacher_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM student_enrollments se
    JOIN classes c ON c.id = se.class_id
    WHERE se.student_id = p_student_id
      AND c.teacher_id = p_teacher_id
  );
$$;

-- Create a security definer function to check if a user is a teacher for a class
CREATE OR REPLACE FUNCTION public.is_teacher_for_class(p_class_id UUID, p_teacher_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = p_class_id
      AND c.teacher_id = p_teacher_id
  );
$$;

-- Recreate policies using the security definer functions
CREATE POLICY "teacher_read_students" ON public.students FOR SELECT
  USING (public.is_teacher_for_student(id, auth.uid()));

CREATE POLICY "teacher_read_enrollments" ON public.student_enrollments FOR SELECT
  USING (public.is_teacher_for_class(class_id, auth.uid()));
