import { getDay, parseISO, addDays } from "date-fns";

// Monday = 0, Sunday = 6
export function getNextWeekDayDate(
  dayIndex: number,
  referenceDateStr?: string,
  forward = true
): string {
  const referenceDate = referenceDateStr ? parseISO(referenceDateStr) : new Date();
  const currentWeekDay = (getDay(referenceDate) + 6) % 7; // shift Sunday = 6

  let diff = dayIndex - currentWeekDay;

  // Do not move if it's today
  if (forward && diff < 0) diff += 7;       // move forward only if day passed
  if (!forward && diff > 0) diff -= 7;     // move backward only if day ahead

  const targetDate = addDays(referenceDate, diff);
  return targetDate.toISOString().split("T")[0];
}
