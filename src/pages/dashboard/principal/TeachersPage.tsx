import { useState, useCallback } from "react";
import { ScheduleView } from "@/components/schedule/ScheduleView";
import { LessonDetailsModal } from "@/components/schedule/LessonDetailsModal";
import { useAllGradesSchedule } from "@/hooks/queries/useAllGradesSchedule";
import { useAuth } from "@/hooks/useAuth";
import { WEEK_DAYS, type WeekDay } from "@/constants/shared";
import type { ClassScheduleLessonDTO } from "@/types";
import { Loader2 } from "lucide-react";

// Use the shared WEEK_DAYS constant
const days = WEEK_DAYS.map((day) => ({
  ...day,
  // Format labels to match the previous format (shortened for weekdays)
  label:
    day.key === "monday"
      ? day.label
      : day.label.substring(0, 3).replace("day", ""),
}));

const weekLabel = "this week - (Dec 8 - 11)";

const PrincipalTeachersPage = () => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] =
    useState<ClassScheduleLessonDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: schedules,
    isLoading,
    error,
  } = useAllGradesSchedule(user?.adminId || "");

  console.log(schedules, "schedules");
  const handleViewLesson = useCallback((lesson: ClassScheduleLessonDTO) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Small delay to allow the modal close animation to complete
    setTimeout(() => setSelectedLesson(null), 300);
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Handle error state
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

  // Handle empty state
  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">No schedule data available.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center p-4">
      <ScheduleView
        schedule={schedules}
        days={days}
        weekLabel={weekLabel}
        onPreviousWeek={() => {}}
        onNextWeek={() => {}}
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
