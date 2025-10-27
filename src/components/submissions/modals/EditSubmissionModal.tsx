import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { PaperColor, Submission } from "@/types";
import { useUpdateSubmission } from "@/hooks/useSubmissions";
import { toast } from "sonner";

type FormValues = {
  subject: string;
  grade: string;
  notes: string;
  copies: number;
  paperColor: PaperColor;
  printSettings: {
    doubleSided: boolean;
    stapled: boolean;
    color: boolean;
  };
  urgency: 'low' | 'medium' | 'high';
};

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  grade: z.string().min(1, "Grade is required"),
  notes: z.string(),
  copies: z.coerce.number().min(1, "At least 1 copy is required"),
  paperColor: z.enum(["white", "yellow", "blue", "green", "pink"]),
  printSettings: z.object({
    doubleSided: z.boolean(),
    stapled: z.boolean(),
    color: z.boolean(),
  }),
  urgency: z.enum(["low", "medium", "high"]),
});

interface EditSubmissionModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly submission: Submission | null;
  readonly onSuccess?: () => void;
}

const EditSubmissionModal = ({ 
  open, 
  onOpenChange, 
  submission,
  onSuccess 
}: EditSubmissionModalProps) => {
  const updateSubmission = useUpdateSubmission();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      subject: submission?.subject || "",
      grade: submission?.grade || "",
      notes: submission?.notes || "",
      copies: submission?.copies || 1,
      paperColor: submission?.paperColor || "white",
      printSettings: {
        doubleSided: submission?.printSettings.doubleSided || false,
        stapled: submission?.printSettings.stapled || false,
        color: submission?.printSettings.color || false,
      },
      urgency: submission?.urgency || "medium",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!submission) return;
    
    try {
      await updateSubmission.mutateAsync({
        id: submission.id,
        updates: {
          ...values,
          updatedAt: new Date(),
        },
      });
      
      toast.success("Submission updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Failed to update submission");
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Submission</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                {...form.register("subject")}
                placeholder="Enter subject"
              />
              {form.formState.errors.subject && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                {...form.register("grade")}
                placeholder="Enter grade"
              />
              {form.formState.errors.grade && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.grade.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="copies">Copies</Label>
              <Input
                id="copies"
                type="number"
                min={1}
                {...form.register("copies", { valueAsNumber: true })}
              />
              {form.formState.errors.copies && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.copies.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paperColor">Paper Color</Label>
              <Select
                onValueChange={(value: PaperColor) =>
                  form.setValue("paperColor", value)
                }
                value={form.watch("paperColor")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select paper color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  form.setValue("urgency", value)
                }
                value={form.watch("urgency")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="doubleSided"
                  checked={form.watch("printSettings.doubleSided")}
                  onCheckedChange={(checked) =>
                    form.setValue("printSettings.doubleSided", Boolean(checked))
                  }
                />
                <Label htmlFor="doubleSided">Double Sided</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stapled"
                  checked={form.watch("printSettings.stapled")}
                  onCheckedChange={(checked) =>
                    form.setValue("printSettings.stapled", Boolean(checked))
                  }
                />
                <Label htmlFor="stapled">Stapled</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="color"
                  checked={form.watch("printSettings.color")}
                  onCheckedChange={(checked) =>
                    form.setValue("printSettings.color", Boolean(checked))
                  }
                />
                <Label htmlFor="color">Color Print</Label>
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                placeholder="Any additional notes or instructions"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateSubmission.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateSubmission.isPending}>
              {updateSubmission.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSubmissionModal;