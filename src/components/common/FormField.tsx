import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useCallback, useState, useRef, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Upload, FileText, X, UploadCloud } from "lucide-react";
import { Switch } from "../ui/switch";
import { motion, AnimatePresence } from "framer-motion";

type FormFieldProps = {
  type: 'text' | 'select' | 'switch' | 'textarea' | 'number' | 'checkbox' | 'date' | 'file';
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

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (onChange) {
        onChange({ target: { files: e.dataTransfer.files } } as any);
      } else {
        setValue(name, multiple ? files : files[0], { shouldValidate: true });
      }
      e.dataTransfer.clearData();
    }
  }, [name, multiple, setValue, onChange]);

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

  // Close the drag overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropZoneRef.current && !dropZoneRef.current.contains(e.target as Node)) {
        setIsDragging(false);
      }
    };

    document.addEventListener('mousemove', handleClickOutside);
    return () => {
      document.removeEventListener('mousemove', handleClickOutside);
    };
  }, []);

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
      case 'switch':
        return (
          <Switch
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
          <div className="space-y-2">
            <div 
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative"
            >
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-primary/10 backdrop-blur-sm rounded-lg border-2 border-dashed border-primary"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      className="flex flex-col items-center"
                    >
                      <UploadCloud className="w-12 h-12 mb-3 text-primary" />
                      <p className="text-lg font-medium text-primary">Drop files here</p>
                      <p className="text-sm text-muted-foreground">
                        Upload your files
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <label
                htmlFor={name}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50 transition-colors',
                  error ? 'border-destructive' : 'border-border',
                  isDragging && 'border-primary bg-primary/5',
                  className
                )}
              >
                <div className="flex flex-col items-center justify-center p-5 text-center">
                  <Upload className={cn(
                    'w-8 h-8 mb-2',
                    isDragging ? 'text-primary' : 'text-muted-foreground'
                  )} />
                  <p className={cn(
                    'mb-1 text-sm',
                    isDragging ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {accept ? accept.replace(/,/g, ', ') : 'Any file type'}
                  </p>
                </div>
                <input
                  id={name}
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple={multiple}
                  accept={accept}
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {value && (
              <div className="mt-2 space-y-2">
                {Array.isArray(value) ? (
                  value.map((file: File, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-2 text-sm bg-muted rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  value && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-2 text-sm bg-muted rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate max-w-xs">
                          {value.name || 'Selected file'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(0)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )
                )}
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
