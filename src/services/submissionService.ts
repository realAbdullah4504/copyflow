import { mockSubmissions } from "@/constants";
import { supabase } from "@/lib/supabaseClient";
import type {
  CreateSubmissionInput,
  Submission,
  SubmissionQueryParams,
} from "@/types";
import {
  applyFilters,
  applySorting,
  applyPagination,
} from "@/utils/supabaseQueryBuilder";
import { mapSubmissionRow } from "./helpers/mappers";
import {
  filterData,
  paginateData,
  sortData,
} from "./helpers/submissionHelpers";

export const submissionService = {
  getSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { filters, sorting, pagination } = params ?? {};

    const SUBMISSION_SELECT = `
      id,file_type,lesson_date,copies,paper_color,class_id,teacher_id,notes,status,
      print_settings,created_at,updated_at,
      teacher:teacher_id(*),
      class:class_id(*)
    `;

    let query = supabase
      .from("submissions")
      .select(SUBMISSION_SELECT, { count: "exact" })
      .neq("status", "printed");

    query = applyFilters(query, filters);
    query = applySorting(query, sorting);
    query = applyPagination(query, pagination);
    const { data, count, error } = await query;

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Failed to fetch submissions");

    const mapped: Submission[] = data.map(mapSubmissionRow);

    console.log(mapped, "mapped");
    return { data: mapped, total: count ?? mapped.length };
  },

  getSubmissionsByTeacher: async (
    teacherId: string,
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { pagination, filters, sorting } = params ?? {};
    const { data: submissions } = await supabase
      .from("submissions")
      .select(SUBMISSION_SELECT)
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
    submission: CreateSubmissionInput
  ): Promise<Submission> => {
    const SUBMISSION_SELECT = `
      id,file_type,lesson_date,copies,paper_color,class_id,teacher_id,notes,status,
      print_settings,created_at,updated_at,
      teacher:teacher_id(*),
      class:class_id(*)
    `;
    const { data: newSubmission } = await supabase
      .from("submissions")
      .insert(submission)
      .select(SUBMISSION_SELECT)
      .single();

    if (!newSubmission) {
      throw new Error("Failed to create submission");
    }
    const submissionData = mapSubmissionRow(newSubmission);
    return submissionData;
  },

  updateSubmission: async (
    id: string,
    updates: Partial<Submission>
  ): Promise<Submission> => {
    console.log(id, updates, "updates");
    return null;
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
