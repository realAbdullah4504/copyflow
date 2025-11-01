import { FormProvider, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormProps {
  children: React.ReactNode;
  onSubmit: (data: any) => void | Promise<void>;
  submitText?: string;
  isSubmitting?: boolean;
  className?: string;
  form: UseFormReturn<any>;
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
        <div className="space-y-4">{children}</div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitText}
        </Button>
      </form>
    </FormProvider>
  );
};

export { Form };

