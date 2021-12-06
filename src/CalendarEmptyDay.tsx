import React, { forwardRef } from 'react';

/**
 * Renders a 'blank' space in a calendar grid.
 */
export const CalendarEmptyDay = forwardRef<HTMLDivElement, {}>(
  function CalendarEmptyDay(props, ref) {
    return <div aria-hidden data-day-empty {...props} ref={ref} />;
  }
);
