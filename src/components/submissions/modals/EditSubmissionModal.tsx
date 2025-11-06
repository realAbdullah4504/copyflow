import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useSubmissionMutations } from "@/hooks/mutations";
import { getSubmissionFields, submissionFormSchema } from "../fields";
import { useTeachers, useClassesByTeacher } from "@/hooks";
import type {
  CreateSubmissionInput,
  FileType,
  PaperColor,
  Submission,
} from "@/types";
import { format } from "date-fns";
import { FormField, Form as RHFForm } from "@/components/common";
import { filterTypes, paperColors } from "@/constants";
import { getChangedFields, getFileDiff } from "@/utils";
import { generateSubmissionPDF } from "@/utils/generateSubmissionPDF";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

  const form = useForm<z.infer<typeof submissionFormSchema>>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
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
    },
    mode: "onChange",
  });
  const active = true;
  const { teachers } = useTeachers();
  const { classes } = useClassesByTeacher(form.watch("teacherId"), active);

  const onSubmit = async (values: z.infer<typeof submissionFormSchema>) => {
    if (!submission) throw new Error("Submission not found");

    // Validate against the schema first
    const result = submissionFormSchema.safeParse(values);
    if (!result.success) {
      console.error("Validation failed:", result.error);
      return;
    }
    // 1️⃣ Extract original and current files
    const originalFiles = submission.files?.filter((f) => "name" in f) ?? [];
    const { newFiles, deletedFiles, keptExisting } = getFileDiff(
      values.files,
      originalFiles
    );

    // 2️⃣ Prepare update fields (specific to this form)
    const updates = {
      teacherId: values.teacherId,
      classId: values.classId,
      fileType: values.fileType as FileType,
      lessonDate: new Date(values.lessonDate),
      copies: values.copies,
      paperColor: values.paperColor as PaperColor,
      printSettings: values.printSettings,
      notes: values.notes ?? "",
    };

    // 3️⃣ Check changes
    const isFormChanged = getChangedFields(
      updates,
      submission,
      Object.keys(updates) as (keyof CreateSubmissionInput)[]
    );
    const isFileChanged = newFiles.length > 0 || deletedFiles.length > 0;

    if (!isFormChanged && !isFileChanged) {
      onOpenChange(false);
      return;
    }

    // 1️⃣ Detect previous submission-details PDF
    const previousPDFs =
      submission.files?.filter(
        (f): f is { existing: true; name: string } =>
          "name" in f && f.name.startsWith("submission-details")
      ) ?? [];

    // 2️⃣ Combine deleted files and old submission-details PDFs
    const filesToDelete = [
      ...deletedFiles.map((f) => f.name), // files explicitly deleted by user
      ...previousPDFs.map((f) => f.name), // old generated PDFs
    ];

    const allFiles = [...keptExisting, ...newFiles].map((f) => f.name);
    const pdfBlob = generateSubmissionPDF(values, allFiles, teachers, classes);
    const pdfFile = new File(
      [pdfBlob],
      `submission-details-${Date.now()}.pdf`,
      { type: "application/pdf" }
    );
    const totalFiles = [pdfFile, ...newFiles];

    // 4️⃣ Update
    updateSubmissionWithFiles(
      {
        id: submission.id,
        submission: updates,
        newFiles: totalFiles,
        deletedPaths: filesToDelete,
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
