import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { 
    handleOAuthCallback, 
    isHandlingOAuthCallback, 
    oAuthCallbackError,
    isLoggingInWithGoogle
  } = useAuth();

  useEffect(() => {
    const processOAuthCallback = () => {
      handleOAuthCallback(undefined, {
        onSuccess: (data) => {
          // Profile is already created and user is set in the hook
          navigate(`/dashboard/${data.user.role}`);
        },
        onError: () => {
          navigate("/auth/login");
        },
      });
    };

    // Only process if we're in an OAuth flow
    if (isLoggingInWithGoogle || !oAuthCallbackError) {
      processOAuthCallback();
    } else {
      navigate("/auth/login");
    }
  }, [navigate, handleOAuthCallback, isLoggingInWithGoogle, oAuthCallbackError]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          {isHandlingOAuthCallback 
            ? "Completing authentication..." 
            : "Setting up your account..."
          }
        </p>
        {oAuthCallbackError && (
          <p className="text-destructive text-sm mt-2">
            {oAuthCallbackError.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
