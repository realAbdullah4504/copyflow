import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateSubmission } from "@/hooks/useSubmissions";
import { toast } from "sonner";
import type { FileType, PaperColor } from "@/types";
import { Modal } from "../common";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  grade: z.string().min(1, "Grade is required"),
  fileType: z.string().min(1, "File type is required"),
  files: z.string().min(1, "At least one file is required"),
  notes: z.string(),
  copies: z.string().min(1, "Number of copies is required"),
  paperColor: z.string().min(1, "Paper color is required"),
  doubleSided: z.boolean(),
  stapled: z.boolean(),
  color: z.boolean(),
  urgency: z.enum(["low", "medium", "high"]),
});

export type NewSubmissionFormValues = z.infer<typeof formSchema>;

interface NewSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  teacherName: string;
}

const NewSubmissionModal = ({
  open,
  onOpenChange,
  teacherId,
  teacherName,
}: NewSubmissionModalProps) => {
  const createSubmission = useCreateSubmission();

  const form = useForm<NewSubmissionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      grade: "",
      fileType: "",
      files: "",
      notes: "",
      copies: "30",
      paperColor: "white",
      doubleSided: false,
      stapled: false,
      color: false,
      urgency: "medium",
    },
  });

  const onSubmit = (values: NewSubmissionFormValues) => {
    createSubmission.mutate(
      {
        teacherId,
        teacherName,
        subject: values.subject,
        grade: values.grade,
        fileType: values.fileType as FileType,
        files: values.files.split(",").map((f) => f.trim()),
        notes: values.notes,
        copies: parseInt(values.copies),
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
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="New Submission"
      description="Create a new print submission request"
      primaryAction={{
        label: "Submit",
        onClick: onSubmit,
        loading: createSubmission.isPending,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fileType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="worksheet">Worksheet</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="handout">Handout</SelectItem>
                      <SelectItem value="lesson_plan">Lesson Plan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Names</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., worksheet.pdf, answer_key.pdf"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special instructions..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="copies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Copies</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paperColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <FormLabel>Print Settings</FormLabel>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="doubleSided"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Double-sided printing
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stapled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Stapled</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Color printing
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default NewSubmissionModal;
