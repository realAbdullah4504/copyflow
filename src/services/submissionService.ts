import { mockSubmissions } from "@/constants";
import type { Submission } from "@/types";

export const submissionService = {
  getSubmissions: async (): Promise<Submission[]> => {
    // In a real implementation, this would fetch from the database
    // const { data, error } = await supabase.from('submissions').select('*');
    // if (error) throw error;
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockSubmissions]
      .filter((sub) => sub.status !== "archived")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getSubmissionById: async (id: string): Promise<Submission | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockSubmissions.find((s) => s.id === id);
  },

  getSubmissionsByTeacher: async (teacherId: string): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions
      .filter((s) => s.teacherId === teacherId && s.status !== "archived")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getArchivedSubmissions: async (): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions
      .filter((s) => s.status === "archived")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  },

  getArchivedSubmissionsByTeacher: async (
    teacherId: string
  ): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions
      .filter((s) => s.teacherId === teacherId && s.status === "archived")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  },

  getCensoredSubmissions: async (): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions
      .filter((s) => s.status === "censored")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  },

  getCensoredSubmissionsByTeacher: async (
    teacherId: string
  ): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions
      .filter((s) => s.teacherId === teacherId && s.status === "censored")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  },

  censorSubmission: async (id: string): Promise<Submission> => {
    const submission = await submissionService.getSubmissionById(id);
    if (!submission) {
      throw new Error("Submission not found");
    }

    const updatedSubmission: Submission = {
      ...submission,
      status: "censored",
      updatedAt: new Date(),
    };

    const index = mockSubmissions.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockSubmissions[index] = updatedSubmission;
    }

    return updatedSubmission;
  },

  createSubmission: async (
    submission: Omit<Submission, "id" | "createdAt" | "updatedAt">
  ): Promise<Submission> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newSubmission: Submission = {
      ...submission,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockSubmissions.push(newSubmission);
    return newSubmission;
  },

  updateSubmission: async (
    id: string,
    updates: Partial<Submission>
  ): Promise<Submission> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockSubmissions.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("Submission not found");
    }

    mockSubmissions[index] = {
      ...mockSubmissions[index],
      ...updates,
      updatedAt: new Date(),
    };

    return mockSubmissions[index];
  },

  deleteSubmission: async (id: string): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockSubmissions.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockSubmissions.splice(index, 1);
    }
    return mockSubmissions;
  },

  archiveSubmission: async (id: string): Promise<Submission> => {
    // In a real implementation, this would update the submission status to 'archived' in the database
    const submission = await submissionService.getSubmissionById(id);
    if (!submission) {
      throw new Error("Submission not found");
    }

    // Create a properly typed updated submission
    const updatedSubmission: Submission = {
      ...submission,
      status: "archived",
      updatedAt: new Date(),
    };

    // Update the submission in the mock data
    const index = mockSubmissions.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockSubmissions[index] = updatedSubmission;
    }

    return updatedSubmission;
  },
};
