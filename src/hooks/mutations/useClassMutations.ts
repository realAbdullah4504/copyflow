import { useMutation } from "@tanstack/react-query";
import { classesService } from "@/services/classesService";
import type { ClassEntity } from "@/types";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";
import type { CreateClassInput } from "@/types";

export const useClassMutations = () => {
  const createClass = useMutation({
    mutationFn: (data: CreateClassInput) => classesService.create(data),
    ...mutationHandlers({
      successMessage: "Class Created",
      invalidateKeys: [QUERY_KEYS.TEACHERS_BY_GRADE],
    }),
  });

  const updateClass = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ClassEntity>;
    }) => classesService.update(id, updates),
    ...mutationHandlers({
      successMessage: "Class Updated",
      invalidateKeys: [QUERY_KEYS.TEACHERS_BY_GRADE],
    }),
  });

  const toggleActive = useMutation({
    mutationFn: (id: string) => classesService.toggleActive(id),
    ...mutationHandlers({
      successMessage: "Class Status Updated",
      invalidateKeys: [QUERY_KEYS.TEACHERS_BY_GRADE],
    }),
  });

  const deleteClass = useMutation({
    mutationFn: (id: string) => classesService.delete(id),
    ...mutationHandlers({
      successMessage: "Class Deleted",
      invalidateKeys: [QUERY_KEYS.TEACHERS_BY_GRADE],
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
