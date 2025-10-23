// src/components/auth/AuthForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type {
  UseFormReturn,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

type AuthMode = "login" | "signup";

type AuthFormFields = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
};

interface AuthFormProps<T extends FieldValues> {
  mode: AuthMode;
  onSubmit: (data: T) => void;
  isSubmitting: boolean;
  error?: string;
  children?: React.ReactNode;
  form: UseFormReturn<T>;
}

const AuthForm = <T extends AuthFormFields>({
  mode,
  onSubmit,
  isSubmitting,
  error,
  children,
  form,
}: AuthFormProps<T>) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = form;

  const password = watch ? watch("password" as Path<T>) : "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@school.edu"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email" as Path<T>, {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-600">
            {(errors.email as FieldError)?.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password" as Path<T>, {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p id="password-error" className="text-xs text-red-600">
            {(errors.password as FieldError)?.message}
          </p>
        )}
      </div>

      {mode === "signup" && (
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
            {...register("confirmPassword" as Path<T>, {
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-xs text-red-600">
              {(errors.confirmPassword as FieldError)?.message}
            </p>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-2"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
        {mode === "login" ? "Sign In" : "Create Account"}
      </Button>

      {children}
    </form>
  );
};

export default AuthForm;
