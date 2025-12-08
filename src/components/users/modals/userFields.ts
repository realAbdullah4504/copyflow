import { z } from "zod";
import type { User } from "@/types";

const userRole = z.enum(["teacher", "secretary", "principal"]);

// In userFields.ts, update the schema to:
export const userFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    role: userRole,
    active: z.boolean().default(true),
  })
  .required({
    name: true,
    email: true,
    role: true,
    active: true,
  });

export type UserFormValues = z.infer<typeof userFormSchema>;

export const defaultValues: Partial<UserFormValues> = {
  name: "",
  email: "",
  role: "teacher",
  active: true,
};

export const roleOptions = [
  { value: "teacher", label: "Teacher" },
  { value: "secretary", label: "Secretary" },
  { value: "principal", label: "Principal" },
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
  active: {
    type: "switch" as const,
    name: "active",
    label: "Active",
    description: "Enable or disable user access",
    disabled: false,
    value: user?.active ?? true,
    className:
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  },
});
