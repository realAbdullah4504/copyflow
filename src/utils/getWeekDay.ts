import { getDay, parseISO, addDays, format } from "date-fns";

/**
 * dayIndex: 0 = Monday, 1 = Tuesday, etc. (based on WEEK_DAYS array)
 * referenceDateStr: string "YYYY-MM-DD"
 * forward: true = next day, false = previous day
 */
export function getNextWeekDayDate(
  dayIndex: number,
  referenceDateStr?: string,
  forward = true
): string {
  const referenceDate = referenceDateStr ? parseISO(referenceDateStr) : new Date();
  const currentWeekDay = (getDay(referenceDate) + 6) % 7; // Monday = 0

  let diff = dayIndex - currentWeekDay;

  // Adjust for forward/backward wrap
  if (forward && diff <= 0) diff += 7;   // move to next occurrence
  if (!forward && diff >= 0) diff -= 7;  // move to previous occurrence

  const targetDate = addDays(referenceDate, diff);
  return format(targetDate, "yyyy-MM-dd"); // keep local date
}
