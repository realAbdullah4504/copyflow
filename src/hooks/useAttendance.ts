import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '@/services/attendanceService';

export function useAttendance() {
  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceService.getAttendance
  });

  return {
    attendance,
    isLoading
  };
}

export function useTodayAttendance() {
  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: attendanceService.getTodayAttendance
  });

  return {
    attendance,
    isLoading
  };
}
