import type { submissionFormSchema } from "@/components/submissions";
import { format, parseISO } from "date-fns";
import { jsPDF } from "jspdf";
import { z } from "zod";

interface Teacher {
  id: string;
  name: string;
}

interface Class {
  id: string;
  label: string;
}

export const generateSubmissionPDF = (
  data: z.infer<typeof submissionFormSchema>,
  files: File[],
  teachers?: Teacher[],
  classes?: Class[]
): Blob => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Print Request Details", 14, 22);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(14, 25, 196, 25);

  doc.setFontSize(12);
  let yPosition = 40;

  // Submission details
  const details: { label: string; value: string }[] = [
    {
      label: "Teacher",
      value: teachers?.find((t) => t.id === data.teacherId)?.name || "N/A",
    },
    {
      label: "Class",
      value: classes?.find((c) => c.id === data.classId)?.label || "N/A",
    },
    { label: "File Type", value: data.fileType },
    {
      label: "Lesson Date",
      value: data.lessonDate
        ? format(parseISO(data.lessonDate), "MM/dd/yyyy")
        : "N/A",
    },
    ...(data.copies
      ? [{ label: "Copies", value: data.copies.toString() }]
      : [{ label: "Copies", value: "For all students (entire grade)" }]),
    { label: "Paper Color", value: data.paperColor },
    { label: "Print Settings", value: "" },
    // Only include settings that are true
    ...(data.printSettings.doubleSided
      ? [{ label: "  • Double Sided", value: "Yes" }]
      : []),
    ...(data.printSettings.stapled
      ? [{ label: "  • Stapled", value: "Yes" }]
      : []),
    ...(data.printSettings.color ? [{ label: "  • Color", value: "Yes" }] : []),
    ...(data.printSettings.booklet
      ? [{ label: "  • Booklet", value: "Yes" }]
      : []),
    ...(data.printSettings.hasCover
      ? [{ label: "  • Hard Cover", value: "Yes" }]
      : []),
    ...(data.printSettings.coloredCover
      ? [{ label: "  • Colored Cover", value: "Yes" }]
      : []),
    { label: "Notes", value: data.notes || "No notes provided" },
    { label: "Files", value: `${files.length} file(s) attached` },
  ];

  // Add details to PDF
  for (const item of details) {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`${item.label}:`, 20, yPosition);

    doc.setFont("helvetica", "normal");
    const text = doc.splitTextToSize(item.value, 150);
    doc.text(text, 60, yPosition);

    yPosition += text.length > 1 ? text.length * 7 : 10;

    if (item.label === "Print Settings" || item.label === "Notes") {
      yPosition += 5;
    }
  }

  // Timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 280);

  return new Blob([doc.output("blob")], { type: "application/pdf" });
};
