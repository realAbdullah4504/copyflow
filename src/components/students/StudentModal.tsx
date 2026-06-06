import type { Student } from "@/types";
import { ConfirmModal, Modal } from "@/components/common";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { grades, sections } from "@/constants/shared";

interface StudentModalProps {
  student: Student | null;
  type: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  isSubmitting: boolean;
  handlers: {
    onAddConfirm: (data: { firstName: string; lastName: string; grade: string; section: string }) => void;
    onEditConfirm: (data: { firstName: string; lastName: string; grade: string; section: string }) => void;
    onDeleteConfirm: () => void;
  };
}

const StudentModal = ({
  student,
  type,
  open,
  onOpenChange,
  onClose,
  isSubmitting,
  handlers,
}: StudentModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("9");
  const [section, setSection] = useState<string>("B");

  useEffect(() => {
    if (type === "editStudent" && student) {
      setFirstName(student.firstName);
      setLastName(student.lastName);
      setGrade(student.grade);
      setSection(student.section || "B");
    } else if (type === "newStudent") {
      setFirstName("");
      setLastName("");
      setGrade("9");
      setSection("B");
    }
  }, [type, student, open]);

  const handleSubmit = () => {
    const data = { firstName, lastName, grade, section };
    if (type === "newStudent") {
      handlers.onAddConfirm(data);
    } else if (type === "editStudent") {
      handlers.onEditConfirm(data);
    }
  };

  if (type === "deleteStudent") {
    return (
      <ConfirmModal
        open={open}
        onOpenChange={onOpenChange}
        title="Delete Student"
        description={`Are you sure you want to delete ${student?.firstName} ${student?.lastName}? This will also remove all their enrollments, attendance records, and marks.`}
        buttonTitle="Delete"
        onConfirm={handlers.onDeleteConfirm}
        onCancel={onClose}
        variant="destructive"
        isSubmitting={isSubmitting}
      />
    );
  }

  const isFormType = type === "newStudent" || type === "editStudent";
  if (!isFormType) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={type === "newStudent" ? "Add Student" : "Edit Student"}
      description={
        type === "newStudent"
          ? "Add a new student to the system"
          : "Update student information"
      }
      primaryAction={{
        label: type === "newStudent" ? "Add Student" : "Save Changes",
        onClick: handleSubmit,
        loading: isSubmitting,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
      }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((g) => (
                  <SelectItem key={g} value={g}>
                    Grade {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="section">Class</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StudentModal;
