import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useFormWithConfig,
  Form as RHFForm,
  FormField as SimpleFormField,
} from "../forms";
import { toast } from "sonner";
import type { FileType, PaperColor } from "@/types";
import { useSubmissionMutations } from "@/hooks/mutations";
import { grades, subjects, teachers } from "@/constants";
import {
  getSubmissionFields,
  submissionFormSchema,
  type SubmissionFormValues,
} from "../fields";

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
  allowTeacherSelection,
}: NewSubmissionModalProps) => {
  const { createSubmission, isLoading: isSubmitting } =
    useSubmissionMutations();
  const selectedTeacher =
    (!allowTeacherSelection && teachers?.find((t) => t.id === teacherId)) ||
    null;

  const form = useFormWithConfig<SubmissionFormValues>({
    subject: "",
    grade: "",
    fileType: "",
    files: "",
    notes: "",
    copies: "1",
    paperColor: "white",
    doubleSided: false,
    stapled: false,
    color: false,
    teacherId: teacherId || "",
    urgency: "medium",
  });

  const onSubmit = (values: z.infer<typeof submissionFormSchema>) => {
    createSubmission(
      {
        teacherId: values.teacherId,
        teacherName: selectedTeacher?.name || "",
        subject: values.subject,
        grade: values.grade,
        fileType: values.fileType as FileType,
        files: values.files.split(",").map((f) => f.trim()),
        notes: values.notes,
        copies: Number.parseInt(values.copies),
        paperColor: values.paperColor as PaperColor,
        printSettings: {
          doubleSided: values.doubleSided,
          stapled: values.stapled,
          color: values.color,
        },
        status: "pending",
        urgency: values.urgency,
      },
      {
        onSuccess: () => {
          toast.success("Submission created successfully!");
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };
  const formFields = getSubmissionFields({
    teachers: teachers || [],
    subjects: subjects || [],
    grades: grades || [],
    fileTypes: ["Worksheet", "Exam", "Handout", "Lesson Plan", "Other"],
    paperColors: ["White", "Blue", "Green", "Yellow", "Pink"],
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Submission</DialogTitle>
          <DialogDescription>
            Create a new print submission request
          </DialogDescription>
        </DialogHeader>

        <RHFForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitText="Create Submission"
        >
          {formFields.map((field) => (
            <SimpleFormField key={field.name} {...field} form={form} />
          ))}
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};

export default NewSubmissionModal;
