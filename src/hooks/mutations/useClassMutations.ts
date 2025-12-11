import { useMutation } from "@tanstack/react-query";
import { classesService } from "@/services/classesService";
import type {ClassesWithSchedules } from "@/types";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";
import type { CreateClassInput } from "@/types";

export const useClassMutations = () => {
  const invalidateClassKeys = [
    QUERY_KEYS.TEACHERS_BY_GRADE,
    QUERY_KEYS.TEACHER_CLASSES,
  ];

  const createClass = useMutation({
    mutationFn: (data: CreateClassInput) => classesService.create(data),
    ...mutationHandlers({
      successMessage: "Class Created",
      invalidateKeys: invalidateClassKeys,
    }),
  });

  const updateClass = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ClassesWithSchedules>;
    }) => classesService.update(id, updates),
    ...mutationHandlers({
      successMessage: "Class Updated",
      invalidateKeys: invalidateClassKeys,
    }),
  });

  const toggleActive = useMutation({
    mutationFn: (id: string) => classesService.toggleActive(id),
    ...mutationHandlers({
      successMessage: "Class Status Updated",
      invalidateKeys: invalidateClassKeys,
    }),
  });

  const deleteClass = useMutation({
    mutationFn: (id: string) => classesService.delete(id),
    ...mutationHandlers({
      successMessage: "Class Deleted",
      invalidateKeys: invalidateClassKeys,
    }),
  });

  return {
    createClass: createClass.mutate,
    createLoading: createClass.isPending,

    updateClass: updateClass.mutate,
    updateLoading: updateClass.isPending,

    toggleActive: toggleActive.mutate,
    toggleLoading: toggleActive.isPending,

    deleteClass: deleteClass.mutate,
    deleteLoading: deleteClass.isPending,
  };
};
