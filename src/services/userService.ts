import { supabase } from "@/lib/supabaseClient";
import type { CreateUserResponse, GetUsersResponse, User } from "@/types";
import { AppError } from "@/utils/errorUtils";

export const userService = {
  getUsers: async (adminId?: string): Promise<GetUsersResponse> => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("admin_id", adminId)
      .order("created_at", { ascending: false });
    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }

    return {
      users: data,
      total: data.length,
    };
  },
  getTeachers: async (adminId: string, status?: boolean): Promise<User[]> => {
    const query = supabase
      .from("profiles")
      .select()
      .eq("role", "teacher")
      .eq("admin_id", adminId);
    if (status !== undefined) {
      query.eq("active", status);
    }
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    return data;
  },

  createUser: async ({
    user,
    adminId,
  }: {
    user: Omit<User, "id" | "createdAt" | "updatedAt">;
    adminId: string;
  }): Promise<CreateUserResponse> => {
    const { data, error } = await supabase.functions.invoke("create-user", {
      body: { ...user, adminId },
    });
    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    const newUser = data.user;
    const password = data.temporaryPassword;
    return { user: newUser, password };
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
    const updatedUser = {
      name: data.name,
      email: data.email,
      role: data.role,
      active: data.active,
      id: data.id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
    return updatedUser;
  },

  deleteUser: async (id: string): Promise<void> => {
    const { error } = await supabase.functions.invoke("delete-user", {
      body: { userId: id },
      method: "DELETE",
    });
    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
  },

  requestPasswordReset: async (
    userId: string
  ): Promise<{ temporaryPassword: string }> => {
    const { data, error } = await supabase.functions.invoke(
      "reset-user-password",
      {
        body: { userId },
      }
    );

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }

    return { temporaryPassword: data.temporaryPassword };
  },
};
