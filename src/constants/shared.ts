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
export const getDayLabel = (key: WeekDay) =>
  WEEK_DAYS.find(d => d.key === key)?.label ?? key;


export const grades = ["9", "10", "11", "12"];

export const sections = ["B", "R", "D", "S"] as const;
export type Section = typeof sections[number];

export const filterTypes = [
  "Worksheet",
  "Exam",
  "Handout",
  "Lesson Plan",
  "Other",
];

export const paperColors = ["White", "Blue", "Green", "Yellow", "Pink"];
