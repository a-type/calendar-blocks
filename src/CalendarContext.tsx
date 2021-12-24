import { createContext, MouseEvent, useContext } from 'react';

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
}

export const CalendarContext = createContext<CalendarContextData>({
  setDay: () => {},
  setDayHovered: () => true,
  highlightedDate: null,
  month: 0,
  year: 0,
  getDateEnabled: () => true,
  isFocusWithin: false,
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
