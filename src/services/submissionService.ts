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
    const dbSubmission = {
      teacher_id: submission.teacherId,
      class_id: submission.classId,
      file_type: submission.fileType,
      lesson_date: submission.lessonDate,
      copies: submission.copies,
      paper_color: submission.paperColor,
      print_settings: submission.printSettings,
      status: "pending",
      notes: submission.notes,
    };

    const SUBMISSION_SELECT = `
    id,file_type,lesson_date,copies,paper_color,class_id,teacher_id,notes,status,
    print_settings,created_at,updated_at,
      teacher:teacher_id(*),
      class:class_id(*)
    `;
    const { data: newSubmission } = await supabase
      .from("submissions")
      .insert(dbSubmission)
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
    const SUBMISSION_SELECT = `
    id,file_type,lesson_date,copies,paper_color,class_id,teacher_id,notes,status,
    print_settings,created_at,updated_at,
      teacher:teacher_id(*),
      class:class_id(*)
    `;

    const dbSubmission = {
      teacher_id: updates.teacherId,
      class_id: updates.classId,
      file_type: updates.fileType,
      lesson_date: updates.lessonDate,
      copies: updates.copies,
      paper_color: updates.paperColor,
      print_settings: updates.printSettings,
      status: updates.status,
      notes: updates.notes,
    };

    const { data: updatedSubmission } = await supabase
      .from("submissions")
      .update(dbSubmission)
      .select(SUBMISSION_SELECT)
      .eq("id", id)
      .single();

    if (!updatedSubmission) {
      throw new Error("Failed to update submission");
    }

    const submissionData = mapSubmissionRow(updatedSubmission);
    return submissionData;
  },

  deleteSubmission: async (id: string): Promise<Submission> => {
    const { data: deletedSubmission } = await supabase
      .from("submissions")
      .delete()
      .eq("id", id)
      .single();

    if (!deletedSubmission) {
      throw new Error("Failed to delete submission");
    }

    return deletedSubmission;
  },
};
