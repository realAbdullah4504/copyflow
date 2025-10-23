import type { AuthFieldsConfig } from "@/types/forms";

export const AUTH_FIELDS: AuthFieldsConfig = {
  LOGIN: {
    fields: [
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        validation: {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        },
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        validation: {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        },
      },
    ],
    submitButtonText: "Sign In",
  },

  SIGNUP: {
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
        validation: { required: "Name is required" },
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        validation: {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        },
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        validation: {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        },
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "••••••••",
        validation: {
          required: "Please confirm your password",
        },
      },
    ],
    submitButtonText: "Create Account",
  },

  LOGIN_BUTTON_TEXT: "Sign In",
  SIGNUP_BUTTON_TEXT: "Create Account",
};
