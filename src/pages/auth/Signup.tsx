import { AuthPageHeader, SignupForm } from "@/components/auth";
import { CardContent } from "@/components/ui/card";

const SignupPage = () => {
  return (
    <CardContent className="space-y-6">
      <AuthPageHeader
        title="Create an account"
        description="Sign up to access your dashboard"
      />
      <SignupForm />
    </CardContent>
  );
};

export default SignupPage;
