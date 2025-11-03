import { mockSubmissions } from "@/constants";
import { supabase } from "@/lib/supabaseClient";
import type { Submission, SubmissionQueryParams } from "@/types";
import { filterData, paginateData, sortData } from "@/utils";

export const submissionService = {
  getSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { pagination, filters, sorting } = params ?? {};

    const { data: submissions } = await supabase
      .from("submissions")
      .select(
        "id,file_type,lesson_date,copies,paper_color,notes,status,print_settings,created_at,updated_at,teacher:teacher_id(*),class:class_id(*)"
      )
      .neq("status", "printed")
      .order("created_at", { ascending: false });

    const submissionsData = submissions?.map((s) => ({
      id: s.id,
      class: `Grade ${s.class?.grade} - ${s.class?.subject}`,
      teacherName: s.teacher?.name,
      teacherId: s.teacher?.id,
      classId: s.class?.id,
      fileType: s.file_type,
      lessonDate: s.lesson_date,
      copies: s.copies,
      paperColor: s.paper_color,
      notes: s.notes,
      status: s.status,
      printSettings: s.print_settings,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      // fileNames: s.fileName,
    }));

    if (!submissionsData) {
      throw new Error("Failed to fetch submissions");
    }

    // Apply sorting if specified
    let filtered = sortData(submissionsData, sorting);

    // Apply filters if specified
    filtered = filterData(filtered, filters);

    //pagination stuff
    const paginated = paginateData(filtered, pagination);
    return {
      data: paginated.data,
      total: paginated.total,
    };
  },

  getSubmissionsByTeacher: async (
    teacherId: string,
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { pagination, filters, sorting } = params ?? {};
    const { data: submissions } = await supabase
      .from("submissions")
      .select("*")
      .neq("status", "printed")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (!submissions) {
      throw new Error("Failed to fetch submissions");
    }

    // Apply sorting if specified
    let filtered = sortData(submissions, sorting);

    // Apply filters if specified
    filtered = filterData(filtered, filters);

    //pagination stuff
    const paginated = paginateData(filtered, pagination);
    return {
      data: paginated.data,
      total: paginated.total,
    };
  },

  getArchivedSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{
    data: Submission[];
    total: number;
  }> => {
    const { pagination, filters, sorting } = params ?? {};
    const { data: submissions } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "printed")
      .order("created_at", { ascending: false });

    if (!submissions) {
      throw new Error("Failed to fetch submissions");
    }

    // Apply sorting if specified
    let filtered = sortData(submissions, sorting);

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
    teacherId: string,
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { pagination, filters, sorting } = params ?? {};
    const { data: submissions } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "printed")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (!submissions) {
      throw new Error("Failed to fetch submissions");
    }

    // Apply sorting if specified
    let filtered = sortData(submissions, sorting);

    // Apply filters if specified
    filtered = filterData(filtered, filters);

    //pagination stuff
    const paginated = paginateData(filtered, pagination);
    return {
      data: paginated.data,
      total: paginated.total,
    };
  },

  getCensoredSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { pagination, filters, sorting } = params ?? {};
    const { data: submissions } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "censored")
      .order("created_at", { ascending: false });

    if (!submissions) {
      throw new Error("Failed to fetch submissions");
    }

    // Apply sorting if specified
    let filtered = sortData(submissions, sorting);

    // Apply filters if specified
    filtered = filterData(filtered, filters);

    //pagination stuff
    const paginated = paginateData(filtered, pagination);
    return {
      data: paginated.data,
      total: paginated.total,
    };
  },

  getCensoredSubmissionsByTeacher: async (
    teacherId: string,
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { pagination, filters, sorting } = params ?? {};
    const { data: submissions } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "censored")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (!submissions) {
      throw new Error("Failed to fetch submissions");
    }

    // Apply sorting if specified
    let filtered = sortData(submissions, sorting);

    // Apply filters if specified
    filtered = filterData(filtered, filters);

    //pagination stuff
    const paginated = paginateData(filtered, pagination);
    return {
      data: paginated.data,
      total: paginated.total,
    };
  },

  createSubmission: async (
    submission: Omit<Submission, "id" | "createdAt" | "updatedAt">
  ): Promise<Submission> => {
    console.log(submission,"submission");
    return null
    const { data: newSubmission } = await supabase
      .from("submissions")
      .insert(newSubmissions)
      .single();

    if (!newSubmission) {
      throw new Error("Failed to create submission");
    }

    const newSubmissionData: Submission = {
      teacherId: newSubmission.teacher_id,
      classId: newSubmission.class_id,
      fileType: newSubmission.file_type,
      lessonDate: newSubmission.lesson_date,
      copies: newSubmission.copies,
      paperColor: newSubmission.paper_color,
      notes: newSubmission.notes,
      status: newSubmission.status,
      printSettings: newSubmission.print_settings,
      files: newSubmission.files,
      id: newSubmission.id,
      createdAt: newSubmission.created_at,
      updatedAt: newSubmission.updated_at,
    };

    return newSubmissionData;
  },

  updateSubmission: async (
    id: string,
    updates: Partial<Submission>
  ): Promise<Submission> => {
    console.log(id,updates,"updates")
    return null
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
