import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WEEK_DAYS } from "@/constants/shared";
import type { IGradeSchedule, IScheduleViewProps, ILesson } from "@/types/schedule";

interface ScheduleHeaderProps {
  selectedDayLabel: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

const ScheduleHeader = ({
  selectedDayLabel,
  onPreviousDay,
  onNextDay,
  onToday,
}: ScheduleHeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
        Teachers Schedule
      </h1>
      <p className="text-sm text-slate-600 mt-1">
        Overview of lessons for {selectedDayLabel}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onToday} className="text-xs">
        Today
      </Button>
      <div className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium text-slate-800 shadow-inner">
        <button
          onClick={onPreviousDay}
          className="px-2 py-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer select-none"
        >
          {"<"}
        </button>
        <span className="whitespace-nowrap">{selectedDayLabel}</span>
        <button
          onClick={onNextDay}
          className="px-2 py-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer select-none"
        >
          {">"}
        </button>
      </div>
    </div>
  </div>
);

interface LessonCardProps {
  lesson: ILesson;
  onViewLesson?: (lesson: ILesson) => void;
}

const LessonCard = ({ lesson, onViewLesson }: LessonCardProps) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200 text-center px-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-sm font-semibold text-slate-900">{lesson.subject}</div>
    <div className="mt-1 text-xs text-slate-600">{lesson.teacher}</div>
    {onViewLesson && (
      <Button
        size="sm"
        variant="outline"
        className="mt-3 h-7 px-3 text-xs border-slate-300 hover:bg-slate-100"
        onClick={() => onViewLesson(lesson)}
      >
        View Lesson
      </Button>
    )}
  </div>
);

interface ScheduleGridProps {
  schedule: IGradeSchedule[];
  dayKey: string;
  onViewLesson?: (lesson: ILesson) => void;
}

const ScheduleGrid = ({ schedule, dayKey, onViewLesson }: ScheduleGridProps) => {
  return (
    <div className="grid grid-cols-[90px_repeat(4,minmax(0,1fr))] gap-3 md:gap-4">
      <div className="flex items-end justify-center pb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
        Grade
      </div>
      {[1, 2, 3, 4].map((period) => (
        <div key={period} className="text-center text-sm font-medium text-slate-700">
          Period {period}
        </div>
      ))}

      {schedule.map((row) => {
        const dayLessons: (ILesson | null)[] = Array(4).fill(null);

        // Fill lessons for this day if available
        const lessonKeys = Object.keys(row.lessons).filter((key) => key === dayKey);
        lessonKeys.forEach((key, i) => {
          if (i < 4) dayLessons[i] = row.lessons[key];
        });

        return (
          <div key={row.gradeLabel} className="contents">
            <div className="flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 shadow-sm">
              {row.gradeLabel}
            </div>
            {dayLessons.map((lesson, idx) => (
              <div
                key={`${row.gradeLabel}-${idx}`}
                className="h-32 flex items-center justify-center"
              >
                {lesson ? (
                  <LessonCard lesson={lesson} onViewLesson={onViewLesson} />
                ) : (
                  <div className="w-full h-full bg-slate-50 rounded-xl border border-dashed border-slate-200" />
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const ScheduleView = ({ schedule, onViewLesson }: IScheduleViewProps) => {
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // Sunday = 0 -> 6
  const [currentDayIndex, setCurrentDayIndex] = useState(todayIndex);

  const currentDay = WEEK_DAYS[currentDayIndex];

  const handlePreviousDay = () =>
    setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : WEEK_DAYS.length - 1));
  const handleNextDay = () =>
    setCurrentDayIndex((prev) => (prev < WEEK_DAYS.length - 1 ? prev + 1 : 0));
  const handleToday = () => setCurrentDayIndex(todayIndex);

  return (
    <div className="w-full bg-white shadow-sm rounded-2xl border border-slate-200 p-4 md:p-6 lg:p-8">
      <ScheduleHeader
        selectedDayLabel={currentDay.label}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
      />
      <ScheduleGrid
        schedule={schedule}
        dayKey={currentDay.key}
        onViewLesson={onViewLesson}
      />
    </div>
  );
};
