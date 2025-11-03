import * as z from "zod";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form as RHFForm, FormField } from "@/components/common";
import { toast } from "sonner";
import { useSubmissionMutations } from "@/hooks/mutations";
import { getSubmissionFields, submissionFormSchema } from "../fields";
import { format } from "date-fns";
import { useClassesByTeacher } from "@/hooks/queries";
import { useFormWithConfig } from "@/hooks";
import { useTeachers } from "@/hooks/queries/useTeachers";
import type { FileType, PaperColor } from "@/types/domain/submission";
import { filterTypes, paperColors } from "@/constants";

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

  const form = useFormWithConfig<z.infer<typeof submissionFormSchema>>({
    teacherId: teacherId || "",
    classId: "",
    fileType: "",
    lessonDate: format(new Date(), "yyyy-MM-dd"),
    copies: 1,
    paperColor: "white",
    notes: "",
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
  const activeClasses = true;
  const activeTeachers = true;
  const { classes } = useClassesByTeacher(
    teacherId || form.watch("teacherId"),
    activeClasses
  );
  const { teachers } = useTeachers(activeTeachers);

  const fileTypeMap: Record<string, FileType> = {
    worksheet: "worksheet",
    exam: "exam",
    handout: "handout",
    lesson_plan: "worksheet", // Map to closest match
    other: "handout", // Map to closest match
  };

  // Map form paper color values to PaperColor type
  const paperColorMap: Record<string, PaperColor> = {
    White: "white",
    Yellow: "yellow",
    Blue: "blue",
    Green: "green",
    Pink: "pink",
  };

  const onSubmit = async (values: z.infer<typeof submissionFormSchema>) => {
    // Convert form values to correct types
    const fileType = fileTypeMap[values.fileType] || "handout";
    const paperColor = paperColorMap[values.paperColor] || "white";
    const lessonDate = new Date(values.lessonDate);

    // Convert files to an array of file names (strings) as expected by the Submission type
    const fileNames = files.map((file) => file.name);

    const submissionData = {
      classId: values.classId,
      teacherId: values.teacherId,
      fileType,
      paperColor,
      lessonDate,
      notes: values.notes,
      copies: values.copies,
      printSettings: values.printSettings,
      // files: fileNames, // Now this matches the string[] type
    };

    createSubmission(submissionData, {
      onSuccess: () => {
        form.reset();
        setFiles([]);
        onOpenChange(false);
      },
    });
  };

  const formFields = getSubmissionFields({
    classes: classes || [],
    fileTypes: filterTypes,
    paperColors: paperColors,
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
                    <FormField
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

export default NewSubmissionModal;
