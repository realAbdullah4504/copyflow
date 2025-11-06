import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { FileItem, Submission } from "@/types";
import { FileText, Download, Loader2, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submissionService } from "@/services";
import { useState } from "react";
import { toast } from "sonner";

interface ViewSubmissionModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly submission: Submission | null;
}

const ViewSubmissionModal = ({
  open,
  onOpenChange,
  submission,
}: ViewSubmissionModalProps) => {
  const [downloadingFiles, setDownloadingFiles] = useState<
    Record<string, boolean>
  >({});
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const downloadFile = async (fileName: string): Promise<Blob> => {
    if (!submission) throw new Error("No submission found");

    const { data, error } = await submissionService.downloadFile(
      submission.id,
      fileName
    );

    if (error || !data) {
      throw error || new Error(`Failed to download file: ${fileName}`);
    }

    return data;
  };

  const handleDownload = async (fileName: string) => {
    if (!submission) return;

    setDownloadingFiles((prev) => ({ ...prev, [fileName]: true }));

    try {
      const blob = await downloadFile(fileName);
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      globalThis.URL.revokeObjectURL(url);
      a.remove();

      toast.success(`Downloaded ${fileName} successfully`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Failed to download ${fileName}. Please try again.`);
    } finally {
      setDownloadingFiles((prev) => ({ ...prev, [fileName]: false }));
    }
  };

  const handleDownloadAll = async () => {
    if (!submission?.files?.length) return;

    setIsDownloadingAll(true);
    const toastId = toast.loading("Preparing files for download...");

    try {
      // Import JSZip dynamically to reduce initial bundle size
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Download all files and add them to the zip
      const downloadPromises = submission.files
        ?.filter((f): f is { existing: true; name: string } => f.existing)
        .map(async ({ name: fileName }) => {
          try {
            const blob = await downloadFile(fileName);
            zip.file(fileName, blob);
            return { success: true, fileName };
          } catch (error) {
            console.error(`Error downloading ${fileName}:`, error);
            return { success: false, fileName, error };
          }
        });

      const results = await Promise.all(downloadPromises);
      const failedDownloads = results.filter((result) => !result.success);

      if (failedDownloads.length > 0) {
        const errorMessage =
          failedDownloads.length === results.length
            ? "Failed to download all files. Please try again."
            : `Failed to download ${failedDownloads.length} of ${results.length} files.`;

        toast.error(errorMessage, { id: toastId });
        return;
      }

      // Generate the zip file with compression
      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }, // Medium compression level
      });

      // Create and trigger download
      const url = globalThis.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `submission-${submission.id}-${new Date()
        .toISOString()
        .slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      globalThis.URL.revokeObjectURL(url);
      a.remove();

      toast.success(
        `Successfully downloaded ${results.length} file${
          results.length > 1 ? "s" : ""
        }`,
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error("Error creating zip file:", error);
      toast.error("Failed to create zip file. Please try again.", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };
  if (!submission) return null;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      printed: "bg-green-100 text-green-800",
      censored: "bg-red-100 text-red-800",
      flagged: "bg-orange-100 text-orange-800",
    };

    return (
      <Badge
        className={`${
          statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
        </div>
        <div className="overflow-y-auto px-6 flex-1">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Teacher</p>
              <p className="mt-1">{submission.teacher?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-1">{getStatusBadge(submission.status)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Subject</p>
              <p className="mt-1">{submission.class?.label}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">File Type</p>
              <p className="mt-1">{submission.fileType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Copies</p>
              <p className="mt-1">{submission.copies}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Paper Color</p>
              <p className="mt-1 capitalize">{submission.paperColor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Double Sided</p>
              <p className="mt-1">
                {submission.printSettings.doubleSided ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stapled</p>
              <p className="mt-1">
                {submission.printSettings.stapled ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Color</p>
              <p className="mt-1">
                {submission.printSettings.color ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Booklet</p>
              <p className="mt-1">
                {submission.printSettings.booklet ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cover</p>
              <p className="mt-1">
                {submission.printSettings.hasCover ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Colored Cover</p>
              <p className="mt-1">
                {submission.printSettings.coloredCover ? "Yes" : "No"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="mt-1 whitespace-pre-line">
                {submission.notes || "No notes provided"}
              </p>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">Files</p>
                {submission.files && submission.files.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-2"
                    onClick={handleDownloadAll}
                    disabled={isDownloadingAll}
                  >
                    {isDownloadingAll ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <DownloadCloud className="h-3 w-3" />
                    )}
                    Download All
                  </Button>
                )}
              </div>
              <div className="mt-2 space-y-2 pr-2 scrollbar-thin">
                {submission.files && submission.files.length > 0 ? (
                  submission.files
                    ?.filter(
                      (f): f is { existing: true; name: string } => f.existing
                    )
                    .map(({ name: fileName }) => (
                      <div
                        key={`file-${fileName}`}
                        className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {fileName}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(fileName);
                          }}
                          disabled={downloadingFiles[fileName]}
                        >
                          {downloadingFiles[fileName] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">No files attached</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Submitted on{" "}
            {format(new Date(submission.createdAt), "MMM d, yyyy h:mm a")}
          </p>
          {submission.updatedAt !== submission.createdAt && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated on{" "}
              {format(new Date(submission.updatedAt), "MMM d, yyyy h:mm a")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSubmissionModal;
