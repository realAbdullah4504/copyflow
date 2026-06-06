import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import type { Submission } from "@/types";
import { Loader2, Printer, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submissionService } from "@/services";
import { useState } from "react";
import { toast } from "sonner";

interface ViewSubmissionModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly submission: Submission | null;
  readonly handlers?: {
    onPrintedConfirm?: () => void;
    onCensorshipConfirm?: () => void;
    onUnCensorshipConfirm?: () => void;
  };
  readonly isSubmitting?: {
    deleteLoading?: boolean;
    censorLoading?: boolean;
    printedLoading?: boolean;
    unCensorLoading?: boolean;
  };
  readonly allowedActions?: readonly string[];
  readonly isArchive?: boolean;
}

const ViewSubmissionModal = ({
  open,
  onOpenChange,
  submission,
  handlers,
  isSubmitting,
  allowedActions,
  isArchive = false,
}: ViewSubmissionModalProps) => {
  const [downloadingFiles, setDownloadingFiles] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState({
    preview: false,
    print: false,
  });
  const isCensored = submission?.status === "censored";

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

  const handlePreview = async (shouldPrint = false) => {
    if (!submission?.files?.length) return;

    // Set loading state based on action
    const loadingKey = shouldPrint ? "print" : "preview";
    setIsLoading((prev) => ({ ...prev, [loadingKey]: true }));

    const toastId = toast.loading(
      shouldPrint ? "Preparing for print..." : "Preparing preview..."
    );

    try {
      const { PDFDocument } = await import("pdf-lib");

      const existingFiles =
        submission.files?.filter(
          (f): f is { existing: true; name: string } => f.existing
        ) ?? [];

      console.log("files", existingFiles);

      const supportedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];

      const supportedFiles = existingFiles.filter(({ name }) => {
        const lowerName = name.toLowerCase();
        return supportedExtensions.some((ext) => lowerName.endsWith(ext));
      });

      if (supportedFiles.length === 0) {
        toast.error("No supported files found (PDF or images).", {
          id: toastId,
        });
        return;
      }

      // Filter out the instruction sheet only in archive view
      const orderedFiles = isArchive
        ? supportedFiles.filter(
            ({ name }) =>
              !(
                name.startsWith("submission-details-") &&
                name.toLowerCase().endsWith(".pdf")
              )
          )
        : supportedFiles;

      console.log(
        "📄 Files selected for merging:",
        orderedFiles.map((f) => f.name)
      );

      const mergedPdf = await PDFDocument.create();

      let processedFiles = 0;
      const skippedFiles: string[] = [];

      for (const { name: fileName } of orderedFiles) {
        console.log(`⬇️ Downloading: ${fileName}`);

        try {
          const blob = await downloadFile(fileName).catch((err) => {
            console.warn(`⚠️ Failed to download ${fileName}:`, err.message);
            return null;
          });

          if (!blob || blob.size === 0) {
            console.warn(`⚠️ Empty or invalid blob for: ${fileName}`);
            continue;
          }

          console.log(`✔️ Downloaded: ${fileName} (${blob.size} bytes)`);

          try {
            const lowerName = fileName.toLowerCase();
            const arrayBuffer = await blob.arrayBuffer();

            if (lowerName.endsWith(".pdf")) {
              const pdfDoc = await PDFDocument.load(arrayBuffer).catch(
                (err) => {
                  console.warn(
                    `⚠️ Failed to parse PDF ${fileName}:`,
                    err.message
                  );
                  return null;
                }
              );

              if (!pdfDoc) continue;

              const pages = await mergedPdf.copyPages(
                pdfDoc,
                pdfDoc.getPageIndices()
              );

              if (pages.length === 0) {
                console.warn(`⚠️ No pages found in: ${fileName}`);
                continue;
              }

              for (const page of pages) {
                mergedPdf.addPage(page);
              }

              processedFiles++;
              console.log(`📌 Added ${pages.length} pages from: ${fileName}`);
            } else if (
              lowerName.endsWith(".png") ||
              lowerName.endsWith(".jpg") ||
              lowerName.endsWith(".jpeg") ||
              lowerName.endsWith(".webp")
            ) {
              const uint8Array = new Uint8Array(arrayBuffer);
              const isPng = lowerName.endsWith(".png");

              const image = isPng
                ? await mergedPdf.embedPng(uint8Array)
                : await mergedPdf.embedJpg(uint8Array);

              const { width, height } = image.scale(1);
              const page = mergedPdf.addPage([width, height]);

              page.drawImage(image, {
                x: 0,
                y: 0,
                width,
                height,
              });

              processedFiles++;
              console.log(`🖼️ Added image as page from: ${fileName}`);
            } else {
              console.warn(`⚠️ Unsupported file type for preview: ${fileName}`);
              skippedFiles.push(fileName);
              continue;
            }
          } catch (err) {
            console.error(`❌ Error processing ${fileName}:`, err);
            continue;
          }
        } catch (err) {
          console.error(`❌ Unexpected error processing: ${fileName}`, err);
        }
      }

      if (processedFiles === 0) {
        toast.error("Failed to prepare preview. No valid files found.", {
          id: toastId,
        });
        return;
      }

      if (skippedFiles.length > 0) {
        console.warn(
          "Some files were skipped because they are not supported for preview:",
          skippedFiles
        );
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      if (shouldPrint) {
        // Open print dialog
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      } else {
        // Just preview in new tab
        window.open(url, "_blank");
      }

      toast.success("Preview ready.", { id: toastId });
    } catch (err) {
      console.error("Fatal error generating print preview:", err);
      toast.error("Something went wrong preparing the PDF.", { id: toastId });
    } finally {
      setIsLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

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
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] flex flex-col bg-background">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            View the details of this print request
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Teacher
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.teacher?.name || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Status
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {getStatusBadge(submission?.status || "")}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Subject
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.class?.label || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Lesson Date
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <span className="whitespace-nowrap">{submission?.lessonDate
                      ? format(parseISO(submission.lessonDate), "MM/dd/yyyy")
                      : "-"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    File Type
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.fileType || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Copies
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.copies || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Paper Color
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm capitalize">
                    {submission?.paperColor || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Double Sided
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.printSettings?.doubleSided ? "Yes" : "No"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Stapled
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.printSettings?.stapled ? "Yes" : "No"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Two Staples (Left Side)
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.printSettings?.twoStaples ? "Yes" : "No"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Hard Cover
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.printSettings?.hasCover ? "Yes" : "No"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Colored Cover
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.printSettings?.coloredCover ? "Yes" : "No"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Colored Answer Sheet
                  </label>
                  <div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {submission?.printSettings?.coloredAnswerSheet
                      ? "Yes"
                      : "No"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Notes, Files and Metadata */}
            <div className="flex flex-col h-full">
              <div className="space-y-4 mb-4">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Notes
                </label>
                <div className="rounded-md border border-input bg-background p-3">
                  <p className="whitespace-pre-line text-sm text-foreground">
                    {submission?.notes || "No notes provided"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
                  Files
                </label>
                <div
                  className="flex-1 overflow-y-auto pr-1"
                  style={{ maxHeight: "200px" }}
                >
                  {submission?.files && submission.files.length > 0 ? (
                    submission.files
                      ?.filter(
                        (f): f is { existing: true; name: string } => f.existing
                      )
                      .map(({ name: fileName }) => (
                        <div
                          key={`file-${fileName}`}
                          className="flex items-center justify-between group hover:bg-white p-2 rounded-md border border-transparent hover:border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate max-w-[180px]">
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

              <div className="rounded-lg border border-gray-200/70 p-4 text-sm text-gray-500 mt-4">
                <p>
                  Submitted on{" "}
                  {format(
                    new Date(submission?.createdAt || ""),
                    "MMM d, yyyy h:mm a"
                  )}
                </p>
                {submission?.updatedAt &&
                  submission.updatedAt !== submission?.createdAt && (
                    <p className="mt-1">
                      Last updated on{" "}
                      {format(
                        new Date(submission.updatedAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 bg-white py-3 flex flex-col gap-2">
          {submission?.files && submission.files.length > 0 && (
            <div className="flex  gap-2">
              {/* Preview Button - Always shown */}
              <Button
                className="justify-center flex-1 gap-2 bg-blue-50/60 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-100"
                variant="outline"
                onClick={() => handlePreview(false)}
                disabled={isLoading.preview}
              >
                {isLoading.preview ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">Preview</span>
              </Button>

              {/* Print Button - Only shown for non-censored submissions */}
              {!isCensored && (
                <Button
                  className="justify-center gap-2 flex-1 bg-blue-50/60 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-100"
                  variant="outline"
                  onClick={() => handlePreview(true)}
                  disabled={isLoading.print}
                >
                  {isLoading.print ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Printer className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">Print</span>
                </Button>
              )}
            </div>
          )}
          {((allowedActions?.includes("printed") &&
            submission?.status === "pending") ||
            (allowedActions?.includes("censorship") &&
              submission?.status !== "censored") ||
            (allowedActions?.includes("approve") &&
              submission?.status === "censored")) && (
            <>
              {allowedActions?.includes("printed") &&
                submission?.status === "pending" && (
                  <Button
                    className="w-full justify-center bg-green-50/60 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-100"
                    variant="outline"
                    onClick={handlers?.onPrintedConfirm}
                    disabled={isSubmitting?.printedLoading}
                  >
                    {isSubmitting?.printedLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Mark as Printed"
                    )}
                  </Button>
                )}

              {allowedActions?.includes("censorship") &&
                submission?.status !== "censored" && (
                  <Button
                    className="w-full justify-center bg-red-50/60 text-red-700 hover:bg-red-200 hover:text-red-800 border border-red-100"
                    variant="outline"
                    onClick={handlers?.onCensorshipConfirm}
                    disabled={isSubmitting?.censorLoading}
                  >
                    {isSubmitting?.censorLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send to Censorship"
                    )}
                  </Button>
                )}

              {allowedActions?.includes("approve") &&
                submission?.status === "censored" && (
                  <Button
                    className="w-full justify-center bg-green-50/60 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-100"
                    variant="outline"
                    onClick={handlers?.onUnCensorshipConfirm}
                    disabled={isSubmitting?.unCensorLoading}
                  >
                    {isSubmitting?.unCensorLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Approve to Print"
                    )}
                  </Button>
                )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSubmissionModal;
