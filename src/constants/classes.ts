import type { ClassEntity } from "@/types";
import { teachers, subjects, grades } from "./shared";

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
export const mockClasses: ClassEntity[] = teachers.flatMap((t) =>
  generateMockClasses(t.id, 6)
);
