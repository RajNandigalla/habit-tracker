import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Extend dayjs with necessary plugins
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(localizedFormat);

// Re-export dayjs for direct use if needed (try to prefer helper functions)
export { dayjs };
export type { Dayjs };

// --- Constants ---
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- Core Date Helpers ---

/**
 * Returns the current date as an ISO string (YYYY-MM-DD).
 */
export const getTodayISO = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

/**
 * Formats a date string or Dayjs object.
 * Default format: 'MMM D, YYYY'
 */
export const formatDate = (
  date: string | Date | Dayjs | number,
  formatStr: string = 'MMM D, YYYY'
): string => {
  return dayjs(date).format(formatStr);
};

/**
 * Returns a relative time string (e.g., "2 hours ago").
 */
export const getRelativeTime = (date: string | Date | Dayjs | number): string => {
  return dayjs(date).fromNow();
};

/**
 * Returns the current timestamp in milliseconds.
 * Replaces Date.now().
 */
export const getCurrentTimestamp = (): number => {
  return dayjs().valueOf();
};

/**
 * Creates a Dayjs object from a variety of inputs.
 * Replaces new Date().
 */
export const getDate = (date?: string | number | Date | Dayjs): Dayjs => {
  return dayjs(date);
};

/**
 * Returns the current year.
 */
export const getCurrentYear = (): number => {
  return dayjs().year();
};

/**
 * Returns the current month (0-indexed to match native Date behavior if needed suitable for array indexing).
 */
export const getCurrentMonth = (): number => {
  return dayjs().month();
};

/**
 * Returns the start of the week.
 */
export const getStartOfWeek = (date?: string | Dayjs): Dayjs => {
  return dayjs(date).startOf('week');
};

/**
 * Returns the end of the week.
 */
export const getEndOfWeek = (date?: string | Dayjs): Dayjs => {
  return dayjs(date).endOf('week');
};

/**
 * Checks if a date is today.
 */
export const isToday = (date: string | Dayjs): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Checks if date A is before date B.
 */
export const isBeforeDate = (
  dateA: string | Dayjs,
  dateB: string | Dayjs,
  unit: dayjs.OpUnitType = 'day'
): boolean => {
  return dayjs(dateA).isBefore(dayjs(dateB), unit);
};

/**
 * Checks if date A is after date B.
 */
export const isAfterDate = (
  dateA: string | Dayjs,
  dateB: string | Dayjs,
  unit: dayjs.OpUnitType = 'day'
): boolean => {
  return dayjs(dateA).isAfter(dayjs(dateB), unit);
};

/**
 * Sorts an array of dates (strings or objects) in descending order (newest first).
 */
export const sortDatesDesc = (
  dateA: string | Date | number,
  dateB: string | Date | number
): number => {
  return dayjs(dateB).valueOf() - dayjs(dateA).valueOf();
};

/**
 * Sorts an array of dates (strings or objects) in ascending order (oldest first).
 */
export const sortDatesAsc = (
  dateA: string | Date | number,
  dateB: string | Date | number
): number => {
  return dayjs(dateA).valueOf() - dayjs(dateB).valueOf();
};
