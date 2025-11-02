import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/common";
import FormField from "@/components/common/FormField";
import type { User } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

const userFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  role: z.enum(["teacher", "secretary", "admin", "principal"], {
    required_error: "Please select a role",
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSubmit: (userData: Omit<User, "id">, userId?: string) => void;
  isSubmitting: boolean;
}

const defaultValues: Partial<UserFormValues> = {
  name: "",
  email: "",
  role: "teacher",
};

const roleOptions = [
  { value: "teacher", label: "Teacher" },
  { value: "secretary", label: "Secretary" },
  { value: "admin", label: "Admin" },
  { value: "principal", label: "Principal" },
];

const UserModal = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isSubmitting,
}: UserModalProps) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [user, form]);

  const handleFormSubmit = (data: UserFormValues) => {
    onSubmit(data, user?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitText={isSubmitting ? "Saving..." : "Save"}
        >
          <FormField
            type="text"
            name="name"
            label="Full Name"
            placeholder="John Doe"
            form={form}
          />
          <FormField
            type="text"
            name="email"
            label="Email"
            placeholder="email@example.com"
            form={form}
          />
          <FormField
            type="select"
            name="role"
            label="Role"
            options={roleOptions}
            form={form}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
