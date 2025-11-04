import { mapSubmissionRow } from "./helpers/mappers";
import type {
  CreateSubmissionInput,
  Submission,
  SubmissionQueryParams,
} from "@/types";
import { fileStorageService } from "./fileStorageService";
import {
  applyFilters,
  applySorting,
  applyPagination,
} from "@/utils/supabaseQueryBuilder";
import { AppError } from "@/utils";
import { supabase } from "@/lib/supabaseClient";

export const submissionService = {
  getSubmissions: async (
    params?: SubmissionQueryParams
  ): Promise<{ data: Submission[]; total: number }> => {
    const { filters, sorting, pagination } = params ?? {};

    const SUBMISSION_SELECT = `
      id,file_type,lesson_date,copies,paper_color,class_id,teacher_id,notes,status,
      print_settings,files,created_at,updated_at,
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
      print_settings,files,created_at,updated_at,
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
      print_settings,files,created_at,updated_at,
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
      print_settings,files,created_at,updated_at,
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
      print_settings,files,created_at,updated_at,
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
      print_settings,files,created_at,updated_at,
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
    print_settings,files,created_at,updated_at,
      teacher:teacher_id(*),
      class:class_id(*)
    `;
    const { data: newSubmission, error: createError } = await supabase
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

  createSubmissionWithFiles: async (
    submission: CreateSubmissionInput,
    files: File[]
  ): Promise<Submission> => {
    // 1) Create submission row first
    const created = await submissionService.createSubmission(submission);
    const submissionId = created.id;

    if (files && files.length > 0) {
      const { paths: uploadedNames, errors } =
        await fileStorageService.uploadFiles(submissionId, files);

      if (errors.length > 0) {
        console.error("Some files failed to upload:", errors);
        // Continue with the submission even if some files failed to upload
      }

      if (uploadedNames.length > 0) {
        // 2) Update submission row with successfully uploaded filenames
        const SUBMISSION_SELECT = `
        id,file_type,lesson_date,copies,paper_color,class_id,teacher_id,notes,status,
        print_settings,files,created_at,updated_at,
          teacher:teacher_id(*),
          class:class_id(*)
        `;
        const { data: updatedSubmission, error: updateError } = await supabase
          .from("submissions")
          .update({ files: uploadedNames })
          .eq("id", submissionId)
          .select(SUBMISSION_SELECT)
          .single();

        if (updateError) {
          console.error(
            "Error updating submission with file names:",
            updateError
          );
          // Continue without failing the whole operation
        } else {
          return mapSubmissionRow(updatedSubmission);
        }
      }
    }

    return created;
  },

  downloadFile: async (submissionId: string, fileName: string) => {
    return fileStorageService.downloadFile(submissionId, fileName);
  },

  updateSubmission: async (
    id: string,
    updates: Partial<Submission>
  ): Promise<Submission> => {
    const SUBMISSION_SELECT = `
    id,file_type,lesson_date,copies,paper_color,class_id,teacher_id,notes,status,
    print_settings,files,created_at,updated_at,
    teacher:teacher_id(*),
    class:class_id(*)
    `;

    const dbSubmission = {
      ...(updates.teacherId && { teacher_id: updates.teacherId }),
      ...(updates.classId && { class_id: updates.classId }),
      ...(updates.fileType && { file_type: updates.fileType }),
      ...(updates.lessonDate && { lesson_date: updates.lessonDate }),
      ...(updates.copies && { copies: updates.copies }),
      ...(updates.paperColor && { paper_color: updates.paperColor }),
      ...(updates.printSettings && { print_settings: updates.printSettings }),
      ...(updates.status && { status: updates.status }),
      ...(updates.files && { files: updates.files }),
      ...(updates.notes && { notes: updates.notes }),
    };

    const { data, error } = await supabase
      .from("submissions")
      .update(dbSubmission)
      .eq("id", id)
      .select(SUBMISSION_SELECT)
      .single();

    if (error) throw await AppError.from(error);
    return mapSubmissionRow(data);
  },

  updateSubmissionWithFileChanges: async (
    id: string,
    updates: Partial<Submission>,
    newFiles: File[],
    deletedPaths: string[]
  ): Promise<Submission> => {
    // Step 1: Delete files if needed
    if (deletedPaths.length > 0) {
      const { error } = await fileStorageService.deleteFiles(id, deletedPaths);
      if (error) throw await AppError.from(error);
    }

    // Step 2: Upload new files if any
    let uploadedPaths: string[] = [];
    if (newFiles.length > 0) {
      const { paths, errors } = await fileStorageService.uploadFiles(
        id,
        newFiles
      );
      if (errors.length > 0) {
        throw await AppError.from(errors);
      }

      uploadedPaths = paths || [];
    }

    // Step 3: Fetch existing files
    const { data: existingSubmission, error: fetchError } = await supabase
      .from("submissions")
      .select("files")
      .eq("id", id)
      .single();
    if (fetchError) throw await AppError.from(new Error(fetchError.message));

    // Step 4: Merge remaining + new
    const existingFiles = existingSubmission?.files || [];
    const remainingFiles = existingFiles.filter(
      (path: string) => !deletedPaths.includes(path)
    );
    const allFiles = [...remainingFiles, ...uploadedPaths];

    // Step 5: Delegate the DB update to the simple update method
    return submissionService.updateSubmission(id, {
      ...updates,
      files: allFiles,
    });
  },

  deleteSubmission: async (id: string): Promise<void> => {
    // First, try to delete any associated files
    const { error: fileError } = await fileStorageService.deleteSubmissionFiles(
      id
    );

    if (fileError) {
      console.error(
        "Error deleting submission files, continuing with submission deletion:",
        fileError
      );
      // Continue with submission deletion even if file deletion fails
    }

    // Delete the submission record
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
