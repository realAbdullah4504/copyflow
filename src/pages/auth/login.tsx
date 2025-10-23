import { AuthPageHeader, LoginForm } from "@/components/auth";
import { CardContent } from "@/components/ui/card";

const LoginPage = () => {
  return (
    <CardContent className="space-y-6">
      <AuthPageHeader
        title="Welcome Back"
        description="Sign in to access your dashboard"
      />
      <LoginForm />
    </CardContent>
  );
};

export default LoginPage;
