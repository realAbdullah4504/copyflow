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
import { subjects, grades } from "@/constants";
import { useClassMutations } from "@/hooks/mutations";
import type { ClassEntity } from "@/types";

interface EditClassModalProps {
  open: boolean;
  classData: ClassEntity;
  onOpenChange: (open: boolean) => void;
}

interface ClassFormData {
  subject: string;
  grade: string;
  active: boolean;
}

const EditClassModal = ({
  open,
  classData,
  onOpenChange,
}: EditClassModalProps) => {
  const { updateClass } = useClassMutations();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    defaultValues: {
      subject: classData.subject,
      grade: classData.grade,
      active: classData.active,
    },
  });

  const onSubmit = (data: ClassFormData) => {
    updateClass(
      {
        id: classData.id,
        updates: {
          subject: data.subject.trim(),
          grade: data.grade.trim(),
          active: data.active,
        },
      },
      {
        onSuccess: () => {
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
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Subject */}
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

          {/* Grade */}
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

          {/* Active Switch */}
          <div className="flex items-center space-x-2">
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <>
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="active">Active</Label>
                </>
              )}
            />
          </div>

          {/* Actions */}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassModal;
