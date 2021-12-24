import { createContext, MouseEvent, useContext } from 'react';

import { WeekDay } from './constants';

export interface CalendarContextData {
  setDay: (value: Date) => void;
  setDayHovered: (value: Date) => boolean;
  highlightedDate: Date | null;
  month: number;
  year: number;
  value?: Date | null;
  rangeValue?: {
    start: Date | null;
    end: Date | null;
  };
  getDateEnabled: (value: Date) => boolean;
  isFocusWithin: boolean;
  weekStartsOn: WeekDay;
}

export const CalendarContext = createContext<CalendarContextData>({
  setDay: () => {},
  setDayHovered: () => true,
  highlightedDate: null,
  month: 0,
  year: 0,
  getDateEnabled: () => true,
  isFocusWithin: false,
  weekStartsOn: WeekDay.Sunday,
});

export const CalendarContextProvider = CalendarContext.Provider;

export function useCalendarContext() {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error(
      'useCalendarContext must be used within a CalendarContextProvider'
    );
  }

  return context;
}
