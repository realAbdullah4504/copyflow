import { useState, useCallback } from "react";
import { ScheduleView } from "@/components/schedule/ScheduleView";
import { LessonDetailsModal } from "@/components/schedule/LessonDetailsModal";
import { useAllGradesSchedule } from "@/hooks/queries/useAllGradesSchedule";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import type { LessonSlot } from "@/types";
import { WEEK_DAYS, getDayLabel, type WeekDay } from "@/constants";

const PrincipalTeachersPage = () => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<LessonSlot | null>(null);
  const todayIndex = (new Date().getDay() + 6) % 7;
  const initialIndex = Math.min(todayIndex, WEEK_DAYS.length - 1);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(initialIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDay: WeekDay = WEEK_DAYS[currentDayIndex].key;
  const currentDayLabel = getDayLabel(currentDay);

  const {
    data: schedules,
    isLoading,
    error,
  } = useAllGradesSchedule(user?.adminId || "", currentDay);
  const handleViewLesson = useCallback((lesson: LessonSlot) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLesson(null), 300);
  }, []);

  const handlePreviousDay = useCallback(() => {
    setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : WEEK_DAYS.length - 1));
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDayIndex((prev) => (prev < WEEK_DAYS.length - 1 ? prev + 1 : 0));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDayIndex(initialIndex);
  }, [initialIndex]);

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

  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">No schedule data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <ScheduleView
        schedule={schedules}
        currentDay={currentDay}
        currentDayLabel={currentDayLabel}
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
