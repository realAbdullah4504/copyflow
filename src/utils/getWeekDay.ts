import { WEEK_DAYS, type WeekDay } from "@/constants/shared";

/**
 * Returns the WeekDay key (e.g., 'monday', 'tuesday') for a given Date
 */
export function getWeekDayKey(date: Date): WeekDay {
  // JS getDay() returns 0 (Sunday) - 6 (Saturday)
  const jsDay = date.getDay();
  // WEEK_DAYS is assumed to start with Monday as index 0
  const weekIndex = jsDay === 0 ? 6 : jsDay - 1;
  return WEEK_DAYS[weekIndex].key as WeekDay;
}
