import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader as Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, loginError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (data) => {
          switch (data.user.role) {
            case "teacher":
              navigate("/dashboard/teacher");
              break;
            case "secretary":
              navigate("/dashboard/secretary");
              break;
            case "admin":
              navigate("/dashboard/admin");
              break;
          }
          toast.success("Welcome back!");
        },
        onError: () => {
          toast.error("Invalid credentials");
        },
      }
    );
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">CopyFlow</h1>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
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

            <div className="space-y-2">
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
                <AlertDescription>
                  Invalid email or password. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Demo Accounts
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => quickLogin("sarah.johnson@school.edu")}
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-xs text-slate-500">Teacher Account</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => quickLogin("emily.rodriguez@school.edu")}
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">Emily Rodriguez</div>
                <div className="text-xs text-slate-500">Secretary Account</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => quickLogin("david.thompson@school.edu")}
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">David Thompson</div>
                <div className="text-xs text-slate-500">Admin Account</div>
              </div>
            </Button>
          </div>

          <p className="text-xs text-center text-slate-500">
            Click any demo account to auto-fill credentials
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginForm;
