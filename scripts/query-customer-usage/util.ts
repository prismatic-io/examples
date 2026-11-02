/**
 * Format a Date as a YYYY-MM-DD string (in UTC)
 */
export const toDateString = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Get an array of dates (at midnight UTC) from start to end, inclusive
 */
export const getDaysArray = (start: Date, end: Date) => {
  const days: Date[] = [];
  for (
    const day = new Date(start);
    day <= end;
    day.setUTCDate(day.getUTCDate() + 1)
  ) {
    days.push(new Date(day));
  }
  return days;
};

/**
 * Get the last millisecond of a given day (in UTC)
 */
export const getEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return endOfDay;
};
