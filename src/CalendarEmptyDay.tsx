import React, { forwardRef } from 'react';

export const CalendarEmptyDay = forwardRef<HTMLDivElement, {}>(
  function CalendarEmptyDay(props, ref) {
    return <div aria-hidden data-day-empty {...props} ref={ref} />;
  }
);
