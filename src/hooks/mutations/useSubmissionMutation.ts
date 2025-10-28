// src/hooks/mutations/useSubmissionMutations.ts
import { useMutation } from "@tanstack/react-query";
import { submissionService } from "@/services/submissionService";
import type { Submission } from "@/types";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";

export const useSubmissionMutations = () => {
  const createSubmission = useMutation({
    mutationFn: (
      submission: Omit<Submission, "id" | "createdAt" | "updatedAt">
    ) => submissionService.createSubmission(submission),
    ...mutationHandlers("Submission created successfully", [
      QUERY_KEYS.SUBMISSIONS,
      QUERY_KEYS.TEACHER_SUBMISSIONS,
    ]),
  });

  const updateSubmission = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Submission>;
    }) => submissionService.updateSubmission(id, updates),
    ...mutationHandlers("Submission updated successfully", [
      QUERY_KEYS.SUBMISSIONS,
      QUERY_KEYS.TEACHER_SUBMISSIONS,
    ]),
  });

  const deleteSubmission = useMutation({
    mutationFn: (id: string) => submissionService.deleteSubmission(id),
    ...mutationHandlers("Submission deleted successfully", [
      QUERY_KEYS.SUBMISSIONS,
      QUERY_KEYS.ARCHIVED_SUBMISSIONS,
    ]),
  });

  const archiveSubmission = useMutation({
    mutationFn: (id: string) => submissionService.archiveSubmission(id),
    ...mutationHandlers("Submission archived successfully", [
      QUERY_KEYS.SUBMISSIONS,
      QUERY_KEYS.ARCHIVED_SUBMISSIONS,
    ]),
  });

  const censorSubmission = useMutation({
    mutationFn: (id: string) => submissionService.censorSubmission(id),
    ...mutationHandlers("Submission censored successfully", [
      QUERY_KEYS.SUBMISSIONS,
      QUERY_KEYS.CENSORED_SUBMISSIONS,
    ]),
  });

  const unCensorSubmission = useMutation({
    mutationFn: (id: string) => submissionService.unCensorSubmission(id),
    ...mutationHandlers("Submission uncensored successfully", [
      QUERY_KEYS.SUBMISSIONS,
      QUERY_KEYS.CENSORED_SUBMISSIONS,
    ]),
  });

  return {
    createSubmission: createSubmission.mutate,
    isLoading: createSubmission.isPending,

    updateSubmission: updateSubmission.mutate,
    updateLoading: updateSubmission.isPending,

    deleteSubmission: deleteSubmission.mutate,
    deleteLoading: deleteSubmission.isPending,

    archiveSubmission: archiveSubmission.mutate,
    archiveLoading: archiveSubmission.isPending,

    censorSubmission: censorSubmission.mutate,
    censorLoading: censorSubmission.isPending,

    unCensorSubmission: unCensorSubmission.mutate,
    unCensorLoading: unCensorSubmission.isPending,
  };
};
