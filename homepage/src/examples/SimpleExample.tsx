import { styled } from '@stitches/react';
import React, { useState } from 'react';

import { Calendar, CalendarDay, useCalendarDayGrid } from '../../../src';
import { ExampleProps } from './types';

const SimpleCalendar = styled(Calendar, {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 32px)',
  gridAutoRows: '32px',
  overflow: 'hidden',
  gridGap: '3px',
  // it's good practice to prevent page jumping when switching to a month
  // with more rows...
  height: 'calc(35px * 7)',
});

const SimpleMonthLabel = styled('label', {});

const SimpleMonthButton = styled('button', {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
});

const SimpleMonthHeader = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const SimpleDay = styled(CalendarDay, {
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid transparent',
  cursor: 'pointer',
  position: 'relative',

  '&:focus': {
    outline: 'none',
  },
  '&[data-highlighted]': {
    zIndex: 1,
    borderColor: 'black',
  },
  '&[data-selected]': {
    backgroundColor: '#ccffff',
  },
  '&[data-in-range], &[data-range-start], &[data-range-end]': {
    backgroundColor: '#ccffff',
  },
  '&[data-different-month]': {
    visibility: 'hidden',
  },
});

const SimpleDayLabel = styled('label', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8em',
});

const DayLabels = () => {
  return (
    <>
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
        <SimpleDayLabel key={index}>{day}</SimpleDayLabel>
      ))}
    </>
  );
};

export function SimpleExample({
  viewInfo: { month, year },
  setViewInfo,
  rangeValue,
  onRangeValueChange,
}: ExampleProps) {
  const days = useCalendarDayGrid(month, year);
  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <SimpleMonthHeader>
        <SimpleMonthLabel>{monthLabel}</SimpleMonthLabel>
        <div>
          <SimpleMonthButton
            onClick={() => setViewInfo({ month: month - 1, year })}
          >
            &lt;
          </SimpleMonthButton>
          <SimpleMonthButton
            onClick={() => setViewInfo({ month: month + 1, year })}
          >
            &gt;
          </SimpleMonthButton>
        </div>
      </SimpleMonthHeader>
      <SimpleCalendar
        displayMonth={month}
        displayYear={year}
        onDisplayChange={setViewInfo}
        rangeValue={rangeValue}
        onRangeChange={onRangeValueChange}
      >
        <DayLabels />
        {days.map((value, index) => (
          <SimpleDay value={value} key={value.key} />
        ))}
      </SimpleCalendar>
    </div>
  );
}
