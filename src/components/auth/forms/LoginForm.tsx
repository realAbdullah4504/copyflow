import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Divider } from "@/components/ui/divider"; // You'll need to create this
import { AUTH_FIELDS } from "../fields/config";
import AuthForm from "./AuthForm";
import { DemoAccountButton } from "../ui/DemoAccountButton";

type LoginInputs = {
  email: string;
  password: string;
};

const demoAccounts = [
  { email: "sarah.johnson@school.edu", name: "Sarah Johnson", role: "Teacher" },
  {
    email: "emily.rodriguez@school.edu",
    name: "Emily Rodriguez",
    role: "Secretary",
  },
  { email: "david.thompson@school.edu", name: "David Thompson", role: "Admin" },
];

const LoginForm = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  const config=AUTH_FIELDS.LOGIN;
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
    setValue("password", "password", { shouldValidate: true });
  };

  
  return (
    <>
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
    </>
  );
};

export default LoginForm;
