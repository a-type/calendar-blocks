import { useMemo } from 'react';

import { getMonthWeekdayOffset, useCalendarContext } from '.';

/**
 * Given an enclosing Calendar context, this
 * returns the date at the given index. If you
 * have a row and column, compute the index as
 * row * 7 + column.
 */
export function useCalendarDay(dayIndex: number) {
  const { month, year } = useCalendarContext();
  const weekdayOffset = getMonthWeekdayOffset(month, year);
  const day = dayIndex - weekdayOffset + 1;
  const date = new Date(year, month, day);
  return useMemo(
    () => ({
      date,
      key: date.toISOString(),
      isDifferentMonth:
        date.getMonth() !== month || date.getFullYear() !== year,
    }),
    [date, month, year]
  );
}
