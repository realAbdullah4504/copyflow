import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AuthForm from "./AuthForm";

type SignupInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm = () => {
  const navigate = useNavigate();
  
  const form = useForm<SignupInputs>({
    defaultValues: { 
      name: "", 
      email: "", 
      password: "", 
      confirmPassword: "" 
    },
    mode: "onSubmit",
  });

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
    <AuthForm
      mode="signup"
      form={form}
      onSubmit={onSubmit}
      isSubmitting={false} // Set to true during form submission
    />
  );
};

export default SignupForm;