import type { ClassEntity } from "@/types";

const subjects = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Physics",
  "Chemistry",
  "Biology",
  "Geography",
  "Computer Science",
  "Art",
];

const grades = ["9A", "9B", "10A", "10B", "11A", "11B", "12A", "12B"];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const generateMockClasses = (teacherId: string, count: number): ClassEntity[] => {
  const result: ClassEntity[] = [];
  for (let i = 1; i <= count; i++) {
    const createdAt = getRandomDate(new Date(2025, 0, 1), new Date());
    result.push({
      id: `${teacherId}-${i}`,
      teacherId,
      grade: getRandomElement(grades),
      subject: getRandomElement(subjects),
      active: Math.random() > 0.3,
      createdAt,
      updatedAt: createdAt,
    });
  }
  return result;
};

// Seed a few teachers' classes for demo
const teacherIds = ["1", "2", "3"];
export const mockClasses: ClassEntity[] = teacherIds.flatMap((t) =>
  generateMockClasses(t, 6)
);
