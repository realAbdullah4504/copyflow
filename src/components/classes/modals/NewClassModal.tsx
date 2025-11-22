import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassMutations } from "@/hooks/mutations";
import { subjects } from "@/constants";
import { useClassesByTeacher, useTeachers } from "@/hooks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { GradeLevel } from "@/types";

interface NewClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: GradeLevel;
  adminId: string;
}

interface ClassFormData {
  subject: string;
  teacherId: string;
}

const NewClassModal = ({
  open,
  onOpenChange,
  grade,
  adminId,
}: NewClassModalProps) => {
  const { teachers, isLoading: isLoadingTeachers } = useTeachers(adminId, true);
  const { createClass, createLoading } = useClassMutations();

  const form = useForm<ClassFormData>({
    defaultValues: {
      subject: "",
      teacherId: "",
    },
  });
  const { classes: teacherClasses } = useClassesByTeacher(
    form.watch("teacherId"),
    true // only active classes
  );

  const onSubmit = async (data: ClassFormData) => {
    if (!adminId) {
      toast.error("Admin ID is required");
      return;
    }

    const subjectExists = teacherClasses.some(
      (cls) =>
        cls.subject === data.subject.trim() &&
        cls.grade === grade &&
        cls.teacherId === data.teacherId
    );

    if (subjectExists) {
      toast.error("Subject already exists for this teacher");
      return;
    }
    createClass(
      {
        teacherId: data.teacherId,
        subject: data.subject.trim(),
        grade: grade,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="teacherId"
              rules={{ required: "Teacher is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingTeachers ? (
                        <div className="flex justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        teachers?.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createLoading}>
                {createLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Class
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClassModal;
