import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { subjects } from "@/constants";
import { useClassesByTeacher, useClassMutations, useTeachers } from "@/hooks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { ClassEntity, GradeLevel } from "@/types";

interface EditClassModalProps {
  open: boolean;
  classData: ClassEntity;
  onOpenChange: (open: boolean) => void;
  grade: GradeLevel;
  adminId: string;
}

interface ClassFormData {
  subject: string;
  teacherId: string;
}

const EditClassModal = ({
  open,
  classData,
  onOpenChange,
  grade,
  adminId,
}: EditClassModalProps) => {
  const { teachers, isLoading: isLoadingTeachers } = useTeachers(adminId, true);
  const { updateClass, updateLoading } = useClassMutations();
  const { classes: teacherClasses } = useClassesByTeacher(
    classData.teacherId,
    true
  );

  const form = useForm<ClassFormData>({
    defaultValues: {
      subject: classData.subject,
      teacherId: classData.teacherId,
    },
  });

  const onSubmit = async (data: ClassFormData) => {

    const isUnchanged = 
    data.subject === classData.subject &&
    data.teacherId === classData.teacherId;

    if (isUnchanged) {
      onOpenChange(false);
      return;
    }
    // Check if the subject already exists for this teacher (excluding current class)
    const subjectExists = teacherClasses.some(
      (cls) =>
        cls.id !== classData.id && // Exclude current class from check
        cls.subject === data.subject.trim() &&
        cls.grade === grade &&
        cls.teacherId === data.teacherId
    );

    if (subjectExists) {
      toast.error(
        "This teacher already has a class for this subject and grade"
      );
      return;
    }

    updateClass(
      {
        id: classData.id,
        updates: {
          teacherId: data.teacherId,
          subject: data.subject.trim(),
          grade: grade,
        },
      },
      {
        onSuccess: () => {
          toast.success("Class updated successfully");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update class");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={updateLoading}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={updateLoading}
                  >
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
                disabled={updateLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassModal;
