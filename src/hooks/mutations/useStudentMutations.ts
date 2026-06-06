import { useMutation } from "@tanstack/react-query";
import { studentService } from "@/services/studentService";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";
import type { CreateStudentInput, UpdateStudentInput } from "@/types";

export const useStudentMutations = () => {
  const createStudent = useMutation({
    mutationFn: (input: CreateStudentInput) => studentService.create(input),
    ...mutationHandlers({
      successMessage: "Student added successfully",
      invalidateKeys: [QUERY_KEYS.STUDENTS],
    }),
  });

  const updateStudent = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & UpdateStudentInput) =>
      studentService.update(id, updates),
    ...mutationHandlers({
      successMessage: "Student updated successfully",
      invalidateKeys: [QUERY_KEYS.STUDENTS],
    }),
  });

  const deleteStudent = useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    ...mutationHandlers({
      successMessage: "Student deleted successfully",
      invalidateKeys: [QUERY_KEYS.STUDENTS],
    }),
  });

  return {
    createStudent: createStudent.mutate,
    isCreating: createStudent.isPending,
    updateStudent: updateStudent.mutate,
    isUpdating: updateStudent.isPending,
    deleteStudent: deleteStudent.mutate,
    isDeleting: deleteStudent.isPending,
  };
};
