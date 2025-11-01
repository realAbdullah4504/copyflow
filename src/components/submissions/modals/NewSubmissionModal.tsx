import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useSubmissionMutations } from "@/hooks/mutations";
import { grades, teachers } from "@/constants";
import {
  getSubmissionFields,
  submissionFormSchema,
} from "../fields";
import { format } from "date-fns";

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
  const [files, setFiles] = useState<File[]>([]);

  const teacher = teachers?.find((t) => t.id === teacherId);

  const form = useFormWithConfig<z.infer<typeof submissionFormSchema>>({
    teacherId:teacherId || "",
    class: "",
    fileType: "",
    lessonDate: format(new Date(), "yyyy-MM-dd"),
    copies: 1,
    paperColor: "white",
    printSettings: {
      doubleSided: false,
      stapled: false,
      color: false,
      booklet: false,
      hasCover: false,
      coloredCover: false,
    },
    files: [],
  });

  const onSubmit = async (values: z.infer<typeof submissionFormSchema>) => {
    const submissionData = {
      ...values,
      teacherId: values.teacherId,
      subject: values.fileType, // Using fileType as subject for now
      grade: values.class, // Using class as grade for now
      notes: "", // Empty notes since it's required but not in our form
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      })),
      status: "pending" as const,
    };

    createSubmission(submissionData, {
      onSuccess: () => {
        toast.success("Print request submitted successfully!");
        form.reset();
        setFiles([]);
        onOpenChange(false);
      },
    });
  };

  const formFields = getSubmissionFields({
    classes: grades,
    fileTypes: ["Worksheet", "Exam", "Handout", "Lesson Plan", "Other"],
    paperColors: ["White", "Blue", "Green", "Yellow", "Pink"],
    teachers: teachers || [],
    disabledFields: !allowTeacherSelection && teacherId ? ["teacherId"] : [],
  });
  
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
          submitText="Submit Print Request"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map((field) => {
              // Handle file uploads separately to manage the files state
              if (field.type === "file") {
                return (
                  <div
                    key={field.name}
                    className={field.className || "md:col-span-2"}
                  >
                    <SimpleFormField
                      {...field}
                      form={form}
                      value={files}
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);
                        setFiles((prev) => [...prev, ...newFiles]);
                        form.setValue("files", [...files, ...newFiles]);
                      }}
                    />
                  </div>
                );
              }
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

export default NewSubmissionModal;
