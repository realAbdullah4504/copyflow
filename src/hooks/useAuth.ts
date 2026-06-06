import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { mutationHandlers } from "./mutations";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isGoogleOAuthFlow, setIsGoogleOAuthFlow] = useState(() => {
    // Check localStorage for ongoing OAuth flow (handles page refresh during redirect)
    return localStorage.getItem('google_oauth_flow') === 'true';
  });

  // Update localStorage when OAuth flow state changes
  useEffect(() => {
    if (isGoogleOAuthFlow) {
      localStorage.setItem('google_oauth_flow', 'true');
    } else {
      localStorage.removeItem('google_oauth_flow');
    }
  }, [isGoogleOAuthFlow]);

  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity,
  });

  // Reset Google OAuth flow when user data changes
  useEffect(() => {
    if (data?.user) {
      setIsGoogleOAuthFlow(false);
    }
  }, [data]);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    ...mutationHandlers({
      successMessage: "Welcome back!",
      onSuccess: (data) => {
        queryClient.setQueryData(["currentUser"], data);
      },
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

  const loginWithGoogleMutation = useMutation({
    mutationFn: authService.loginWithGoogle,
    ...mutationHandlers({
      successMessage: "Redirecting to Google...",
      onSuccess: () => {
        // Set OAuth flow state when redirect starts
        setIsGoogleOAuthFlow(true);
      },
      onError: () => {
        setIsGoogleOAuthFlow(false);
      },
    }),
  });

  const handleOAuthCallbackMutation = useMutation({
    mutationFn: authService.handleOAuthCallback,
    ...mutationHandlers({
      successMessage: "Welcome!",
      onSuccess: (data) => {
        queryClient.setQueryData(["currentUser"], data);
        setIsGoogleOAuthFlow(false);
      },
      onError: () => {
        setIsGoogleOAuthFlow(false);
      },
    }),
  });

  // Combined loading state for Google OAuth
  const isGoogleLoading = loginWithGoogleMutation.isPending || handleOAuthCallbackMutation.isPending || isGoogleOAuthFlow;

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation?.error,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,
    loginWithGoogle: loginWithGoogleMutation.mutate,
    isLoggingInWithGoogle: isGoogleLoading,
    googleLoginError: loginWithGoogleMutation.error,
    handleOAuthCallback: handleOAuthCallbackMutation.mutate,
    isHandlingOAuthCallback: handleOAuthCallbackMutation.isPending,
    oAuthCallbackError: handleOAuthCallbackMutation.error,
  };
}
