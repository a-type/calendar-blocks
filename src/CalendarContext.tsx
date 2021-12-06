import { createContext, MouseEvent, useContext } from 'react';

export interface CalendarContextData {
  onDayClick: (ev: MouseEvent<any>, value: Date) => void;
  setDay: (value: Date) => void;
  setDayHovered: (value: Date) => void;
  onDayHover: (ev: MouseEvent<any>, value: Date) => void;
  highlightedDate: Date | null;
  month: number;
  year: number;
  value?: Date | null;
  rangeValue?: {
    start: Date | null;
    end: Date | null;
  };
  getDateEnabled: (value: Date) => boolean;
}

export const CalendarContext = createContext<CalendarContextData>({
  onDayClick: () => {},
  setDay: () => {},
  setDayHovered: () => {},
  onDayHover: () => {},
  highlightedDate: null,
  month: 0,
  year: 0,
  getDateEnabled: () => true,
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
