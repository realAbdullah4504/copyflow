import { FormProvider, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { SubmissionFormValues } from "../fields";

interface FormProps {
  children: ReactNode;
  onSubmit: (data: SubmissionFormValues) => void | Promise<void>;
  submitText?: string;
  isSubmitting?: boolean;
  className?: string;
  form: UseFormReturn<SubmissionFormValues>;
}

const Form = ({
  children,
  onSubmit,
  submitText = 'Submit',
  isSubmitting = false,
  className = '',
  form,
}: FormProps) => {
  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
        noValidate
      >
        {children}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitText}
        </Button>
      </form>
    </FormProvider>
  );
};

// FormFieldGroup component for grouping related fields
export const FormFieldGroup = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={cn("space-y-4", className)}>
    {children}
  </div>
);

export { Form };

