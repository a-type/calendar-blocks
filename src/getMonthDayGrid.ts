import { getDaysInMonth, getMonthWeekdayOffset } from './dateUtils';

/**
 * Returns the days in a month, partitioned by week, with each day
 * placed in the corresponding index of each week array according to
 * the day of the week it represents (weeks start on Sunday).
 * For instance, if the month begins on Wednesday, the return value may look like:
 * [
 *   [null, null, null, Date, Date, Date, Date],
 *   [Date, Date, Date, Date, Date, Date, Date],
 *   ...
 * ]
 */
export const getMonthDayGrid = (month: number, year: number) => {
  const date = new Date(year, month, 1);

  // first, since we accept any number for month, we grab and store the 'resolved'
  // values. For instance, if the user passes month=15, after we've put it in a date
  // above, we can then pull out the resolved month of April of the following year.
  const resolvedMonth = date.getMonth();
  const resolvedYear = date.getFullYear();

  const dayOffset = getMonthWeekdayOffset(resolvedMonth, resolvedYear);
  // make a grid of days with 7 columns which is large enough to encompass the whole month
  const days: Date[] = new Array(
    Math.ceil((dayOffset + getDaysInMonth(resolvedMonth, resolvedYear)) / 7) * 7
  ).fill(null);
  while (date.getMonth() === resolvedMonth) {
    const dateIndex = date.getDate() + dayOffset - 1;
    days[dateIndex] = new Date(date);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

(window as any).g = getMonthDayGrid;
