import { Form } from "@/components/common";
import FormField from "@/components/common/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userFormSchema,
  type UserFormValues,
  getUserFormFields,
} from "./userFields";
import type { User, UserRole } from "@/types";

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormValues) => void;
  isSubmitting: boolean;
  submitText?: string;
  disabled?: boolean;
}

const UserForm = ({
  user,
  onSubmit,
  isSubmitting,
  submitText = "Save",
  disabled = false,
}: UserFormProps) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      active: user ? user.active : true,
      role: (user?.role as Exclude<UserRole, "admin" | "principal">) || "teacher",
    },
  });

  const fields = getUserFormFields(user);

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText={submitText}
    >
      <FormField
        type={fields.name.type}
        name={fields.name.name}
        label={fields.name.label}
        placeholder={fields.name.placeholder}
        form={form}
        disabled={disabled}
      />
      <FormField
        type={fields.email.type}
        name={fields.email.name}
        label={fields.email.label}
        placeholder={fields.email.placeholder}
        form={form}
        disabled={disabled}
      />
      <FormField
        type={fields.role.type}
        name={fields.role.name}
        label={fields.role.label}
        options={fields.role.options}
        form={form}
        disabled={disabled}
      />
      <FormField
        type={fields.active.type}
        name={fields.active.name}
        label={fields.active.label}
        form={form}
        disabled={disabled}
      />
    </Form>
  );
};

export default UserForm;
