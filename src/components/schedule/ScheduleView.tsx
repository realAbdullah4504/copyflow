import { Button } from "@/components/ui/button";
import type { IDay, IGradeSchedule, IScheduleViewProps, ILesson } from "@/types/schedule";

interface ScheduleHeaderProps {
  weekLabel: string;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
}

const ScheduleHeader = ({ weekLabel, onPreviousWeek, onNextWeek }: ScheduleHeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Teachers Schedule</h1>
      <p className="text-sm text-slate-600 mt-1">
        Overview of lessons by grade and day for the current week.
      </p>
    </div>
    <div className="inline-flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full text-xs md:text-sm font-medium text-slate-800 shadow-inner">
      <button 
        onClick={onPreviousWeek}
        className="px-2 py-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer select-none"
        aria-label="Previous week"
      >
        {"<"}
      </button>
      <span className="whitespace-nowrap">{weekLabel}</span>
      <button 
        onClick={onNextWeek}
        className="px-2 py-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer select-none"
        aria-label="Next week"
      >
        {">"}
      </button>
    </div>
  </div>
);

interface DayHeaderProps {
  day: IDay;
}

const DayHeader = ({ day }: DayHeaderProps) => (
  <div
    key={day.key}
    className="h-16 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200 text-xs md:text-sm font-medium text-slate-800 text-center shadow-sm"
  >
    {day.label}
  </div>
);

interface LessonCardProps {
  lesson: ILesson;
  onViewLesson?: (lesson: ILesson) => void;
}

const LessonCard = ({ lesson, onViewLesson }: LessonCardProps) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200 text-center px-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-sm font-semibold text-slate-900">
      {lesson.subject}
    </div>
    <div className="mt-1 text-xs text-slate-600">
      {lesson.teacher}
    </div>
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
  days: IDay[];
  onViewLesson?: (lesson: ILesson) => void;
}

const ScheduleGrid = ({ schedule, days, onViewLesson }: ScheduleGridProps) => (
  <div className="grid grid-cols-[90px_repeat(4,minmax(0,1fr))] gap-3 md:gap-4">
    <div className="flex items-end justify-center pb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
      Grade
    </div>
    {days.map((day) => (
      <DayHeader key={day.key} day={day} />
    ))}

    {schedule.map((row) => (
      <div key={row.gradeLabel} className="contents">
        <div className="flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 shadow-sm">
          {row.gradeLabel}
        </div>
        {days.map((day) => {
          const lesson = row.lessons[day.key];
          return (
            <div
              key={`${row.gradeLabel}-${day.key}`}
              className="h-32 flex items-center justify-center"
            >
              {lesson ? (
                <LessonCard 
                  lesson={lesson} 
                  onViewLesson={onViewLesson} 
                />
              ) : (
                <div className="w-full h-full bg-slate-50 rounded-xl border border-dashed border-slate-200" />
              )}
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

export const ScheduleView = ({
  schedule,
  days,
  weekLabel,
  onPreviousWeek = () => {},
  onNextWeek = () => {},
  onViewLesson,
}: IScheduleViewProps) => {
  return (
    <div className="w-full max-w-6xl bg-white shadow-sm rounded-2xl border border-slate-200 p-4 md:p-6 lg:p-8">
      <ScheduleHeader 
        weekLabel={weekLabel}
        onPreviousWeek={onPreviousWeek}
        onNextWeek={onNextWeek}
      />
      <ScheduleGrid 
        schedule={schedule} 
        days={days} 
        onViewLesson={onViewLesson} 
      />
    </div>
  );
};
