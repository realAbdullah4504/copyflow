import type { Submission } from "@/types";

// Mock data - replace with actual API calls
const mockArchivedSubmissions: Submission[] = [
  {
    id: '1',
    title: 'Math Homework 1',
    status: 'Archived',
    submittedAt: '2025-10-20T10:30:00Z',
    submittedBy: { id: '1', name: 'John Doe' },
    // Add other required Submission fields
  },
  // Add more mock data as needed
];

export const getTeacherArchivedSubmissions = async (teacherId: string): Promise<Submission[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/teachers/${teacherId}/archive`);
  // return response.json();
  return mockArchivedSubmissions;
};

export const getAllArchivedSubmissions = async (): Promise<Submission[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/archive');
  // return response.json();
  return mockArchivedSubmissions;
};

export const moveToArchive = async (submissionId: string, userId: string): Promise<Submission> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/submissions/${submissionId}/archive`, {
  //   method: 'POST',
  //   body: JSON.stringify({ archivedBy: userId }),
  //   headers: { 'Content-Type': 'application/json' },
  // });
  // return response.json();
  return {
    ...mockArchivedSubmissions[0],
    id: submissionId,
    status: 'Archived',
    archivedAt: new Date().toISOString(),
    archivedBy: { id: userId, name: 'Current User' },
  };
};

export const restoreFromArchive = async (submissionId: string): Promise<Submission> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/archive/${submissionId}/restore`, {
  //   method: 'POST',
  // });
  // return response.json();
  return {
    ...mockArchivedSubmissions[0],
    id: submissionId,
    status: 'Submitted',
    archivedAt: undefined,
    archivedBy: undefined,
  };
};
