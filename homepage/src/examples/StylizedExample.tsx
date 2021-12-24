import { styled } from '@stitches/react';
import React, { forwardRef, useCallback, useState } from 'react';

import { Calendar, CalendarDay, useCalendarDayGrid } from '../../../src';
import { ExampleProps } from './types';

const now = new Date();

const StylizedCalendarGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 32px)',
  gridAutoRows: '32px',
  // it's good practice to prevent page jumping when switching to a month
  // with more rows...
  height: 'calc(32px * 7)',
  borderRadius: '8px',
  overflow: 'hidden',
  padding: '6px',
  backgroundColor: '#fafcfe',
});

const StylizedDay = styled(CalendarDay, {
  border: '1px solid transparent',
  backgroundColor: 'transparent',

  borderRadius: 0,
  // border collapse
  marginRight: -1,
  marginBottom: -1,
  // keep above blank days
  position: 'relative',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  transition: '0.2s ease background-color, 0.2s ease border',
  cursor: 'pointer',

  '&[data-weekend]': {
    backgroundColor: '#faffff',
  },
  '&[data-highlighted]': {
    zIndex: 1,
    outline: '#ecce1f auto 1px',
  },
  '&[data-selected]': {
    backgroundColor: '#20b0ae',
    color: '#fff',
  },
  '&[data-in-range]': {
    backgroundColor: '#e0ffff',
  },
  '&[data-range-start]': {
    backgroundColor: '#20b0ae',
    borderTopLeftRadius: '6px',
    borderBottomLeftRadius: '6px',
  },
  '&[data-range-end]': {
    backgroundColor: '#20b0ae',
    borderTopRightRadius: '6px',
    borderBottomRightRadius: '6px',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'default',
  },
  '&[data-today]::before': {
    content: '""',
    position: 'absolute',
    top: 2,
    left: 2,
    width: 6,
    height: 6,
    borderRadius: '100%',
    backgroundColor: '#ecce1f',
  },
  '&[data-first-week]': {
    borderTop: '1px solid rgba(0,20,80, 0.5)',
  },
  '&[data-last-week]': {
    borderBottom: '1px solid rgba(0,20,80, 0.5)',
  },
  '&[data-first-column]': {
    borderLeft: '1px solid rgba(0,20,80, 0.5)',
  },
  '&[data-last-column]': {
    borderRight: '1px solid rgba(0,20,80, 0.5)',
  },
  '&[data-day-first]': {
    borderLeft: '1px solid rgba(0,20,80, 0.5)',
    borderTopLeftRadius: '8px',
  },
  '&[data-day-last]': {
    borderRight: '1px solid rgba(0,20,80, 0.5)',
    borderBottomRightRadius: '8px',
  },

  // round the corners!
  '&[data-first-column][data-last-week]': {
    borderBottomLeftRadius: '8px',
  },
  '&[data-last-column][data-last-week]': {
    borderBottomRightRadius: '8px',
  },
  '&[data-first-column][data-first-week]': {
    borderTopLeftRadius: '8px',
  },
  '&[data-last-column][data-first-week]': {
    borderTopRightRadius: '8px',
  },

  '&[data-different-month]': {
    visibility: 'hidden',
  },
});

const StylizedMonthsLayout = styled('div', {
  display: 'grid',
  gridTemplateAreas:
    '"prevMonth leftMonth rightMonth nextMonth" "leftGrid leftGrid rightGrid rightGrid"',
  gridTemplateColumns: 'auto 1fr 1fr auto',
  gridTemplateRows: 'auto 1fr',
  gridGap: '1rem',
});

const StylizedMonthLabel = styled('label', {
  textAlign: 'center',
  fontWeight: 'bold',
});

const StylizedMonthButton = styled('button', {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '100%',
});

const StylizedDayLabel = styled('label', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8em',
});

const DayLabels = () => {
  return (
    <>
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
        <StylizedDayLabel key={index}>{day}</StylizedDayLabel>
      ))}
    </>
  );
};

export function StylizedExample({
  viewInfo: { month, year },
  setViewInfo,
  rangeValue,
  onRangeValueChange,
}: ExampleProps) {
  const onMonthChange = useCallback(
    ({ month: newMonth, year: newYear }: { month: number; year: number }) => {
      /**
       * Important UX consideration:
       *
       * since we are displaying 2 months at once, we don't
       * always want to change our view if the user's cursor
       * date moves from one month to another. Specifically,
       * if they move from the first visible month to the
       * second visible month, we don't need to change the view,
       * since they are still within the visible range.
       * So, we write logic to ignore that case!
       */
      if (newMonth === month + 1 && newYear === year) {
        return; // ignore movement from the first to the second frame
      }

      setViewInfo({
        month: newMonth,
        year: newYear,
      });
    },
    [setViewInfo, month, year]
  );

  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // used for the two-calendar demo
  const nextMonth = new Date(year, month + 1);
  const nextMonthLabel = nextMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const leftDays = useCalendarDayGrid(month, year);
  const rightDays = useCalendarDayGrid(month + 1, year);

  return (
    <Calendar
      displayMonth={month}
      displayYear={year}
      onDisplayChange={onMonthChange}
      rangeValue={rangeValue}
      onRangeChange={onRangeValueChange}
    >
      <StylizedMonthsLayout>
        <StylizedMonthButton
          css={{ gridArea: 'prevMonth' }}
          onClick={() => {
            setViewInfo((v) => ({ ...v, month: v.month - 1 }));
          }}
        >
          &lt;
        </StylizedMonthButton>
        <StylizedMonthButton
          css={{ gridArea: 'nextMonth' }}
          onClick={() => {
            setViewInfo((v) => ({ ...v, month: v.month + 1 }));
          }}
        >
          &gt;
        </StylizedMonthButton>
        <StylizedMonthLabel css={{ gridArea: 'leftMonth' }}>
          {monthLabel}
        </StylizedMonthLabel>
        <StylizedMonthLabel css={{ gridArea: 'rightMonth' }}>
          {nextMonthLabel}
        </StylizedMonthLabel>
        <StylizedCalendarGrid css={{ gridArea: 'leftGrid' }}>
          <DayLabels />
          {leftDays.map((value) => (
            <StylizedDay value={value} key={value.key} />
          ))}
        </StylizedCalendarGrid>
        <StylizedCalendarGrid css={{ gridArea: 'rightGrid' }}>
          <DayLabels />
          {rightDays.map((value) => (
            <StylizedDay value={value} key={value.key} />
          ))}
        </StylizedCalendarGrid>
      </StylizedMonthsLayout>
    </Calendar>
  );
}
