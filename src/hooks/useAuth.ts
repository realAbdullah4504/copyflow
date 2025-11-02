import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { mutationHandlers } from "./mutations";

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    ...mutationHandlers({
      successMessage: "Login successful",
      invalidateKeys: ["currentUser"],
    }),
  });

  const signupMutation = useMutation({
    mutationFn: authService.signUp,
    ...mutationHandlers({
      successMessage: "Account created successfully",
      invalidateKeys: ["currentUser"],
    }),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    ...mutationHandlers({
      successMessage: "Logout successful",
      invalidateKeys: ["currentUser"],
    }),
  });

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,
  };
}
