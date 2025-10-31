import { mockSubmissions } from "@/constants";
import type { Submission, SubmissionQueryParams } from "@/types";
import { filterData, paginateData, sortData } from "@/utils";

export const submissionService = {
  getSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { pagination, filters, sorting } = params ?? {};

    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = mockSubmissions.filter((sub) => sub.status !== "printed");

    // Apply sorting if specified
    filtered = sortData(filtered, sorting);

    // Apply filters if specified
    filtered = filterData(filtered, filters);

    //pagination stuff
    const paginated = paginateData(filtered, pagination);
    return {
      data: paginated.data,
      total: paginated.total,
    };
  },

  getSubmissionsByTeacher: async (teacherId: string): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions
      .filter((s) => s.teacherId === teacherId && s.status !== "printed")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getArchivedSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{
    data: Submission[];
    total: number;
  }> => {
    const { pagination, filters, sorting } = params ?? {};
    await new Promise((resolve) => setTimeout(resolve, 300));
    let filtered = mockSubmissions.filter((sub) => sub.status === "printed");

    // Apply sorting if specified
    filtered = sortData(filtered, sorting);

    // Apply filters if specified
    filtered = filterData(filtered, filters);

    //pagination stuff
    const paginated = paginateData(filtered, pagination);
    return {
      data: paginated.data,
      total: paginated.total,
    };
  },

  getArchivedSubmissionsByTeacher: async (
    teacherId: string
  ): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions
      .filter((s) => s.teacherId === teacherId && s.status === "printed")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  },

  getCensoredSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { pagination, filters, sorting } = params ?? {};
    await new Promise((resolve) => setTimeout(resolve, 300));
    let filtered = mockSubmissions.filter((sub) => sub.status === "censored");

    // Apply sorting if specified
    filtered = sortData(filtered, sorting);

    // Apply filters if specified
    filtered = filterData(filtered, filters);

    //pagination stuff
    const paginated = paginateData(filtered, pagination);
    console.log(paginated, "paginated");
    return {
      data: paginated.data,
      total: paginated.total,
    };
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
};
