
-- Add unique constraint for upsert support
ALTER TABLE public.attendance
ADD CONSTRAINT attendance_student_class_date_unique
UNIQUE (student_id, class_id, lesson_date);
