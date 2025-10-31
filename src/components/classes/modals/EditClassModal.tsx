import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClassMutations } from "@/hooks/mutations";
import { toast } from "sonner";
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

const EditClassModal = ({ open, classData, onOpenChange }: EditClassModalProps) => {
  const { updateClass } = useClassMutations();
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<ClassFormData>({
    defaultValues: {
      subject: classData.subject,
      grade: classData.grade,
      active: classData.active,
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    try {
      await updateClass.mutateAsync({
        id: classData.id,
        updates: {
          subject: data.subject.trim(),
          grade: data.grade.trim(),
          active: data.active,
        },
      });
      
      toast.success("Class updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update class");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject name"
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              placeholder="e.g., 9A, 10B"
              {...register("grade", { required: "Grade is required" })}
            />
            {errors.grade && (
              <p className="text-sm text-red-500">{errors.grade.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="active" {...register("active")} />
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassModal;
