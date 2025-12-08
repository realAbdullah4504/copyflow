export const teachers = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Michael Chen" },
  { id: "3", name: "Emily Rodriguez" },
  { id: "4", name: "David Kim" },
  { id: "5", name: "Jennifer Lee" },
  { id: "6", name: "Robert Wilson" },
];


export const subjects = [
  "Writing",
  "Grammar",
  "First Aid",
  "Current Issues",
  "Science",
  "Business Math",
  "Geography",
  "History",
  "Literature",
  "Vocabulary",
];

export const WEEK_DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
] as const;

export type WeekDay = typeof WEEK_DAYS[number]['key'];

// Helper function to get day labels
export const getDayLabels = () => WEEK_DAYS.map(day => day.label);

export const grades = ["9", "10", "11", "12"];

export const filterTypes = [
  "Worksheet",
  "Exam",
  "Handout",
  "Lesson Plan",
  "Other",
];

export const paperColors = ["White", "Blue", "Green", "Yellow", "Pink"];
