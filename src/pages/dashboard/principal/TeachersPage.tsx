import { useState, useCallback } from 'react';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { LessonDetailsModal } from '@/components/schedule/LessonDetailsModal';
import type { IGradeSchedule, IDay, ILesson } from '@/types/schedule';

const weekLabel = "this week - (Dec 8 - 11)";

const days: IDay[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thurs" },
];

const mockSchedule: IGradeSchedule[] = [
  {
    gradeLabel: "9th",
    lessons: {
      monday: { id: "9-grammar-mon", subject: "Grammar", teacher: "Mrs Schwimmer" },
      tuesday: { id: "9-math-tue", subject: "Math", teacher: "Mrs Katz" },
      wednesday: { id: "9-news-wed", subject: "News", teacher: "Mrs Labin" },
      thursday: { id: "9-news-thu", subject: "News", teacher: "Mrs Smart" },
    },
  },
  {
    gradeLabel: "10th",
    lessons: {
      monday: { id: "10-grammar-mon", subject: "Grammar", teacher: "Mrs Schwimmer" },
      tuesday: { id: "10-math-tue", subject: "Math", teacher: "Mrs Katz" },
      wednesday: { id: "10-news-wed", subject: "News", teacher: "Mrs Labin" },
      thursday: { id: "10-news-thu", subject: "News", teacher: "Mrs Smart" },
    },
  },
  {
    gradeLabel: "11th",
    lessons: {
      monday: { id: "11-literature-mon", subject: "Literature", teacher: "Mr Johnson" },
      tuesday: { id: "11-physics-tue", subject: "Physics", teacher: "Dr Chen" },
      wednesday: { id: "11-history-wed", subject: "History", teacher: "Mr Wilson" },
      thursday: { id: "11-chemistry-thu", subject: "Chemistry", teacher: "Dr Lee" },
    },
  },
  {
    gradeLabel: "12th",
    lessons: {
      monday: { id: "12-economics-mon", subject: "Economics", teacher: "Mr Brown" },
      tuesday: { id: "12-biology-tue", subject: "Biology", teacher: "Dr Garcia" },
      wednesday: { id: "12-calculus-wed", subject: "Calculus", teacher: "Mrs Patel" },
      thursday: { id: "12-literature-thu", subject: "Literature", teacher: "Ms Taylor" },
    },
  },
];

const PrincipalTeachersPage = () => {
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewLesson = useCallback((lesson: ILesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Small delay to allow the modal close animation to complete
    setTimeout(() => setSelectedLesson(null), 300);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center p-4">
      <ScheduleView 
        schedule={mockSchedule}
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
