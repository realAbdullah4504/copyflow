import { useState, useCallback } from "react";
import { ScheduleView } from "@/components/schedule/ScheduleView";
import { LessonDetailsModal } from "@/components/schedule/LessonDetailsModal";
import { useAllGradesSchedule } from "@/hooks/queries/useAllGradesSchedule";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import type { LessonSlot } from "@/types";
import { WEEK_DAYS, getDayLabel, type WeekDay } from "@/constants";
import { getNextWeekDayDate } from "@/utils";
import { addDays, format, parseISO, startOfWeek } from "date-fns";

const PrincipalTeachersPage = () => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<LessonSlot | null>(null);
  const today = new Date();
  const rawIndex = (today.getDay() + 6) % 7; // Monday = 0
  // Clamp to valid school days (Mon-Thu = 0-3); default to Monday if weekend/Friday
  const todayIndex = rawIndex < WEEK_DAYS.length ? rawIndex : 0;
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  // If today is a school day use it; otherwise use next Monday
  const initialDate = rawIndex < WEEK_DAYS.length
    ? addDays(weekStart, rawIndex)
    : addDays(weekStart, 7); // next Monday
  const [currentDayIndex, setCurrentDayIndex] = useState(todayIndex);
  const [selectedDate, setSelectedDate] = useState(
    format(initialDate, "yyyy-MM-dd")
  );
  // format for display
  const displayDate = format(parseISO(selectedDate), "MM/dd/yyyy");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDay: WeekDay = WEEK_DAYS[currentDayIndex]?.key;
  const currentDayLabel = getDayLabel(currentDay);

  const {
    data: schedules,
    isLoading,
    error,
  } = useAllGradesSchedule(user?.adminId || "", currentDay, selectedDate);
  const handleViewLesson = useCallback((lesson: LessonSlot) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLesson(null), 300);
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDayIndex((prev) => {
      const newIndex = prev < WEEK_DAYS.length - 1 ? prev + 1 : 0;
      setSelectedDate(getNextWeekDayDate(newIndex, selectedDate, true));
      return newIndex;
    });
  }, [selectedDate]);

  const handlePreviousDay = useCallback(() => {
    setCurrentDayIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : WEEK_DAYS.length - 1;
      setSelectedDate(getNextWeekDayDate(newIndex, selectedDate, false));
      return newIndex;
    });
  }, [selectedDate]);

  const handleToday = useCallback(() => {
    const now = new Date();
    const rawIdx = (now.getDay() + 6) % 7;
    const clampedIdx = rawIdx < WEEK_DAYS.length ? rawIdx : 0;
    const ws = startOfWeek(now, { weekStartsOn: 1 });
    const todayDate = rawIdx < WEEK_DAYS.length
      ? addDays(ws, rawIdx)
      : addDays(ws, 7);

    setCurrentDayIndex(clampedIdx);
    setSelectedDate(format(todayDate, "yyyy-MM-dd"));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-red-600">
          <p>Failed to load schedule.</p>
          <p className="text-sm text-gray-600 mt-2">
            {(error instanceof Error ? error.message : String(error)) ||
              "Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <ScheduleView
        schedule={schedules!}
        currentDay={currentDay}
        currentDayLabel={currentDayLabel}
        displayDate={displayDate}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
        onViewLesson={handleViewLesson}
      />

      {selectedLesson && (
        <LessonDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          lesson={selectedLesson}
        />
      )}
    </div>
  );
};

export default PrincipalTeachersPage;
