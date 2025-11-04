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
  const { updateSubmissionWithFiles, updateWithFilesLoading: isSubmitting } =
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
    files: submission?.files,
    notes: submission?.notes || "",
  });

  const active = true;
  const { teachers } = useTeachers();
  const { classes } = useClassesByTeacher(form.watch("teacherId"), active);

  const onSubmit = async (values: z.infer<typeof submissionFormSchema>) => {
    if (!submission) throw new Error("Submission not found");

    const currentFiles = values.files;
    // const originalFiles = submission.files?.map((name) => ({
    //   existing: true as const,
    //   name,
    // }));

    // New files (File objects)
    const newFiles = values.files
      .filter((f): f is { existing: false; file: File } => !f.existing)
      .map((f) => f.file);

    // Remaining existing files (user kept these)
    // const keptExisting = currentFiles.filter(
    //   (f): f is { existing: true; name: string } => "existing" in f
    // );

    // // Deleted files (exist in original but not in current)
    // const deletedFiles = originalFiles.filter(
    //   (orig) => !keptExisting.some((curr) => curr.path === orig.path)
    // );

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

    updateSubmissionWithFiles(
      {
        id: submission.id,
        submission: updates,
        newFiles,
        deletedPaths: [],
      },
      {
        onSuccess: () => {
          form.reset();
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
