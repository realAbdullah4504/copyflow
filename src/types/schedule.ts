export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday";

export interface ILesson {
  id: string;
  subject: string;
  teacher: string;
}

export interface IGradeSchedule {
  gradeLabel: string;
  lessons: Partial<Record<DayKey, ILesson>>;
}

export interface IDay {
  key: DayKey;
  label: string;
}

export interface IScheduleViewProps {
  schedule: IGradeSchedule[];
  days: IDay[];
  weekLabel: string;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  onViewLesson?: (lesson: ILesson) => void;
}
