import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  ClassesWithSchedules,
} from "@/types";
import type { WeekDay } from "@/constants/shared";
import { FormField, Form as RHFForm } from "@/components/common";
import { filterTypes, paperColors } from "@/constants";
import { generateSubmissionPDF } from "@/utils/generateSubmissionPDF";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface NewSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId?: string;
  allowTeacherSelection?: boolean;
}

const NewSubmissionModal = ({
  open,
  onOpenChange,
  teacherId,
  allowTeacherSelection = false,
}: NewSubmissionModalProps) => {
  const { createSubmissionWithFiles, createWithFilesLoading: isSubmitting } =
    useSubmissionMutations();

  const { user } = useAuth();
  const adminId = user?.adminId;
  const role = user?.role;
  const active = true;
  const { teachers } = useTeachers(adminId!, active);
  const { createNotification } = useCreateNotification();

  const form = useForm<z.infer<typeof submissionFormSchema>>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      teacherId: teacherId || "",
      classId: "",
      fileType: "",
      lessonDate: "",
      copies: null,
      paperColor: "",
      printSettings: {
        doubleSided: false,
        stapled: false,
        twoStaples: false,
        color: false,
        booklet: false,
        hasCover: false,
        coloredCover: false,
        coloredAnswerSheet: false,
      },
      files: [],
      notes: "",
    },
    mode: "onChange",
  });

  const selectedTeacherId = form.watch("teacherId");
  const { classes } = useClassesByTeacher(selectedTeacherId, active);

  const getLessonDateFilter = (
    selectedClass: ClassesWithSchedules | undefined
  ) => {
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
    const result = submissionFormSchema.safeParse(values);
    if (!result.success) {
      console.error("Validation failed:", result.error);
      return;
    }

    // Extract new files
    const newFiles = values.files
      .filter((f): f is { existing: false; file: File } => !f.existing)
      .map((f) => f.file);

    // Runtime safeguard: only allow PDF uploads
    const hasNonPdf = newFiles.some(
      (f) => !f.name.toLowerCase().endsWith(".pdf")
    );
    if (hasNonPdf) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    const submission: CreateSubmissionInput = {
      teacherId: values.teacherId,
      classId: values.classId,
      fileType: values.fileType as FileType,
      lessonDate: values.lessonDate,
      copies: values.copies || null,
      paperColor: values.paperColor as PaperColor,
      printSettings: values.printSettings,
      notes: values.notes ?? "",
    };

    // Generate submission details PDF
    const allFileNames = newFiles.map((f) => f.name);
    const pdfBlob = generateSubmissionPDF(
      values,
      allFileNames as unknown as File[],
      teachers,
      classes
    );
    const pdfFile = new File(
      [pdfBlob],
      `submission-details-${Date.now()}.pdf`,
      { type: "application/pdf" }
    );
    const totalFiles = [pdfFile, ...newFiles];

    createSubmissionWithFiles(
      { submission, files: totalFiles },
      {
        onSuccess: () => {
          createNotification({
            senderId: user!.id,
            senderRole: role!,
            message: `New submission created by ${user?.name}`,
            type: "newSubmission",
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
    disabledFields: allowTeacherSelection ? [] : ["teacherId"],
  });

  const formFields = baseFormFields.map((field) =>
    field.name === "lessonDate"
      ? { ...field, filterDate: getLessonDateFilter(selectedClass) }
      : field
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Submission</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new print request
          </DialogDescription>
        </DialogHeader>
        <RHFForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitText="Create Print Request"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div
                key={field.name}
                className={field.className || "md:col-span-2"}
              >
                <FormField {...field} form={form} />
              </div>
            ))}
          </div>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};

export default NewSubmissionModal;
