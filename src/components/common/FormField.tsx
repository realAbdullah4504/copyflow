import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Upload, FileText, X } from "lucide-react";

type FormFieldProps = {
  type: 'text' | 'select' | 'textarea' | 'number' | 'checkbox' | 'date' | 'file';
  name: string;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  form: UseFormReturn<any>;
  className?: string;
  multiple?: boolean;
  accept?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  multiple = false,
  accept,
  value: externalValue,
  onChange,
}: FormFieldProps) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;
  

  const error = errors[name];
  const value = externalValue !== undefined ? externalValue : watch(name);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (onChange) {
        onChange(e);
      } else {
        setValue(name, multiple ? files : files[0], { shouldValidate: true });
      }
    },
    [name, multiple, setValue, onChange]
  );

  const removeFile = useCallback(
    (index: number) => {
      if (onChange) {
        // If using external onChange, we'll handle the file removal in the parent
        return;
      }
      
      if (multiple && Array.isArray(value)) {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        setValue(name, newFiles, { shouldValidate: true });
      } else {
        setValue(name, null, { shouldValidate: true });
      }
    },
    [name, value, multiple, setValue, onChange]
  );

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
              {options?.map((option) => (
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
            className={cn('min-h-[100px]', className)}
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
            min="1"
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            {...register(name, { valueAsNumber: true })}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            {...register(name)}
          />
        );
      case 'file':
        return (
          <div className="space-y-2 w-full">
            <div 
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer',
                'hover:bg-accent/50 transition-colors',
                className
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = Array.from(e.dataTransfer.files);
                setValue(name, multiple ? [...(value || []), ...files] : files[0], { 
                  shouldValidate: true 
                });
              }}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {placeholder || 'Drag and drop files here or click to browse'}
                </p>
                <Input
                  type="file"
                  className="hidden"
                  id={`file-upload-${name}`}
                  multiple={multiple}
                  accept={accept}
                  onChange={handleFileChange}
                />
                <Label 
                  htmlFor={`file-upload-${name}`}
                  className="text-sm font-medium text-primary cursor-pointer hover:underline"
                >
                  Browse files
                </Label>
              </div>
            </div>
            
            {value && (multiple ? value.length > 0 : true) && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium">Selected files:</h4>
                <div className="space-y-2">
                  {multiple ? (
                    (value as File[]).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile(index);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{(value as File).name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFile(0);
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
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

  const isCheckbox = type === 'checkbox';
  const isFile = type === 'file';

  return (
    <div className={cn('space-y-2', isCheckbox ? 'flex items-center space-x-2' : '')}>
      {!isCheckbox && (
        <Label htmlFor={name} className={cn(error && 'text-destructive', isFile ? 'block' : '')}>
          {label}
        </Label>
      )}
      <div className={cn(isCheckbox ? 'flex items-center space-x-2' : '')}>
        {renderInput()}
        {isCheckbox && (
          <Label htmlFor={name} className={cn(error && 'text-destructive', 'cursor-pointer')}>
            {label}
          </Label>
        )}
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive mt-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

export default FormField;
