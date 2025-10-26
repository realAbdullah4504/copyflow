import { AUTH_FIELDS, AuthForm, AuthPageHeader } from "@/components/auth";
import { CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SignupInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const SignupPage = () => {
  const navigate = useNavigate();

  const form = useForm<SignupInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const config = AUTH_FIELDS.SIGNUP;

  const onSubmit = async (data: SignupInputs): Promise<void> => {
    // Replace with your actual signup API call
    // Example:
    // const response = await fetch('/api/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // For now, we'll simulate a successful signup
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Signup data:", data);
        toast.success("Account created successfully!");
        navigate("/login");
        resolve();
      }, 1000);
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
        isSubmitting={false} // Set to true during form submission
      />
    </CardContent>
  );
};

export default SignupPage;
