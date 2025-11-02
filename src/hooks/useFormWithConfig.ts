import { useForm, type DefaultValues } from "react-hook-form";

export function useFormWithConfig<T extends Record<string, unknown>>(defaultValues: DefaultValues<T>) {
  return useForm<T>({
    defaultValues,
    mode: 'onChange',
  });
}
