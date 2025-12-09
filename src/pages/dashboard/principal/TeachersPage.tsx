import { useState, useCallback } from "react";
import { ScheduleView } from "@/components/schedule/ScheduleView";
import { LessonDetailsModal } from "@/components/schedule/LessonDetailsModal";
import { useAllGradesSchedule } from "@/hooks/queries/useAllGradesSchedule";
import { useAuth } from "@/hooks/useAuth";
import type { ClassScheduleLessonDTO } from "@/types";
import { Loader2 } from "lucide-react";

const PrincipalTeachersPage = () => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] =
    useState<ClassScheduleLessonDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: schedules, isLoading, error } =
    useAllGradesSchedule(user?.adminId || "");

  const handleViewLesson = useCallback((lesson: ClassScheduleLessonDTO) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLesson(null), 300);
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

  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">No schedule data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <ScheduleView schedule={schedules} onViewLesson={handleViewLesson} />

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
