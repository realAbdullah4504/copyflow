
import { useForm, FormProvider, type FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import FormField from "../fields/FormField";
import type { AuthFormConfig, AuthFieldConfig } from "@/types/forms";

interface AuthFormProps<T extends FieldValues> {
  config: AuthFormConfig<T>;
  onSubmit: (data: T) => void;
  isSubmitting: boolean;
  error?: string;
  form: ReturnType<typeof useForm<T>>;
  children?: React.ReactNode;
}

const AuthForm = <T extends FieldValues>({
  config,
  onSubmit,
  isSubmitting,
  error,
  form,
  children,
}: AuthFormProps<T>) => {
  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {config.fields.map((field: AuthFieldConfig<T>) => (
          <FormField key={String(field.name)} field={field} form={form} />
        ))}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {config.submitButtonText}
        </Button>

        {config.footer && <div className="mt-4">{config.footer}</div>}
        {children}
      </form>
    </FormProvider>
  );
};

export default AuthForm;