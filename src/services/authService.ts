import { supabase } from "@/lib/supabaseClient";
import type {
  User,
  LoginResponse,
  LoginFormFields,
  SignupFormFields,
  SignupResponse,
} from "@/types";
import { AppError } from "@/utils";

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    role: "teacher",
    active: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@school.edu",
    role: "teacher",
    active: true,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@school.edu",
    role: "secretary",
    active: true,
  },
  {
    id: "4",
    name: "David Thompson",
    email: "david.thompson@school.edu",
    role: "admin",
    active: true,
  },
];

export const authService = {
  signUp: async (credentials: SignupFormFields): Promise<SignupResponse> => {
    const { email, password, name } = credentials;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }

    if (!data.user) {
      const appError = await AppError.from(
        "No user data returned from sign up"
      );
      throw appError;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          email,
          name,
          role: "admin",
          active: true,
        },
      ])
      .select()
      .single();

    if (profileError) {
      const appError = await AppError.from(profileError);
      throw appError;
    }
    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: name,
      role: "admin",
      active: true,
    };

    return { user };
  },
  login: async (credentials: LoginFormFields): Promise<LoginResponse> => {
    const { email, password } = credentials;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }

    if (!data.user) {
      const appError = await AppError.from("No user data returned from login");
      throw appError;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      const appError = await AppError.from(profileError);
      throw appError;
    }
    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: profile.name,
      role: profile.role,
      active: profile.active,
    };

    return { user };
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
  },

  getCurrentUser: async (): Promise<LoginResponse> => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      const appError = await AppError.from("No user data returned from login");
      throw appError;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      const appError = await AppError.from(profileError);
      throw appError;
    }
    const user: User = {
      id: data.user.id,
      email: data.user.email || profile.email,
      name: profile.name,
      role: profile.role,
      active: profile.active,
    };

    return { user };
  },

  setCurrentUser: (data: { user: User; token: string }): void => {
    if (typeof globalThis.window === "undefined") return;
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  },
};
