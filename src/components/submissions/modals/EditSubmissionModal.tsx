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
import { useFormWithConfig, useTeachers, useClassesByTeacher } from "@/hooks";
import type { Submission } from "@/types";
import { format } from "date-fns";
import { FormField, Form as RHFForm } from "@/components/common";
import { filterTypes, paperColors } from "@/constants";

interface EditSubmissionModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly submission: Submission | null;
}

const EditSubmissionModal = ({
  open,
  onOpenChange,
  submission,
}: EditSubmissionModalProps) => {
  const { updateSubmission, updateLoading: isSubmitting } =
    useSubmissionMutations();

  const form = useFormWithConfig<z.infer<typeof submissionFormSchema>>({
    teacherId: submission?.teacherId,
    classId: submission?.classId,
    fileType: submission?.fileType,
    lessonDate: format(submission?.lessonDate || new Date(), "yyyy-MM-dd"),
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

  const active = true;
  const { teachers } = useTeachers();
  const { classes } = useClassesByTeacher(form.watch("teacherId"), active);

  const onSubmit = async (values: z.infer<typeof submissionFormSchema>) => {
    if (!submission) {
      throw new Error("Submission not found");
    }
    const updates: Partial<Submission> = {
      teacherId: values.teacherId,
      classId: values.classId,
      fileType: values.fileType as Submission["fileType"],
      lessonDate: new Date(values.lessonDate),
      copies: values.copies,
      paperColor: values.paperColor as Submission["paperColor"],
      printSettings: values.printSettings,
      notes: values.notes ?? "",
    };

    updateSubmission(
      {
        id: submission.id,
        updates,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const formFields = getSubmissionFields({
    classes: classes,
    fileTypes: filterTypes,
    paperColors: paperColors,
    teachers: teachers || [],
    disabledFields: ["teacherId"],
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
                  <FormField {...field} form={form} />
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
