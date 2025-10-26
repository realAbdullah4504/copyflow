import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionService } from "@/services/submissionService";
import type { Submission } from "@/types";
import { useAuth } from "./useAuth";
import { ROLES } from "@/config/roles";

export function useSubmissions() {
  const {
    data: submissions = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["submissions"],
    queryFn: submissionService.getSubmissions,
  });

  return {
    submissions,
    isLoading,
    refetch,
  };
}

export function useSubmissionsByTeacher(teacherId: string) {
  const { data: submissions = [], isFetching } = useQuery({
    queryKey: ["submissions", "teacher", teacherId],
    queryFn: () => submissionService.getSubmissionsByTeacher(teacherId),
    enabled: !!teacherId,
  });

  return {
    submissions,
    isLoading: isFetching,
  };
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      submission: Omit<Submission, "id" | "createdAt" | "updatedAt">
    ) => submissionService.createSubmission(submission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Submission>;
    }) => submissionService.updateSubmission(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submissionService.deleteSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

export function useArchiveSubmission() {
  return useQuery({
    queryKey: ["submissions", "archive"],
    queryFn: submissionService.getArchivedSubmissions,
  });
}

export function useCreateArchiveSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submissionService.archiveSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

export function useCensoredSubmissions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["submissions", "censored"],
    queryFn: user?.role === ROLES.SECRETARY
      ? submissionService.getCensoredSubmissions
      : () => submissionService.getCensoredSubmissionsByTeacher(user?.id || ''),
    enabled: !!user?.id,
  });
}

export function useCensorSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submissionService.censorSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submissions", "censored"] });
    },
  });
}
