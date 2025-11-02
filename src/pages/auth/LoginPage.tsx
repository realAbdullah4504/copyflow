import { AUTH_FIELDS, AuthPageHeader } from "@/components/auth";
import AuthForm from "@/components/auth/forms/AuthForm";
import { DemoAccountButton } from "@/components/auth/ui/DemoAccountButton";
import { CardContent } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

type LoginInputs = {
  email: string;
  password: string;
};

const demoAccounts = [
  { email: "teacher@copyflow.com", name: "Teacher", role: "Teacher", password: "teacher1234" },
  {
    email: "idycziment@gmail.com",
    name: "Secretary",
    role: "Secretary",
    password: "gfd-25KC",
  },
  { email: "abdullahjaved4504@gmail.com", name: "admin", role: "Admin", password: "11111111@" },
];

const LoginPage = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  const config = AUTH_FIELDS.LOGIN;
  const navigate = useNavigate();

  const form = useForm<LoginInputs>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const { setValue } = form;

  const onSubmit = ({ email, password }: LoginInputs) => {
    login(
      { email, password },
      {
        onSuccess: (data) => {
          navigate(`/dashboard/${data.user.role}`);
          toast.success("Welcome back!");
        },
        onError: () => toast.error("Invalid credentials"),
      }
    );
  };

  const quickLogin = (userEmail: string) => {
    setValue("email", userEmail, { shouldValidate: true });
    setValue("password", demoAccounts.find((acc) => acc.email === userEmail)?.password, { shouldValidate: true });
  };
  return (
    <CardContent className="space-y-6">
      <AuthPageHeader
        title="Welcome Back"
        description="Sign in to access your dashboard"
      />
      <AuthForm
        config={config}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isLoggingIn}
        error={loginError ? "Invalid email or password" : undefined}
      />

      <Divider label="Demo Accounts" />

      <div className="grid gap-2">
        {demoAccounts.map((acc) => (
          <DemoAccountButton
            key={acc.email}
            email={acc.email}
            name={acc.name}
            role={acc.role}
            onClick={quickLogin}
          />
        ))}
      </div>

      <p className="text-xs text-center text-slate-500 mt-2">
        Click any demo account to auto-fill credentials
      </p>

      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </CardContent>
  );
};

export default LoginPage;
