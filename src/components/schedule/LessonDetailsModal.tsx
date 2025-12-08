import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import type { ClassScheduleLessonDTO } from "@/types";
import { useState } from "react";
import { submissionService } from "@/services";
import { toast } from "sonner";

interface FileItem {
  name: string;
  url?: string;
  size?: number;
  type?: string;
}

interface LessonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: ClassScheduleLessonDTO | null;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "ppt":
    case "pptx":
      return "📊";
    case "xls":
    case "xlsx":
      return "📈";
    case "txt":
      return "📄";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "🖼️";
    default:
      return "📄";
  }
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const LessonDetailsModal = ({
  isOpen,
  onClose,
  lesson,
}: LessonDetailsModalProps) => {
  const [downloadingFiles, setDownloadingFiles] = useState<
    Record<string, boolean>
  >({});

  if (!lesson) return null;

  const handleDownload = async (fileName: string, submissionId: string) => {
    if (!submissionId) return;

    setDownloadingFiles((prev) => ({ ...prev, [fileName]: true }));

    try {
      const { data: blob, error } = await submissionService.downloadFile(
        submissionId,
        fileName
      );

      if (error || !blob) {
        throw error || new Error(`Failed to download file: ${fileName}`);
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success(`Downloaded ${fileName} successfully`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Failed to download ${fileName}. Please try again.`);
    } finally {
      setDownloadingFiles((prev) => ({ ...prev, [fileName]: false }));
    }
  };

  // Update the file mapping to include submissionId
  const allFiles = (lesson.submissions || []).flatMap((submission) =>
    (submission.files || [])
      .filter((fileName) => !fileName.startsWith("submission-details-"))
      .map((fileName) => ({
        name: fileName,
        submissionId: submission.id,
        submissionDate: submission.lessonDate,
      }))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">{lesson.subject}</DialogTitle>
          </div>
          <div className="text-sm text-slate-500">
            Teacher: {lesson.teacher} • Grade: {lesson.id.split("-")[0]}
          </div>
        </DialogHeader>

        {allFiles.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Lesson Materials</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {allFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-2xl flex-shrink-0">
                      {getFileIcon(file.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      {/* <p className="text-sm text-muted-foreground">
                        {file.size ? formatFileSize(file.size) : "Unknown size"}{" "}
                        •
                        {file.submissionDate
                          ? file.submissionDate
                          : "Unknown date"}
                      </p> */}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file.name, file.submissionId);
                    }}
                    disabled={downloadingFiles[file.name]}
                  >
                    {downloadingFiles[file.name] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center py-8 border rounded-lg bg-muted/30">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              No materials available for this lesson
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200">
          <h3 className="font-medium text-slate-900 mb-3">Lesson Notes</h3>
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700">
            {lesson.teacher} will be covering {lesson.subject.toLowerCase()} for{" "}
            {lesson.grade} grade. Please review the materials before
            the class and complete the assigned worksheet.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
