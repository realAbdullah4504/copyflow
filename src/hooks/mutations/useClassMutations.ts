import { useMutation } from "@tanstack/react-query";
import { classesService } from "@/services/classesService";
import type { ClassEntity } from "@/types";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";

export const useClassMutations = () => {
  const createClass = useMutation({
    mutationFn: (data: Omit<ClassEntity, "id" | "createdAt" | "updatedAt">) =>
      classesService.create(data),
    ...mutationHandlers("Class Created", [QUERY_KEYS.TEACHER_CLASSES]),
  });

  const updateClass = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ClassEntity> }) =>
      classesService.update(id, updates),
    ...mutationHandlers("Class Updated", [QUERY_KEYS.TEACHER_CLASSES]),
  });

  const toggleActive = useMutation({
    mutationFn: (id: string) => classesService.toggleActive(id),
    ...mutationHandlers("Class Status Updated", [QUERY_KEYS.TEACHER_CLASSES]),
  });

  const deleteClass = useMutation({
    mutationFn: (id: string) => classesService.delete(id),
    ...mutationHandlers("Class Deleted", [QUERY_KEYS.TEACHER_CLASSES]),
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
