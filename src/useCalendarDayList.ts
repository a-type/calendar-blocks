import { useMemo } from 'react';

import { CalendarDayValue } from './CalendarDay';
import { WeekDay } from './constants';
import { getMonthDayList } from './getMonthDayList';

/**
 * A helper hook which computes a list of 'days' and 'blanks' which will render
 * into a calendar grid. The 'blanks' are null values and represent grid cells
 * which don't have a day in them (like if a month starts on Tuesday, Sunday and
 * Monday will be blank). Other values will be Dates.
 */
export function useCalendarDayList(
  month: number,
  year: number,
  dayStartsOn = WeekDay.Sunday
): (CalendarDayValue & { key: string })[] {
  // this is memoized to provide consistent references
  const dayGrid = useMemo(
    () => getMonthDayList(month, year, dayStartsOn),
    [month, year]
  );

  return dayGrid;
}
