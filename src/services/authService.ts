import { supabase } from "@/integrations/supabase/client";
import type {
  User,
  LoginResponse,
  LoginFormFields,
  SignupFormFields,
  SignupResponse,
} from "@/types";
import { AppError } from "@/utils";

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
      adminId: data.user.id,
    };

    return { user };
  },
  login: async (credentials: LoginFormFields): Promise<LoginResponse> => {
    const { email, password } = credentials;

    if (!email || !password) {
      const appError = await AppError.from("Email and password are required");
      throw appError;
    }

    const { data: isActive, error: isActiveError } = await supabase
      .from("profiles")
      .select("active")
      .eq("email", email)
      .single();

    if (isActiveError) {
      const appError = await AppError.from(new Error("User not found"));
      throw appError;
    }

    if (isActive.active === false) {
      throw await AppError.from(new Error("User is not active"));
    }

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
      adminId: profile.admin_id,
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

  loginWithGoogle: async (): Promise<LoginResponse> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${globalThis.location.origin}/auth/callback`,
      },
    });

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }

    // For OAuth, the user data will be handled by the callback
    // This method primarily initiates the OAuth flow
    return { user: null as unknown as User };
  },

  handleOAuthCallback: async (): Promise<LoginResponse> => {
    // Add retry mechanism for session availability
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        const appError = await AppError.from(error);
        throw appError;
      }

      if (!session?.user) {
        attempts++;
        if (attempts >= maxAttempts) {
          const appError = await AppError.from(new Error("No session found after retries"));
          throw appError;
        }
        // Wait briefly before retry
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }

      // Verify the session was created via OAuth for security
      if (!session.user.app_metadata?.provider) {
        const appError = await AppError.from(new Error("Invalid OAuth session"));
        throw appError;
      }

      // Check if profile already exists before creating
      const defaultRole = import.meta.env?.VITE_OAUTH_DEFAULT_ROLE || "admin";
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select()
        .eq("id", session.user.id)
        .single();

      let profile;
      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist, create new one
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            role: defaultRole,
            active: true,
            admin_id: session.user.id,
          })
          .select()
          .single();

        if (insertError) {
          const appError = await AppError.from(insertError);
          throw appError;
        }
        profile = newProfile;
      } else if (checkError) {
        const appError = await AppError.from(checkError);
        throw appError;
      } else {
        // Profile already exists, use it
        profile = existingProfile;
      }

      const user: User = {
        id: session.user.id,
        email: session.user.email || profile.email,
        name: profile.name,
        role: profile.role,
        active: profile.active,
        adminId: profile.admin_id,
      };

      return { user };
    }

    const appError = await AppError.from(new Error("Failed to process OAuth callback"));
    throw appError;
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
      adminId: profile.admin_id,
    };

    return { user };
  },

  setCurrentUser: (data: { user: User; token: string }): void => {
    if (globalThis.window === undefined) return;
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  },
};
