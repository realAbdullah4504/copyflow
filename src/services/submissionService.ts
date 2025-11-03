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
import { AppError } from "@/utils";

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

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    if (!data) {
      const appError = await AppError.from({
        message: "Failed to fetch submissions",
        status: 500,
      });
      throw appError;
    }

    const mapped: Submission[] = data.map(mapSubmissionRow);

    return { data: mapped, total: count ?? mapped.length };
  },

  getSubmissionsByTeacher: async (
    teacherId: string,
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
      .neq("status", "printed")
      .eq("teacher_id", teacherId);

    query = applyFilters(query, filters);
    query = applySorting(query, sorting);
    query = applyPagination(query, pagination);
    const { data, count, error } = await query;

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    if (!data) {
      const appError = await AppError.from({
        message: "Failed to fetch submissions",
        status: 500,
      });
      throw appError;
    }

    const mapped: Submission[] = data.map(mapSubmissionRow);

    return { data: mapped, total: count ?? mapped.length };
  },

  getArchivedSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{
    data: Submission[];
    total: number;
  }> => {
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
      .eq("status", "printed");

    query = applyFilters(query, filters);
    query = applySorting(query, sorting);
    query = applyPagination(query, pagination);
    const { data, count, error } = await query;

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    if (!data) {
      const appError = await AppError.from({
        message: "Failed to fetch submissions",
        status: 500,
      });
      throw appError;
    }

    const mapped: Submission[] = data.map(mapSubmissionRow);

    return { data: mapped, total: count ?? mapped.length };
  },

  getArchivedSubmissionsByTeacher: async (
    teacherId: string,
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
      .eq("status", "printed")
      .eq("teacher_id", teacherId);

    query = applyFilters(query, filters);
    query = applySorting(query, sorting);
    query = applyPagination(query, pagination);
    const { data, count, error } = await query;

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    if (!data) {
      const appError = await AppError.from({
        message: "Failed to fetch submissions",
        status: 500,
      });
      throw appError;
    }

    const mapped: Submission[] = data.map(mapSubmissionRow);

    return { data: mapped, total: count ?? mapped.length };
  },

  getCensoredSubmissions: async (
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
      .eq("status", "censored");

    query = applyFilters(query, filters);
    query = applySorting(query, sorting);
    query = applyPagination(query, pagination);
    const { data, count, error } = await query;

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    if (!data) {
      const appError = await AppError.from({
        message: "Failed to fetch submissions",
        status: 500,
      });
      throw appError;
    }

    const mapped: Submission[] = data.map(mapSubmissionRow);

    return { data: mapped, total: count ?? mapped.length };
  },

  getCensoredSubmissionsByTeacher: async (
    teacherId: string,
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
      .eq("status", "censored")
      .eq("teacher_id", teacherId);

    query = applyFilters(query, filters);
    query = applySorting(query, sorting);
    query = applyPagination(query, pagination);
    const { data, count, error } = await query;

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    if (!data) {
      const appError = await AppError.from({
        message: "Failed to fetch submissions",
        status: 500,
      });
      throw appError;
    }

    const mapped: Submission[] = data.map(mapSubmissionRow);

    return { data: mapped, total: count ?? mapped.length };
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
    const { data: newSubmission,error: createError } = await supabase
      .from("submissions")
      .insert(dbSubmission)
      .select(SUBMISSION_SELECT)
      .single();

    if (createError) {
      const appError = await AppError.from(createError);
      throw appError;
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
      ...(updates.teacherId !== undefined && { teacher_id: updates.teacherId }),
      ...(updates.classId !== undefined && { class_id: updates.classId }),
      ...(updates.fileType !== undefined && { file_type: updates.fileType }),
      ...(updates.lessonDate !== undefined && {
        lesson_date: updates.lessonDate,
      }),
      ...(updates.copies !== undefined && { copies: updates.copies }),
      ...(updates.paperColor !== undefined && {
        paper_color: updates.paperColor,
      }),
      ...(updates.printSettings !== undefined && {
        print_settings: updates.printSettings,
      }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
    };

    const { data: updatedSubmission,error: updateError } = await supabase
      .from("submissions")
      .update(dbSubmission)
      .select(SUBMISSION_SELECT)
      .eq("id", id)
      .single();

    if (updateError) {
      const appError = await AppError.from(updateError);
      throw appError;
    }

    const submissionData = mapSubmissionRow(updatedSubmission);
    return submissionData;
  },

  deleteSubmission: async (id: string): Promise<void> => {
    const { error: deleteError } = await supabase
      .from("submissions")
      .delete()
      .eq("id", id)
      .single();

    if (deleteError) {
      const appError = await AppError.from(deleteError);
      throw appError;
    }
  },
};
