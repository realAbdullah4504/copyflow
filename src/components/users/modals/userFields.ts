import { z } from "zod";
import type { User } from "@/types";

export const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  role: z.enum(["teacher", "secretary"], {
    required_error: "Please select a role",
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const defaultValues: Partial<UserFormValues> = {
  name: "",
  email: "",
  role: "teacher",
};

export const roleOptions = [
  { value: "teacher", label: "Teacher" },
  { value: "secretary", label: "Secretary" },
];

export const getUserFormFields = (user?: User) => ({
  name: {
    type: "text" as const,
    name: "name",
    label: "Full Name",
    placeholder: "John Doe",
    disabled: false,
    value: user?.name || "",
  },
  email: {
    type: "email" as const,
    name: "email",
    label: "Email",
    placeholder: "email@example.com",
    disabled: false,
    value: user?.email || "",
  },
  role: {
    type: "select" as const,
    name: "role",
    label: "Role",
    options: roleOptions,
    disabled: false,
    value: user?.role || "teacher",
  },
});
