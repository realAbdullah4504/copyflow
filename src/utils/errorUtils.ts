import {
    FunctionsHttpError,
    PostgrestError,
    AuthError,
  } from "@supabase/supabase-js";
  
  /** A standardized error wrapper used across all services */
  export class AppError<T = unknown> extends Error {
    status: number;
    details?: T;
    code?: string;
  
    constructor(message: string, status: number = 500, details?: T, code?: string) {
      super(message);
      this.name = "AppError";
      this.status = status;
      this.details = details;
      this.code = code;
  
      if ((Error as any).captureStackTrace) {
        (Error as any).captureStackTrace(this, AppError);
      }
    }
  
    /** ✅ Converts any Supabase or unknown error into a standardized AppError */
    static async from(error: unknown): Promise<AppError> {
      // Supabase Function error
      if (error instanceof FunctionsHttpError) {
        type FnErrorResponse = { message?: string; status?: number; code?: string };
        const data = (await error.context.json().catch(() => ({}))) as FnErrorResponse;
  
        return new AppError(
          data.message ||  "Supabase function error occurred.",
          data.status || 400,
          data,
          data.code
        );
      }
  
      // Supabase PostgREST error (query/insert issues)
      if (error instanceof PostgrestError) {
        return new AppError(
          error.message || "Database operation failed.",
          400,
          { hint: error.hint, details: error.details },
          error.code
        );
      }
  
      // Supabase Auth error (sign-in/sign-up)
      if (error instanceof AuthError) {
        return new AppError(
          error.message || "Authentication failed.",
          401,
          { name: error.name, status: error.status },
          error.name
        );
      }
  
      // Already an AppError
      if (error instanceof AppError) {
        return error;
      }
  
      // Generic JS Error
      if (error instanceof Error) {
        return new AppError(error.message, 500, { stack: error.stack });
      }
  
      // Fallback for completely unknown values (non-Error objects, strings, etc.)
      return new AppError("An unknown error occurred.", 500, { raw: error });
    }
  }
  