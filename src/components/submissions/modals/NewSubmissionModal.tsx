import * as z from "zod";
import { useState } from "react";
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
  type SubmissionFormValues,
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
  const { createSubmission, isLoading: isSubmitting } = useSubmissionMutations();
  const [files, setFiles] = useState<File[]>([]);
  
  const selectedTeacher = (!allowTeacherSelection && teachers?.find((t) => t.id === teacherId)) || null;

  const form = useFormWithConfig<z.infer<typeof submissionFormSchema>>({
    class: "",
    fileType: "",
    lessonDate: format(new Date(), 'yyyy-MM-dd'),
    copies: 1,
    paperColor: "white",
    printSettings: {
      doubleSided: false,
      stapled: false,
      color: false,
      orientation: "portrait",
      pagesPerSheet: "1",
    },
    files: []
  });

  const onSubmit = async (values: z.infer<typeof submissionFormSchema>) => {
    try {
      console.log(values,"values");
      // Handle file uploads here if needed
      const submissionData = {
        ...values,
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        })),
      };

      createSubmission(
        {
          ...submissionData,
          status: "pending",
        },
        {
          onSuccess: () => {
            toast.success("Print request submitted successfully!");
            form.reset();
            setFiles([]);
            onOpenChange(false);
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit print request. Please try again.");
    }
  };

  const formFields = getSubmissionFields({
    classes: grades,
    fileTypes: ["Worksheet", "Exam", "Handout", "Lesson Plan", "Other"],
    paperColors: ["White", "Blue", "Green", "Yellow", "Pink"],
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
              if (field.type === 'file') {
                return (
                  <div key={field.name} className={field.className || 'md:col-span-2'}>
                    <SimpleFormField 
                      {...field} 
                      form={form} 
                      value={files}
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);
                        setFiles(prev => [...prev, ...newFiles]);
                        form.setValue('files', [...files, ...newFiles]);
                      }}
                    />
                  </div>
                );
              }
              return (
                <div key={field.name} className={field.className || 'md:col-span-2'}>
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
