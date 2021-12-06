import { useMemo } from 'react';

import { getMonthDayGrid } from './getMonthDayGrid';

export function useCalendarDayGrid(month: number, year: number) {
  // this is memoized to provide consistent references
  const dayGrid = useMemo(() => getMonthDayGrid(month, year), [month, year]);

  return dayGrid;
}
