import { AUTH_FIELDS, AuthForm, AuthPageHeader } from "@/components/auth";
import { CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SignupFormFields } from "@/types";
import { useAuth } from "@/hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuth();

  const form = useForm<SignupFormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const config = AUTH_FIELDS.SIGNUP;

  const onSubmit = (data: SignupFormFields): void => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    signup(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };
  return (
    <CardContent className="space-y-6">
      <AuthPageHeader
        title="Create an account"
        description="Sign up to access your dashboard"
      />
      <AuthForm
        config={config}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSigningUp}
      />
    </CardContent>
  );
};

export default SignupPage;
