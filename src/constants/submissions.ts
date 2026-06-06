import type { Submission, FileItem } from "@/types";
import { teachers, grades, subjects } from "./shared";

const fileTypes = [
  "worksheet",
  "exam",
  "handout",
  "lesson_plan",
] as const;
const statuses = ["pending", "printed", "censored"] as const;
const paperColors = ["white", "yellow", "blue", "green", "pink"] as const;

const getRandomElement = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const generateMockSubmissions = (count: number): Submission[] => {
  const submissions: Submission[] = [];

  for (let i = 1; i <= count; i++) {
    const teacher = getRandomElement(teachers);
    const createdAt = getRandomDate(new Date(2025, 0, 1), new Date());
    const updatedAt = getRandomDate(createdAt, new Date());
    const status = getRandomElement(statuses);
    const fileType = getRandomElement(fileTypes);
    const copies = getRandomInt(15, 40);
    const subject = getRandomElement(subjects);
    getRandomElement(grades); // unused but keeps deterministic randomness

    const fileName = `${subject.toLowerCase().replace(/\s+/g, "_")}_${fileType}_${i}.pdf`;
    const files: FileItem[] = [{ existing: true as const, name: fileName }];

    submissions.push({
      id: i.toString(),
      teacherId: teacher.id,
      classId: `${teacher.id}-${i}`,
      fileType,
      files,
      notes:
        i % 3 === 0 ? `Special instructions for ${subject} ${fileType}` : "",
      copies,
      lessonDate: formatDate(getRandomDate(new Date(2025, 0, 1), new Date())),
      paperColor: getRandomElement(paperColors),
      printSettings: {
        doubleSided: Math.random() > 0.3,
        stapled: Math.random() > 0.7,
        twoStaples: Math.random() > 0.8,
        color: Math.random() > 0.7,
        booklet: Math.random() > 0.5,
        hasCover: Math.random() > 0.5,
        coloredCover: Math.random() > 0.5,
        coloredAnswerSheet: Math.random() > 0.8,
      },
      status,
      createdAt,
      updatedAt: status === "pending" ? createdAt : updatedAt,
    });
  }

  return submissions;
};

export const mockSubmissions: Submission[] = generateMockSubmissions(25);
