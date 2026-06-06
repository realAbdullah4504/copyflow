
-- Fix schedules FK to cascade on delete
ALTER TABLE public.schedules
  DROP CONSTRAINT schedules_teacher_id_fkey;

ALTER TABLE public.schedules
  ADD CONSTRAINT schedules_teacher_id_fkey
  FOREIGN KEY (teacher_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
