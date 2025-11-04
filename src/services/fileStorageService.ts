import { supabase } from "@/lib/supabaseClient";

type FileObject = {
  name: string;
  // Add other properties you need from the file object
};

type FileDownloadResult = {
  data: Blob | null;
  error: Error | null;
};

const BUCKET_NAME = "submissions";

export const fileStorageService = {
  /**
   * Uploads multiple files to storage
   */
  uploadFiles: async (
    submissionId: string,
    files: File[]
  ): Promise<{ paths: string[]; errors: Error[] }> => {
    const uploadPromises = files.map(async (file) => {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replaceAll(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${submissionId}/${timestamp}_${sanitizedFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
          upsert: false,
          contentType: file.type || "application/octet-stream",
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Error uploading file:", { path, error: uploadError });
        throw new Error(
          `Failed to upload ${file.name}: ${uploadError.message}`
        );
      }

      return sanitizedFileName; // Or `path` if you want to store the full path
    });

    const results = await Promise.allSettled(uploadPromises);

    const paths: string[] = [];
    const errors: Error[] = [];

    for (const result of results) {
      if (result.status === "fulfilled") paths.push(result.value);
      else errors.push(result.reason);
    }

    return { paths, errors };
  },

  /**
   * Downloads a file from storage
   */
  downloadFile: async (
    submissionId: string,
    fileName: string
  ): Promise<FileDownloadResult> => {
    try {
      // List all files in the submission directory
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(submissionId);

      if (listError) {
        console.error("Error listing files:", listError);
        throw listError;
      }

      if (!files || files.length === 0) {
        throw new Error(`No files found for submission ${submissionId}`);
      }

      console.log("Available files in directory:", files);

      // Find the file that contains the original filename (case-insensitive)
      const matchingFile = files.find((file: FileObject) => {
        const originalName = file.name
          .replace(/^\d+_/, "") // remove timestamp
          .replace(/_/g, " ") // normalize underscores to spaces
          .trim()
          .toLowerCase();

        const targetName = fileName.replace(/_/g, " ").trim().toLowerCase();

        return originalName === targetName;
      });

      if (!matchingFile) {
        throw new Error(
          `File ${fileName} not found in submission ${submissionId}.`
        );
      }

      const fullPath = `${submissionId}/${matchingFile.name}`;
      console.log("Attempting to download file:", fullPath);

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(fullPath);

      if (error) {
        console.error("Storage download error:", error);
        throw error;
      }

      if (!data) {
        throw new Error(`No data received for file ${matchingFile.name}`);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error in downloadFile:", {
        submissionId,
        fileName,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },

  /**
   * Deletes all files associated with a submission
   */
  deleteSubmissionFiles: async (
    submissionId: string
  ): Promise<{ success: boolean; error?: Error }> => {
    try {
      // List all files in the submission directory
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(submissionId);

      if (listError) {
        console.error("Error listing files for deletion:", listError);
        return { success: false, error: listError };
      }

      if (!files || files.length === 0) {
        console.log(
          `No files found for submission ${submissionId}, nothing to delete`
        );
        return { success: true };
      }

      // Delete all files in the submission directory
      const filePaths = files.map(
        (file: FileObject) => `${submissionId}/${file.name}`
      );
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filePaths);

      if (deleteError) {
        console.error("Error deleting files:", deleteError);
        return { success: false, error: deleteError };
      }

      console.log(
        `Successfully deleted ${filePaths.length} files for submission ${submissionId}`
      );
      return { success: true };
    } catch (error) {
      console.error("Error during file cleanup:", error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },

  /**
   * Deletes a specific file associated with a submission (by original filename)
   */
  deleteFile: async (
    submissionId: string,
    fileName: string
  ): Promise<{ success: boolean; error?: Error }> => {
    try {
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(submissionId);

      if (listError) {
        console.error("Error listing files for deletion:", listError);
        return { success: false, error: listError };
      }

      if (!files || files.length === 0) {
        console.log(
          `No files found for submission ${submissionId}, nothing to delete`
        );
        return { success: true };
      }

      // Find matching file by comparing normalized names (similar to downloadFile)
      const matchingFile = files.find((file: any) => {
        const originalName = file.name
          .replace(/^[0-9]+_/, "")
          .replace(/_/g, " ")
          .trim()
          .toLowerCase();

        const targetName = fileName.replace(/_/g, " ").trim().toLowerCase();

        return originalName === targetName;
      });

      if (!matchingFile) {
        console.warn(
          `File ${fileName} not found for submission ${submissionId}, nothing deleted`
        );
        return { success: true };
      }

      const fullPath = `${submissionId}/${matchingFile.name}`;
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fullPath]);

      if (deleteError) {
        console.error("Error deleting file:", deleteError);
        return { success: false, error: deleteError };
      }

      console.log(`Successfully deleted file ${fullPath}`);
      return { success: true };
    } catch (error) {
      console.error("Error during single file deletion:", error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
};

export default fileStorageService;
