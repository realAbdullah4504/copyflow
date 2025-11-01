import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";

type FormFieldProps = {
  type: 'text' | 'select' | 'textarea' | 'number' | 'checkbox';
  name: string;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  form: UseFormReturn<any>;
  className?: string;
};

const FormField = ({
  type,
  name,
  label,
  placeholder = '',
  options = [],
  disabled = false,
  form,
  className = '',
}: FormFieldProps) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const error = errors[name];
  const value = watch(name);

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => setValue(name, val, { shouldValidate: true })}
            disabled={disabled}
          >
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            {...register(name)}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked) => setValue(name, checked, { shouldValidate: true })}
            disabled={disabled}
            className={className}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            {...register(name, { valueAsNumber: true })}
          />
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            {...register(name)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={cn(type === 'checkbox' && 'flex items-center gap-2')}>
        {type === 'checkbox' && renderInput()}
        <span>{label}</span>
      </Label>
      {type !== 'checkbox' && renderInput()}
      {error && (
        <p className="text-sm font-medium text-destructive">
          {typeof error.message === 'string' ? error.message : 'This field is required'}
        </p>
      )}
    </div>
  );
};

export default FormField;
