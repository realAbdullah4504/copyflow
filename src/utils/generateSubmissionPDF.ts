import type { submissionFormSchema } from "@/components/submissions";
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
  files: string[],
  teachers?: Teacher[],
  classes?: Class[]
): Blob => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("Print Request Details", 14, 22);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(14, 25, 196, 25);

  // Reset font for content
  doc.setFontSize(12);
  let yPosition = 40;

  // Add submission details
  const details = [
    {
      label: "Teacher",
      value: teachers?.find((t) => t.id === data.teacherId)?.name || "N/A",
    },
    {
      label: "Class",
      value: classes?.find((c) => c.id === data.classId)?.label || "N/A",
    },
    { label: "File Type", value: data.fileType },
    { label: "Lesson Date", value: data.lessonDate },
    { label: "Copies", value: data.copies },
    { label: "Paper Color", value: data.paperColor },
    { label: "Print Settings", value: "" },
    {
      label: "  • Double Sided",
      value: data.printSettings.doubleSided ? "Yes" : "No",
    },
    { label: "  • Stapled", value: data.printSettings.stapled ? "Yes" : "No" },
    { label: "  • Color", value: data.printSettings.color ? "Yes" : "No" },
    { label: "  • Booklet", value: data.printSettings.booklet ? "Yes" : "No" },
    {
      label: "  • Has Cover",
      value: data.printSettings.hasCover ? "Yes" : "No",
    },
    {
      label: "  • Colored Cover",
      value: data.printSettings.coloredCover ? "Yes" : "No",
    },
    { label: "Notes", value: data.notes || "No notes provided" },
    { label: "Files", value: `${files.length} file(s) attached` },
  ];

  // Add details to PDF
  details.forEach((item) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`${item.label}:`, 20, yPosition);

    doc.setFont("helvetica", "normal");
    const text = doc.splitTextToSize(String(item.value), 150);
    doc.text(text, 60, yPosition);

    yPosition += text.length > 1 ? text.length * 7 : 10;

    // Add some space after sections
    if (item.label === "Print Settings" || item.label === "Notes") {
      yPosition += 5;
    }
  });

  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 280);

  // Return the PDF as a Blob
  return new Blob([doc.output("blob")], { type: "application/pdf" });
};
