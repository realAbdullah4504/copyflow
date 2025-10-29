import type { Submission } from "@/types";

const teachers = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Emily Rodriguez' },
  { id: '4', name: 'David Kim' },
  { id: '5', name: 'Jennifer Lee' },
  { id: '6', name: 'Robert Wilson' }
];

const subjects = [
  'Mathematics', 'English', 'Science', 'History', 'Physics', 
  'Chemistry', 'Biology', 'Geography', 'Computer Science', 'Art',
  'Music', 'Physical Education', 'Economics', 'Psychology', 'Sociology'
];

const fileTypes = ['worksheet', 'exam', 'handout', 'lesson_plan', 'quiz', 'study_guide'];
const grades = ['9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'];
const statuses = ['pending', 'printed', 'censored'];
const paperColors = ['white', 'yellow', 'blue', 'green', 'pink'];

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateMockSubmissions = (count: number): Submission[] => {
  const submissions: Submission[] = [];
  
  for (let i = 1; i <= count; i++) {
    const teacher = getRandomElement(teachers);
    const createdAt = getRandomDate(new Date(2025, 0, 1), new Date());
    const updatedAt = getRandomDate(createdAt, new Date());
    const status = getRandomElement(statuses);
    const urgency = getRandomElement(['low', 'medium', 'high']);
    const fileType = getRandomElement(fileTypes);
    const copies = getRandomInt(15, 40);
    const subject = getRandomElement(subjects);
    
    submissions.push({
      id: i.toString(),
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject,
      grade: getRandomElement(grades),
      fileType,
      files: [`${subject.toLowerCase().replace(/\s+/g, '_')}_${fileType}_${i}.pdf`],
      notes: i % 3 === 0 ? `Special instructions for ${subject} ${fileType}` : '',
      copies,
      paperColor: getRandomElement(paperColors),
      printSettings: {
        doubleSided: Math.random() > 0.3,
        stapled: Math.random() > 0.7,
        color: Math.random() > 0.7
      },
      status,
      urgency,
      createdAt,
      updatedAt: status === 'pending' ? createdAt : updatedAt
    });
  }
  
  return submissions;
};

export const mockSubmissions: Submission[] = generateMockSubmissions(25);