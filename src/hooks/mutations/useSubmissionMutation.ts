// src/hooks/mutations/useSubmissionMutations.ts
import { useMutation } from "@tanstack/react-query";
import { submissionService } from "@/services/submissionService";
import { toast } from "sonner";
import type { Submission } from "@/types";
import { queryClient } from "@/lib/queryClient";

export const useSubmissionMutations = () => {
  const onSuccess = (msg: string) => {
    toast.success(msg);
    queryClient.invalidateQueries({ queryKey: ["submissions"] });
  };

  const onError = (err: Error) => {
    console.error(err);
    toast.error("Something went wrong");
  };
  const createSubmission = useMutation({
    mutationFn: (
      submission: Omit<Submission, "id" | "createdAt" | "updatedAt">
    ) => submissionService.createSubmission(submission),
    onSuccess: () => onSuccess("Submission created successfully"),
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
    onSuccess: () => onSuccess("Submission updated successfully"),
    onError,
  });

  const deleteSubmission = useMutation({
    mutationFn: (id: string) => submissionService.deleteSubmission(id),
    onSuccess: () => onSuccess("Submission deleted successfully"),
    onError,
  });

  const archiveSubmission = useMutation({
    mutationFn: (id: string) => submissionService.archiveSubmission(id),
    onSuccess: () => onSuccess("Submission archived successfully"),
    onError,
  });

  const censorSubmission = useMutation({
    mutationFn: (id: string) => submissionService.censorSubmission(id),
    onSuccess: () => onSuccess("Submission censored successfully"),
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
