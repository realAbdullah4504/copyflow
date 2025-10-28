// src/hooks/mutations/useSubmissionMutations.ts
import { useMutation } from "@tanstack/react-query";
import { submissionService } from "@/services/submissionService";
import { toast } from "sonner";
import type { Submission } from "@/types";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS, type QueryKeys } from "@/config";

export const useSubmissionMutations = () => {

  const invalidate = (keys: QueryKeys[]) => {
    for (const key of keys) {
      queryClient.invalidateQueries({ queryKey: [key] });
    }
  };
  const onSuccess = (msg: string,keys: QueryKeys[]) => {
    toast.success(msg);
    invalidate(keys);
  };

  const onError = (err: Error) => {
    console.error(err);
    toast.error("Something went wrong");
  };
  const createSubmission = useMutation({
    mutationFn: (
      submission: Omit<Submission, "id" | "createdAt" | "updatedAt">
    ) => submissionService.createSubmission(submission),
    onSuccess: () => onSuccess("Submission created successfully",[QUERY_KEYS.SUBMISSIONS,QUERY_KEYS.TEACHER_SUBMISSIONS]),
    onError,
  });

  const updateSubmission = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Submission>;
    }) => submissionService.updateSubmission(id, updates),
    onSuccess: () => onSuccess("Submission updated successfully",[QUERY_KEYS.SUBMISSIONS,QUERY_KEYS.TEACHER_SUBMISSIONS]),
    onError,
  });

  const deleteSubmission = useMutation({
    mutationFn: (id: string) => submissionService.deleteSubmission(id),
    onSuccess: () => onSuccess("Submission deleted successfully",[QUERY_KEYS.SUBMISSIONS,QUERY_KEYS.TEACHER_SUBMISSIONS]),
    onError,
  });

  const archiveSubmission = useMutation({
    mutationFn: (id: string) => submissionService.archiveSubmission(id),
    onSuccess: () => onSuccess("Submission archived successfully",[QUERY_KEYS.SUBMISSIONS,QUERY_KEYS.ARCHIVED_SUBMISSIONS]),
    onError,
  });

  const censorSubmission = useMutation({
    mutationFn: (id: string) => submissionService.censorSubmission(id),
    onSuccess: () => onSuccess("Submission censored successfully",[QUERY_KEYS.SUBMISSIONS,QUERY_KEYS.CENSORED_SUBMISSIONS]),
    onError,
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
  };
};
