import type { FieldValues, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthFieldConfig } from "@/types/forms";

const FormField = <T extends FieldValues>({
  field,
  form,
}: {
  field: AuthFieldConfig<T>;
  form: ReturnType<typeof useForm<T>>;
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-1">
      <Label htmlFor={String(field.name)}>{field.label}</Label>
      <Input
        id={String(field.name)}
        type={field.type}
        placeholder={field.placeholder}
        aria-invalid={!!errors[field.name]}
        aria-describedby={
          errors[field.name] ? `${String(field.name)}-error` : undefined
        }
        disabled={field.disabled}
        {...register(field.name as any, field.validation)}
      />
      {errors[field.name] && (
        <p id={`${String(field.name)}-error`} className="text-xs text-red-600">
          {String(errors[field.name]?.message)}
        </p>
      )}
    </div>
  );
};

export default FormField;
