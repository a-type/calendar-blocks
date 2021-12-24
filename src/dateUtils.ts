/**
 * Determines if two dates are on the same calendar day
 */
export const isSameDay = (a: Date, b: Date | null): boolean =>
  !b
    ? false
    : a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

/**
 * Determines if two dates are on the same calendar month in
 * the same calendar year
 */
export function isSameMonth(a: Date, b: Date | null): boolean {
  if (!b) {
    return false;
  }
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

/**
 * Determines if a given date `a` is before the second date `b` (exclusive)
 */
export const isBefore = (a: Date | null, b: Date | null): boolean => {
  if (!a || !b) return false;
  return a.getTime() < b.getTime();
};

/**
 * Determines if a given date is between two other dates (exclusive)
 */
export const isBetweenDays = (
  day: Date,
  a: Date | null,
  b: Date | null
): boolean => {
  if (!a || !b) {
    return false;
  }

  const aIsBeforeB = isBefore(a, b);
  const start = aIsBeforeB ? a : b;
  const end = aIsBeforeB ? b : a;

  return day.getTime() > start.getTime() && day.getTime() < end.getTime();
};

/**
 * Get the number of days in a month
 */
export const getDaysInMonth = (month: number, year: number): number => {
  if (month === 1 && year % 4 === 0) {
    return 29; // Leap year
  }
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

/**
 * Add months to a date, adjusting the date if necessary.
 */
export const addMonths = (date: Date, count: number): Date => {
  const newDate = new Date(date);
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + count);
  const daysInNextMonth = getDaysInMonth(
    nextMonth.getMonth(),
    nextMonth.getFullYear()
  );
  newDate.setMonth(
    newDate.getMonth() + count,
    Math.min(daysInNextMonth, newDate.getDate())
  );
  return newDate;
};

/** Today, at midnight */
export const today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);

/**
 * In a calendar grid, the first day of the month may be offset
 * from the first column if it falls on a day which isn't the first
 * of the week. This computes that offset for a given calendar month.
 */
export function getMonthWeekdayOffset(
  month: number,
  year: number,
  weekStartsOn: number
): number {
  const firstDay = new Date(year, month, 1);
  // must be positive
  const offset = firstDay.getDay() - weekStartsOn;
  if (offset < 0) return offset + 7;
  return offset;
}

/**
 * Computes the total number of grid rows required to display all
 * the days in a calendar month.
 */
export function getGridRowCount(
  month: number,
  year: number,
  weekStartsOn: number
) {
  return Math.ceil(
    (getMonthWeekdayOffset(month, year, weekStartsOn) +
      getDaysInMonth(month, year)) /
      7
  );
}

/**
 * Computes the total number of grid cells in a grid which is
 * large enough to render a calendar month. Includes cells
 * for days which fall outside the current month but are visible
 * because of weekday offsets.
 */
export function getGridDayCount(
  month: number,
  year: number,
  weekStartsOn: number
) {
  return getGridRowCount(month, year, weekStartsOn) * 7;
}

/**
 * Determines if a given date is on the first row of its respective
 * calendar grid as it would be rendered.
 */
export function getIsFirstRow(date: Date, weekStartsOn: number) {
  return (
    date.getDate() +
      getMonthWeekdayOffset(
        date.getMonth(),
        date.getFullYear(),
        weekStartsOn
      ) <=
    7
  );
}

/**
 * Determines if a given date is on the last row of its respective
 * calendar grid as it would be rendered.
 */
export function getIsLastRow(date: Date, weekStartsOn: number) {
  // this is surprisingly hard to get right lol

  const daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear());
  const firstDayOffset = getMonthWeekdayOffset(
    date.getMonth(),
    date.getFullYear(),
    weekStartsOn
  );
  const totalGridCells = Math.ceil((daysInMonth + firstDayOffset) / 7) * 7;
  const emptyDaysTotal = totalGridCells - daysInMonth;
  const emptyDaysOnLastRow = emptyDaysTotal - firstDayOffset;
  const numberOfDaysOnLastRow = 7 - emptyDaysOnLastRow;
  return daysInMonth - date.getDate() < numberOfDaysOnLastRow;
}

/**
 * Determines if a given date is in the first week of its month
 */
export function getIsFirstWeek(date: Date) {
  return date.getDate() <= 7;
}

/**
 * Determines if a given date is in the last week of its month
 */
export function getIsLastWeek(date: Date) {
  return (
    getDaysInMonth(date.getMonth(), date.getFullYear()) - date.getDate() < 7
  );
}

/**
 * Determines if a given date is a weekend
 */
export function getIsWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

/**
 * Computes whether a given range of dates would include
 * a disabled date according to the given getDateEnabled
 * function. This is O(n) in the number of days in the range.
 */
export function rangeIncludesInvalidDate(
  start: Date,
  end: Date,
  getDateEnabled: (date: Date) => boolean
) {
  const isRangeReversed = isBefore(end, start);
  const startDate = new Date(isRangeReversed ? end : start);
  const endDate = new Date(isRangeReversed ? start : end);
  const date = new Date(startDate);
  while (date <= endDate) {
    if (!getDateEnabled(date)) {
      return true;
    }
    date.setDate(date.getDate() + 1);
  }
  return false;
}
