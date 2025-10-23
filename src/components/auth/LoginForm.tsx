import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader as Loader2 } from "lucide-react";
import { toast } from "sonner";

const demoAccounts = [
  { email: "sarah.johnson@school.edu", name: "Sarah Johnson", role: "Teacher" },
  { email: "emily.rodriguez@school.edu", name: "Emily Rodriguez", role: "Secretary" },
  { email: "david.thompson@school.edu", name: "David Thompson", role: "Admin" },
];

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, loginError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email & password");

    login({ email, password }, {
      onSuccess: (data) => {
        navigate(`/dashboard/${data.user.role}`);
        toast.success("Welcome back!");
      },
      onError: () => toast.error("Invalid credentials"),
    });
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password");
  };

  return (
    <CardContent className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-slate-600">
          Sign in to access your dashboard
        </CardDescription>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoggingIn}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoggingIn}
          />
        </div>

        {loginError && (
          <Alert variant="destructive">
            <AlertDescription>Invalid email or password</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoggingIn}
        >
          {isLoggingIn && <Loader2 className="h-5 w-5 animate-spin" />}
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">Demo Accounts</span>
        </div>
      </div>

      {/* Demo Accounts */}
      <div className="grid gap-2">
        {demoAccounts.map((acc) => (
          <Button
            key={acc.email}
            variant="outline"
            onClick={() => quickLogin(acc.email)}
            className="justify-start cursor-pointer"
          >
            <div className="text-left">
              <div className="font-medium">{acc.name}</div>
              <div className="text-xs text-slate-500">{acc.role} Account</div>
            </div>
          </Button>
        ))}
      </div>

      <p className="text-xs text-center text-slate-500 mt-2">
        Click any demo account to auto-fill credentials
      </p>
    </CardContent>
  );
};

export default LoginForm;
