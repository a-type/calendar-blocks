import React from 'react';

import { useCalendarContext, useCalendarDayList } from '.';
import { CalendarDayValue } from './CalendarDay';

export interface CalendarDaysProps {
  monthOffset?: number;
  children: (day: CalendarDayValue & { key: string }) => React.ReactNode;
}

export function CalendarDays({ monthOffset = 0, children }: CalendarDaysProps) {
  const { month, year, weekStartsOn } = useCalendarContext();
  const days = useCalendarDayList(month + monthOffset, year, weekStartsOn);

  return <>{days.map(children)}</>;
}
