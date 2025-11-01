import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useAuth } from "@/hooks/useAuth";
import { useClassMutations } from "@/hooks/mutations";
import { toast } from "sonner";
import { subjects, grades } from "@/constants";

interface NewClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ClassFormData {
  subject: string;
  grade: string;
  active: boolean;
}

const NewClassModal = ({ open, onOpenChange }: NewClassModalProps) => {
  const { user } = useAuth();
  const { createClass } = useClassMutations();

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    defaultValues: {
      subject: "",
      grade: "",
      active: true,
    },
  });

  const onSubmit = (data: ClassFormData) => {
    if (!user?.id) return;
    createClass(
      {
        teacherId: user.id,
        subject: data.subject.trim(),
        grade: data.grade.trim(),
        active: data.active,
      },
      {
        onSuccess: () => {
          toast.success("Class created successfully");
          onOpenChange(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Controller
              name="subject"
              control={control}
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Controller
              name="grade"
              control={control}
              rules={{ required: "Grade is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.grade && (
              <p className="text-sm text-red-500">{errors.grade.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="active" defaultChecked {...register("active")} />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClassModal;
