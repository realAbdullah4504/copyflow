import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/types";
import { useState, useEffect } from "react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSubmit: (userData: Omit<User, "id">, userId?: string) => void;
  isSubmitting: boolean;
}

const UserModal = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isSubmitting,
}: UserModalProps) => {
  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "teacher",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "teacher",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, user?.id);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) => handleChange("role", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="secretary">Secretary</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="principal">Principal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
