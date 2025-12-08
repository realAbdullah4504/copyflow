import { useState, useCallback } from 'react';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import type { IGradeSchedule, IDay } from '@/types/schedule';

const weekLabel = "this week - (Dec 8 - 11)";

const days: IDay[] = [
  { key: "monday", label: "Monday - 8th" },
  { key: "tuesday", label: "Tue - 9th" },
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
  const [currentWeek, setCurrentWeek] = useState(0);

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeek(prev => prev - 1);
    // In a real app, you would fetch the previous week's schedule here
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeek(prev => prev + 1);
    // In a real app, you would fetch the next week's schedule here
  }, []);

  const handleViewLesson = useCallback((lesson) => {
    console.log('View lesson:', lesson);
    // In a real app, you would navigate to the lesson details page
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center p-4">
      <ScheduleView 
        schedule={mockSchedule}
        days={days}
        weekLabel={weekLabel}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onViewLesson={handleViewLesson}
      />
    </div>
  );
};

export default PrincipalTeachersPage;
