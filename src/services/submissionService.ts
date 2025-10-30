import { mockSubmissions } from "@/constants";
import type { SubmissionQueryParams } from "@/hooks/queries";
import type { Submission } from "@/types";

export const submissionService = {
  getSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {

    console.log(params)
    const { pagination, filters, sorting } = params ?? {};

    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = mockSubmissions.filter((sub) => sub.status !== "printed");

    // Apply sorting if specified
    if (sorting && sorting.length > 0) {
      filtered.sort((a, b) => {
        for (const sort of sorting) {
          const aValue = a[sort.id as keyof Submission];
          const bValue = b[sort.id as keyof Submission];
          
          // Handle different data types for sorting
          if (aValue === bValue) continue;
          
          if (aValue === null || aValue === undefined) return sort.desc ? -1 : 1;
          if (bValue === null || bValue === undefined) return sort.desc ? 1 : -1;
          
          if (sort.id === 'grade' && typeof aValue === 'string' && typeof bValue === 'string') {
            // Special handling for grade sorting (e.g., '9A', '10B', '12B')
            const gradeRegex = /^(\d+)([A-Za-z]*)$/;
            const aMatch = aValue.match(gradeRegex);
            const bMatch = bValue.match(gradeRegex);
            
            if (aMatch && bMatch) {
              const aNum = parseInt(aMatch[1], 10);
              const bNum = parseInt(bMatch[1], 10);
              
              // First compare the numeric part
              if (aNum !== bNum) {
                return sort.desc ? bNum - aNum : aNum - bNum;
              }
              
              // If numeric parts are equal, compare the letter part
              const aLetter = aMatch[2] || '';
              const bLetter = bMatch[2] || '';
              const letterCompare = aLetter.localeCompare(bLetter);
              
              return sort.desc ? -letterCompare : letterCompare;
            }
          }
          
          // Default string comparison for other string fields
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sort.desc 
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }
          
          if (aValue instanceof Date && bValue instanceof Date) {
            return sort.desc 
              ? bValue.getTime() - aValue.getTime()
              : aValue.getTime() - bValue.getTime();
          }
          
          if (aValue < bValue) return sort.desc ? 1 : -1;
          if (aValue > bValue) return sort.desc ? -1 : 1;
        }
        return 0;
      });
    } else {
      // Default sorting by createdAt desc if no sorting is specified
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (filters) {
      const { grade, fileType, status, timeFrame } = filters;

      if (grade) {
        filtered = filtered.filter((s) => s.grade === grade);
      }
      if (fileType) {
        filtered = filtered.filter((s) => s.fileType === fileType);
      }
      if (status) {
        filtered = filtered.filter((s) => s.status === status);
      }
      if (timeFrame && timeFrame !== "all") {
        const now = new Date();
        let from: Date | null = null;
        switch (timeFrame) {
          case "today": {
            from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          }
          case "7d": {
            from = new Date(now);
            from.setDate(from.getDate() - 7);
            break;
          }
          case "30d": {
            from = new Date(now);
            from.setDate(from.getDate() - 30);
            break;
          }
          case "this_month": {
            from = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          }
        }
        if (from) {
          filtered = filtered.filter((s) => new Date(s.createdAt) >= from);
        }
      }
    }

    //pagination stuff
    if (pagination) {
      const { pageIndex, pageSize } = pagination;
      const start = pageIndex * pageSize;
      const paginated = filtered.slice(start, start + pageSize);

      return {
        data: paginated,
        total: filtered.length,
      };
    }
    return {
      data: filtered,
      total: filtered.length,
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

  getArchivedSubmissions: async (): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions
      .filter((s) => s.status === "printed")
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
      .filter((s) => s.teacherId === teacherId && s.status === "printed")
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
