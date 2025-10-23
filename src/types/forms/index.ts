import type { FieldValues, Path, RegisterOptions } from "react-hook-form";

export interface AuthFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  placeholder?: string;
  validation?: RegisterOptions<T, Path<T>>;
  disabled?: boolean;
}

export type AuthFormConfig<T extends FieldValues> = {
  fields: AuthFieldConfig<T>[];
  submitButtonText: string;
  footer?: React.ReactNode;
};

// Define separate types for login and signup forms
export type LoginFormFields = {
  email: string;
  password: string;
};

export type SignupFormFields = LoginFormFields & {
  name: string;
  confirmPassword: string;
};

// Create a type for the fields configuration
export type AuthFieldsConfig = {
  LOGIN: {
    fields: AuthFieldConfig<LoginFormFields>[];
    submitButtonText: string;
  };
  SIGNUP: {
    fields: AuthFieldConfig<SignupFormFields>[];
    submitButtonText: string;
  };
  LOGIN_BUTTON_TEXT: string;
  SIGNUP_BUTTON_TEXT: string;
};
