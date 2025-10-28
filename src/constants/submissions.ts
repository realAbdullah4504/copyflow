import type { Submission } from "@/types";

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    teacherId: '1',
    teacherName: 'Sarah Johnson',
    subject: 'Mathematics',
    grade: '10A',
    fileType: 'worksheet',
    files: ['algebra_practice.pdf'],
    notes: 'Please print by tomorrow morning',
    copies: 30,
    paperColor: 'white',
    printSettings: {
      doubleSided: true,
      stapled: false,
      color: false
    },
    status: 'pending',
    urgency: 'high',
    createdAt: new Date('2025-09-28T08:30:00'),
    updatedAt: new Date('2025-09-28T08:30:00')
  },
  {
    id: '2',
    teacherId: '2',
    teacherName: 'Michael Chen',
    subject: 'English',
    grade: '9B',
    fileType: 'exam',
    files: ['midterm_exam.pdf', 'answer_sheet.pdf'],
    notes: 'Urgent - exam is on Friday',
    copies: 25, 
    paperColor: 'white',
    printSettings: {
      doubleSided: false,
      stapled: true,
      color: false
    },
    status: 'pending',
    urgency: 'high',
    createdAt: new Date('2025-09-27T14:20:00'),
    updatedAt: new Date('2025-09-28T09:15:00')
  },
  {
    id: '3',
    teacherId: '1',
    teacherName: 'Sarah Johnson',
    subject: 'Mathematics',
    grade: '11C',
    fileType: 'handout',
    files: ['trigonometry_notes.pdf'],
    notes: '',
    copies: 28,
    paperColor: 'yellow',
    printSettings: {
      doubleSided: true,
      stapled: false,
      color: true
    },
    status: 'printed',
    urgency: 'medium',
    createdAt: new Date('2025-09-26T10:00:00'),
    updatedAt: new Date('2025-09-27T08:00:00')
  },
  {
    id: '4',
    teacherId: '2',
    teacherName: 'Michael Chen',
    subject: 'English',
    grade: '12A',
    fileType: 'lesson_plan',
    files: ['shakespeare_analysis.pdf'],
    notes: 'Color printing required for diagrams',
    copies: 22,
    paperColor: 'white',
    printSettings: {
      doubleSided: true,
      stapled: true,
      color: true
    },
    status: 'pending',
    urgency: 'medium',
    createdAt: new Date('2025-09-28T11:45:00'),
    updatedAt: new Date('2025-09-28T11:45:00')
  },
  {
    id: '5',
    teacherId: '1',
    teacherName: 'Sarah Johnson',
    subject: 'Mathematics',
    grade: '10B',
    fileType: 'worksheet',
    files: ['geometry_practice.pdf'],
    notes: 'Low priority',
    copies: 32,
    paperColor: 'white',
    printSettings: {
      doubleSided: true,
      stapled: false,
      color: false
    },
    status: 'censored',
    urgency: 'low',
    createdAt: new Date('2025-09-25T09:30:00'),
    updatedAt: new Date('2025-09-26T14:20:00')
  }
];