import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@/services/submissionService';
import type { Submission } from '@/types';

export function useSubmissions() {
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: submissionService.getSubmissions
  });

  return {
    submissions,
    isLoading
  };
}

export function useSubmissionsByTeacher(teacherId: string) {
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions', 'teacher', teacherId],
    queryFn: () => submissionService.getSubmissionsByTeacher(teacherId),
    enabled: !!teacherId
  });

  return {
    submissions,
    isLoading
  };
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submission: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>) =>
      submissionService.createSubmission(submission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Submission> }) =>
      submissionService.updateSubmission(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submissionService.deleteSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
}
