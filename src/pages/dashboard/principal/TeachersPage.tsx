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
  const todayIndex = (today.getDay() + 6) % 7; // Monday = 0
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const initialDate = addDays(weekStart, todayIndex);
  const [currentDayIndex, setCurrentDayIndex] = useState(todayIndex);
  const [selectedDate, setSelectedDate] = useState(
    format(initialDate, "yyyy-MM-dd")
  );
  // format for display
  const displayDate = format(parseISO(selectedDate), "MM/dd/yyyy");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDay: WeekDay = WEEK_DAYS[currentDayIndex].key;
  const currentDayLabel = getDayLabel(currentDay);

  const {
    data: schedules,
    isLoading,
    error,
  } = useAllGradesSchedule(user?.adminId || "", currentDay, selectedDate);
  console.log("schedules", schedules);
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
    const today = new Date();
    const todayIndex = (today.getDay() + 6) % 7;
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const todayDate = addDays(weekStart, todayIndex);

    setCurrentDayIndex(todayIndex);
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
