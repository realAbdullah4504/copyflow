// src/hooks/mutations/useSubmissionMutations.ts
import { useMutation } from "@tanstack/react-query";
import { submissionService } from "@/services";
import type { CreateSubmissionInput, Submission } from "@/types";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";

export const useSubmissionMutations = () => {
  const createSubmission = useMutation({
    mutationFn: (submission: CreateSubmissionInput) =>
      submissionService.createSubmission(submission),
    ...mutationHandlers({
      successMessage: "Submission Created",
      invalidateKeys: [QUERY_KEYS.SUBMISSIONS, QUERY_KEYS.TEACHER_SUBMISSIONS],
    }),
  });

  const createSubmissionWithFiles = useMutation({
    mutationFn: ({
      submission,
      files,
    }: {
      submission: CreateSubmissionInput;
      files: File[];
    }) => submissionService.createSubmissionWithFiles(submission, files),
    ...mutationHandlers({
      successMessage: "Submission Created",
      invalidateKeys: [QUERY_KEYS.SUBMISSIONS, QUERY_KEYS.TEACHER_SUBMISSIONS],
    }),
  });

  const updateSubmission = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Submission>;
    }) => submissionService.updateSubmission(id, updates),
    ...mutationHandlers({
      successMessage: "Submission Updated",
      invalidateKeys: [QUERY_KEYS.SUBMISSIONS, QUERY_KEYS.TEACHER_SUBMISSIONS],
    }),
  });

  const updateSubmissionWithFiles = useMutation({
    mutationFn: ({
      id,
      submission,
      newFiles,
      deletedPaths,
    }: {
      id: string;
      submission: Partial<CreateSubmissionInput>;
      newFiles: File[];
      deletedPaths: string[];
    }) =>
      submissionService.updateSubmissionWithFileChanges(
        id,
        submission,
        newFiles,
        deletedPaths
      ),
    ...mutationHandlers({
      successMessage: "Submission Updated",
      invalidateKeys: [QUERY_KEYS.SUBMISSIONS, QUERY_KEYS.TEACHER_SUBMISSIONS],
    }),
  });

  const printedSubmission = useMutation({
    mutationFn: (id: string) =>
      submissionService.updateSubmission(id, { status: "printed" }),
    ...mutationHandlers({
      successMessage: "Submission Printed",
      invalidateKeys: [
        QUERY_KEYS.SUBMISSIONS,
        QUERY_KEYS.TEACHER_SUBMISSIONS,
        QUERY_KEYS.ARCHIVED_SUBMISSIONS,
        QUERY_KEYS.TEACHER_ARCHIVED,
      ],
    }),
  });

  const censorSubmission = useMutation({
    mutationFn: (id: string) =>
      submissionService.updateSubmission(id, { status: "censored" }),
    ...mutationHandlers({
      successMessage: "Submission Censored",
      invalidateKeys: [
        QUERY_KEYS.SUBMISSIONS,
        QUERY_KEYS.TEACHER_CENSORED,
        QUERY_KEYS.CENSORED_SUBMISSIONS,
      ],
    }),
  });

  const unCensorSubmission = useMutation({
    mutationFn: (id: string) =>
      submissionService.updateSubmission(id, { status: "pending" }),
    ...mutationHandlers({
      successMessage: "Submission Approved",
      invalidateKeys: [
        QUERY_KEYS.SUBMISSIONS,
        QUERY_KEYS.CENSORED_SUBMISSIONS,
        QUERY_KEYS.TEACHER_CENSORED,
      ],
    }),
  });

  const deleteSubmission = useMutation({
    mutationFn: (id: string) => submissionService.deleteSubmission(id),
    ...mutationHandlers({
      successMessage: "Submission Deleted",
      invalidateKeys: [QUERY_KEYS.SUBMISSIONS, QUERY_KEYS.TEACHER_SUBMISSIONS],
    }),
  });

  return {
    createSubmission: createSubmission.mutate,
    isLoading: createSubmission.isPending,
    createSubmissionWithFiles: createSubmissionWithFiles.mutate,
    createWithFilesLoading: createSubmissionWithFiles.isPending,

    updateSubmission: updateSubmission.mutate,
    updateLoading: updateSubmission.isPending,
    
    updateSubmissionWithFiles: updateSubmissionWithFiles.mutate,
    updateWithFilesLoading: updateSubmissionWithFiles.isPending,

    deleteSubmission: deleteSubmission.mutate,
    deleteLoading: deleteSubmission.isPending,

    printedSubmission: printedSubmission.mutate,
    printedLoading: printedSubmission.isPending,

    censorSubmission: censorSubmission.mutate,
    censorLoading: censorSubmission.isPending,

    unCensorSubmission: unCensorSubmission.mutate,
    unCensorLoading: unCensorSubmission.isPending,
  };
};
