import { useMemo } from 'react';

import { getMonthDayGrid } from './getMonthDayGrid';

/**
 * A helper hook which computes a list of 'days' and 'blanks' which will render
 * into a calendar grid. The 'blanks' are null values and represent grid cells
 * which don't have a day in them (like if a month starts on Tuesday, Sunday and
 * Monday will be blank). Other values will be Dates.
 */
export function useCalendarDayGrid(month: number, year: number) {
  // this is memoized to provide consistent references
  const dayGrid = useMemo(() => getMonthDayGrid(month, year), [month, year]);

  return dayGrid;
}
