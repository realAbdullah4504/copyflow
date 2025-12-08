import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { subjects, lessonDays } from "@/constants/shared";
import { useClassesByTeacher, useClassMutations, useTeachers } from "@/hooks";
import { toast } from "sonner";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClassEntity, GradeLevel } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditClassModalProps {
  open: boolean;
  classData: ClassEntity;
  onOpenChange: (open: boolean) => void;
  grade: GradeLevel;
  adminId: string;
}

interface ClassFormData {
  subject: string;
  teacherId: string;
  lessonDays: string[];
}

const EditClassModal = ({
  open,
  classData,
  onOpenChange,
  grade,
  adminId,
}: EditClassModalProps) => {
  const { teachers, isLoading: isLoadingTeachers } = useTeachers(adminId, true);
  const { updateClass, updateLoading } = useClassMutations();
  const { classes: teacherClasses } = useClassesByTeacher(
    classData.teacherId,
    true
  );

  const form = useForm<ClassFormData>({
    defaultValues: {
      subject: classData.subject,
      teacherId: classData.teacherId,
      lessonDays: classData.lessonDays || [],
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    const isUnchanged =
      data.subject === classData.subject &&
      data.teacherId === classData.teacherId &&
      JSON.stringify(data.lessonDays?.sort()) ===
        JSON.stringify(classData.lessonDays?.sort());

    if (isUnchanged) {
      onOpenChange(false);
      return;
    }
    // Check if the subject already exists for this teacher (excluding current class)
    const subjectExists = teacherClasses.some(
      (cls) =>
        cls.id !== classData.id && // Exclude current class from check
        cls.subject === data.subject.trim() &&
        cls.grade === grade &&
        cls.teacherId === data.teacherId
    );

    if (subjectExists) {
      toast.error(
        "This teacher already has a class for this subject and grade"
      );
      return;
    }

    updateClass(
      {
        id: classData.id,
        updates: {
          teacherId: data.teacherId,
          subject: data.subject.trim(),
          grade: grade,
          lessonDays: data.lessonDays,
        },
      },
      {
        onSuccess: () => {
          toast.success("Class updated successfully");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update class");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="teacherId"
              rules={{ required: "Teacher is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={updateLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingTeachers ? (
                        <div className="flex justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        teachers?.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={updateLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lessonDays"
              rules={{
                validate: (value) =>
                  value && value.length > 0
                    ? true
                    : "At least one day is required",
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Lesson Days</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          type="button"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value && field.value.length > 0
                            ? `${field.value.length} day(s) selected`
                            : "Select days"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search days..." />
                        <CommandEmpty>No day found.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-auto">
                          {lessonDays.map((day) => {
                            const handleSelect = () => {
                              const currentValue = field.value || [];
                              const newValue = currentValue.includes(day)
                                ? currentValue.filter((d) => d !== day)
                                : [...currentValue, day];
                              field.onChange(newValue);
                            };

                            return (
                              <CommandItem
                                value={day}
                                key={day}
                                onSelect={handleSelect}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={cn(
                                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                      field.value?.includes(day)
                                        ? "bg-primary text-primary-foreground"
                                        : "opacity-50 [&_svg]:invisible"
                                    )}
                                  >
                                    <Check className={cn("h-4 w-4")} />
                                  </div>
                                  <span>{day}</span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassModal;
