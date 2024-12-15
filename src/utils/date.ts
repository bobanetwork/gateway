import {
  parseISO,
  format,
  differenceInDays,
  addDays,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  isSameDay,
  getUnixTime,
  intervalToDuration,
  fromUnixTime
} from 'date-fns';

/**
 * Utility for formatting dates into a readable string.
 * @param date - A Date instance or a string in ISO format.
 * @param formatStr - Format string (e.g., 'yyyy-MM-dd', 'dd/MM/yyyy').
 * @returns Formatted date string.
 */
export function formatDate(date: Date | string | number, formatStr: string = 'dd MMM yyyy hh:mm a'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : typeof date === 'number' ? fromUnixTime(date) : date;
  return format(parsedDate, formatStr);
}

/**
 * Calculates the difference between two dates in days.
 * @param date1 - First date (ISO string or Date).
 * @param date2 - Second date (ISO string or Date).
 * @returns Difference in days (positive or negative).
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  return differenceInDays(
    typeof date1 === 'string' ? parseISO(date1) : date1,
    typeof date2 === 'string' ? parseISO(date2) : date2
  );
}

/**
 * Adds days to a given date.
 * @param date - Base date (ISO string or Date).
 * @param days - Number of days to add (can be negative to subtract).
 * @returns New date with days added.
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return addDays(parsedDate, days);
}

/**
 * Checks if a date is before another date.
 * @param date1 - First date (ISO string or Date).
 * @param date2 - Second date (ISO string or Date).
 * @returns True if date1 is before date2.
 */
export function isDateBefore(date1: Date | string, date2: Date | string): boolean {
  return isBefore(
    typeof date1 === 'string' ? parseISO(date1) : date1,
    typeof date2 === 'string' ? parseISO(date2) : date2
  );
}

/**
 * Checks if a date is after another date.
 * @param date1 - First date (ISO string or Date).
 * @param date2 - Second date (ISO string or Date).
 * @returns True if date1 is after date2.
 */
export function isDateAfter(date1: Date | string, date2: Date | string): boolean {
  return isAfter(
    typeof date1 === 'string' ? parseISO(date1) : date1,
    typeof date2 === 'string' ? parseISO(date2) : date2
  );
}

/**
 * Checks if two dates fall on the same day.
 * @param date1 - First date (ISO string or Date).
 * @param date2 - Second date (ISO string or Date).
 * @returns True if the two dates are the same day.
 */
export function areDatesSameDay(date1: Date | string, date2: Date | string): boolean {
  return isSameDay(
    typeof date1 === 'string' ? parseISO(date1) : date1,
    typeof date2 === 'string' ? parseISO(date2) : date2
  );
}

/**
 * Gets the start and end of a day for a given date.
 * @param date - A Date instance or ISO string.
 * @returns Object containing start and end of the day.
 */
export function getDayRange(date: Date | string): { start: Date; end: Date } {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfDay(parsedDate),
    end: endOfDay(parsedDate),
  };
}

/**
 * Returns the current timestamp in Unix format.
 */
export const dayNowUnix = () => {
  return getUnixTime(new Date());
};

/**
 * Formats a duration in seconds to a human-readable string (e.g., "1 day 3 hr 15 min").
 */
export const formatDuration = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const { days = 0, hours = 0, minutes = 0 } = duration;

  let result = '';
  if (days > 0) {
    result += `${days} day${days > 1 ? 's' : ''} `;
  }
  if (hours > 0) {
    result += `${hours} hr `;
  }
  if (minutes > 0) {
    result += `${minutes} min `;
  }
  return result.trim();
};

/**
 * Formats a duration in seconds to "X days Y hrs".
 */
export const formatDurationInDaysHrs = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const { days = 0, hours = 0 } = duration;

  let result = '';
  if (days > 0) {
    result += `${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0 || days === 0) {
    result += ` ${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return result.trim();
};

/**
 * Formats a date to a human-readable string with day range and shared time.
 */
export const formatUnlockTimeRange = (startTime: number, endTime: number): string => {
  const startDate = fromUnixTime(startTime);
  const endDate = fromUnixTime(endTime);

  const startDay = format(startDate, 'dd');
  const endDay = format(endDate, 'dd');
  const monthYear = format(startDate, 'MMM yyyy');
  const time = format(startDate, 'hh:mm a'); // Use shared time

  return `${startDay}-${endDay} ${monthYear} ${time}`;
};
