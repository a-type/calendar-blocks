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
 * @param month The month
 * @param year The year
 * @returns The number of days in the month
 */
export const getDaysInMonth = (month: number, year: number): number => {
  if (month === 1 && year % 4 === 0) {
    return 29; // Leap year
  }
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

/**
 * Add months to a date, adjusting the date if necessary.
 * @param date The date
 * @param count The number of months to add
 * @returns The new date
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

export const defaultGetDateEnabled = () => true;

/** Today, at midnight */
export const today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);

export function getMonthWeekdayOffset(month: number, year: number) {
  const firstDay = new Date(year, month, 1);
  return firstDay.getDay();
}

export function getIsFirstRow(date: Date) {
  return (
    date.getDate() +
      getMonthWeekdayOffset(date.getMonth(), date.getFullYear()) <=
    7
  );
}

export function getIsLastRow(date: Date) {
  return (
    getDaysInMonth(date.getMonth(), date.getFullYear()) -
      (date.getDate() -
        getMonthWeekdayOffset(date.getMonth(), date.getFullYear())) <
    7
  );
}

export function getIsFirstWeek(date: Date) {
  return date.getDate() <= 7;
}

export function getIsLastWeek(date: Date) {
  return (
    getDaysInMonth(date.getMonth(), date.getFullYear()) - date.getDate() < 7
  );
}

export function getIsWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}
