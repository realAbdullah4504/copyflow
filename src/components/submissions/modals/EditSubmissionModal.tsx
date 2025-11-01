import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useSubmissionMutations } from "@/hooks/mutations";
import { getSubmissionFields, type submissionFormSchema } from "../fields";
import {
  useFormWithConfig,
  Form as RHFForm,
  FormField as SimpleFormField,
} from "../forms";
import type { Submission } from "@/types";
import { grades, teachers } from "@/constants";
import { format } from "date-fns";

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
  onSuccess,
}: EditSubmissionModalProps) => {
  const { updateSubmission, updateLoading: isSubmitting } =
    useSubmissionMutations();

  console.log("submission", submission);
  const form = useFormWithConfig<z.infer<typeof submissionFormSchema>>({
    teacherId: submission?.teacherId,
    class: submission?.class,
    fileType: submission?.fileType,
    lessonDate: format(new Date(), "yyyy-MM-dd"),
    copies: Number(submission?.copies),
    paperColor: submission?.paperColor || "white",
    printSettings: {
      doubleSided: submission?.printSettings?.doubleSided || false,
      stapled: submission?.printSettings?.stapled || false,
      color: submission?.printSettings?.color || false,
      booklet: submission?.printSettings?.booklet || false,
      hasCover: submission?.printSettings?.hasCover || false,
      coloredCover: submission?.printSettings?.coloredCover || false,
    },
    notes: submission?.notes || "",
  });

  const onSubmit = async (values: z.infer<typeof submissionFormSchema>) => {
    const updates: Partial<Submission> = {
      teacherId: values.teacherId,
      grade: values.class,
      fileType: values.fileType as Submission["fileType"],
      lessonDate: values.lessonDate,
      copies: values.copies,
      paperColor: values.paperColor as Submission["paperColor"],
      printSettings: values.printSettings,
      notes: values.notes ?? "",
      updatedAt: new Date(),
    };

    updateSubmission(
      {
        id: submission.id,
        updates,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const formFields = getSubmissionFields({
    classes: grades,
    fileTypes: ["Worksheet", "Exam", "Handout", "Lesson Plan", "Other"],
    paperColors: ["White", "Blue", "Green", "Yellow", "Pink"],
    teachers: teachers || [],
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Submission</DialogTitle>
          <DialogDescription>
            Fill in the details below to update the print request
          </DialogDescription>
        </DialogHeader>
        <RHFForm
          key={submission?.id || "new"}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitText="Update Print Request"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map((field) => {
              return (
                <div
                  key={field.name}
                  className={field.className || "md:col-span-2"}
                >
                  <SimpleFormField {...field} form={form} />
                </div>
              );
            })}
          </div>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubmissionModal;
