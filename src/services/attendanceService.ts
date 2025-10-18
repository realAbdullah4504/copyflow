import type { AttendanceRecord } from "@/types";

const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    grade: '9A',
    date: new Date('2025-10-01'),
    present: 28,
    absent: 2,
    late: 1,
    total: 31
  },
  {
    id: '2',
    grade: '9B',
    date: new Date('2025-10-01'),
    present: 25,
    absent: 0,
    late: 0,
    total: 25
  },
  {
    id: '3',
    grade: '10A',
    date: new Date('2025-10-01'),
    present: 29,
    absent: 1,
    late: 0,
    total: 30
  },
  {
    id: '4',
    grade: '10B',
    date: new Date('2025-10-01'),
    present: 30,
    absent: 2,
    late: 0,
    total: 32
  },
  {
    id: '5',
    grade: '11C',
    date: new Date('2025-10-01'),
    present: 27,
    absent: 1,
    late: 0,
    total: 28
  }
];

export const attendanceService = {
  getAttendance: async (): Promise<AttendanceRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockAttendance];
  },

  getTodayAttendance: async (): Promise<AttendanceRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const today = new Date().toDateString();
    return mockAttendance.filter(
      record => new Date(record.date).toDateString() === today
    );
  }
};
