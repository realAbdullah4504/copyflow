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
import {
  useTeachers,
  useClassesByTeacher,
  useAuth,
  useCreateNotification,
} from "@/hooks";
import type {
  CreateSubmissionInput,
  FileType,
  PaperColor,
  Submission,
  ClassesWithSchedules,
} from "@/types";
import type { WeekDay } from "@/constants/shared";
import { FormField, Form as RHFForm } from "@/components/common";
import { filterTypes, paperColors } from "@/constants";
import { getChangedFields, getFileDiff } from "@/utils";
import { generateSubmissionPDF } from "@/utils/generateSubmissionPDF";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
      lessonDate:
        submission?.lessonDate,
      copies: Number(submission?.copies) || null,
      paperColor: submission?.paperColor || "white",
      printSettings: {
        doubleSided: submission?.printSettings?.doubleSided || false,
        stapled: submission?.printSettings?.stapled || false,
        twoStaples: submission?.printSettings?.twoStaples || false,
        color: submission?.printSettings?.color || false,
        booklet: submission?.printSettings?.booklet || false,
        hasCover: submission?.printSettings?.hasCover || false,
        coloredCover: submission?.printSettings?.coloredCover || false,
        coloredAnswerSheet: submission?.printSettings?.coloredAnswerSheet || false,
      },
      files: submission?.files,
      notes: submission?.notes || "",
    },
    mode: "onChange",
  });
  const active = true;
  const { user } = useAuth();
  const adminId = user?.adminId;
  const role = user?.role;
  const { teachers } = useTeachers(adminId!, active);
  const { classes } = useClassesByTeacher(form.watch("teacherId"), active);
  const { createNotification } = useCreateNotification();

  const getLessonDateFilter = (selectedClass: ClassesWithSchedules | undefined) => {
    if (!selectedClass || !selectedClass.lessonDays?.length) {
      return (date: Date) => date >= new Date();
    }

    const dayMap: Record<WeekDay, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
    };

    const allowedDays = new Set(
      selectedClass.lessonDays
        .map((d) => dayMap[d])
        .filter((d): d is number => d !== undefined)
    );

    return (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const current = new Date(date);
      current.setHours(0, 0, 0, 0);

      if (current < today) return false;

      return allowedDays.size === 0 ? true : allowedDays.has(current.getDay());
    };
  };

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

    // Runtime safeguard: only allow PDF uploads for newly added files
    const hasNonPdfNewFile = newFiles.some((f) =>
      "file" in f ? !(f.file as File).name.toLowerCase().endsWith(".pdf") : false
    );

    if (hasNonPdfNewFile) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    // 2️⃣ Prepare update fields (specific to this form)
    const updates = {
      teacherId: values.teacherId,
      classId: values.classId,
      fileType: values.fileType as FileType,
      lessonDate: values.lessonDate,
      copies: values.copies || null,
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
    console.log(isFormChanged)
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

    const allFileNames = [...keptExisting, ...newFiles].map((f) => f.name);
    const pdfBlob = generateSubmissionPDF(values, allFileNames as unknown as File[], teachers, classes);
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
        onSuccess: (result) => {
          createNotification({
            senderId: user!.id,
            senderRole: role!,
            message: `${result.class?.label} ${result.fileType} updated`,
            type: "editSubmission",
            teacherId: values.teacherId,
          });
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  const selectedClassId = form.watch("classId");
  const selectedClass = (classes as ClassesWithSchedules[] | undefined)?.find(
    (cls) => cls.id === selectedClassId
  );

  const baseFormFields = getSubmissionFields({
    classes: classes,
    fileTypes: filterTypes,
    paperColors: paperColors,
    teachers: teachers || [],
    disabledFields: ["teacherId"],
  });

  const formFields = baseFormFields.map((field) =>
    field.name === "lessonDate"
      ? {
          ...field,
          filterDate: getLessonDateFilter(selectedClass),
        }
      : field
  );

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
