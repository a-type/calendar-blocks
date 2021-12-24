import { getGridDayCount, getMonthWeekdayOffset } from './dateUtils';

/**
 * Expands a month into a grid of days, filling in days from previous
 * or next month as necessary.
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
  return new Array(getGridDayCount(resolvedMonth, resolvedYear))
    .fill(null)
    .map((_, i) => {
      const day = i - dayOffset + 1;
      const gridDate = new Date(resolvedYear, resolvedMonth, day);
      return {
        date: gridDate,
        isDifferentMonth: gridDate.getMonth() !== resolvedMonth,
        key: gridDate.toISOString(),
      };
    });
};
