import { styled } from '@stitches/react';
import React, { useCallback, useState } from 'react';

import { Calendar, CalendarDay, CalendarDays } from '../../../src';
import { ExampleProps } from './types';

const DetailedCalendar = styled(Calendar, {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 80px)',
  gridAutoRows: '60px',
  gridGap: '3px',
  // it's good practice to prevent page jumping when switching to a month
  // with more rows...
  height: 'calc(63px * 7)',
});

const DetailedMonthLabel = styled('label', {
  fontSize: '1.5rem',
});

const DetailedDay = styled(CalendarDay, {
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
  border: '1px solid #e0e0e0',
  cursor: 'pointer',
  position: 'relative',

  '&::before': {
    content: 'attr(data-date-number)',
  },
  '&[data-today]::before': {
    content: '"Today"',
  },
  '&:focus': {
    outline: 'none',
  },
  '&[data-highlighted]': {
    zIndex: 1,
    boxShadow: '0 0 0 1px #ffc107',
  },
  '&[data-selected]': {
    backgroundColor: '#f5f5f5',
  },
  '&[data-in-range], &[data-range-start], &[data-range-end]': {
    backgroundColor: '#f5f5f5',
  },

  '&[data-invalid-hover]': {
    cursor: 'not-allowed',
  },

  '&[data-different-month]': {
    opacity: 0.5,
  },

  '&[data-disabled]::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(to top left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) calc(50% - 0.8px),
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0) calc(50% + 0.8px),
      rgba(0, 0, 0, 0) 100%),
      linear-gradient(to top right,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) calc(50% - 0.8px),
        rgba(0, 0, 0, 0.2) 50%,
        rgba(0, 0, 0, 0) calc(50% + 0.8px),
        rgba(0, 0, 0, 0) 100%)`,
  },
});

const DetailedDayLabel = styled('label', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8em',
});

const DayLabels = () => {
  return (
    <>
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
        <DetailedDayLabel key={index}>{day}</DetailedDayLabel>
      ))}
    </>
  );
};

const DetailedMonthButton = styled('button', {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
});

export function DetailedExample({
  viewInfo: { month, year },
  setViewInfo,
  rangeValue,
  onRangeValueChange,
}: ExampleProps) {
  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  // disable weekends
  const getDateEnabled = useCallback((date: Date) => {
    return date.getDay() !== 0 && date.getDay() !== 6;
  }, []);

  return (
    <div>
      <DetailedMonthLabel>
        <DetailedMonthButton
          onClick={() => setViewInfo({ month: month - 1, year })}
        >
          &lt;
        </DetailedMonthButton>
        {monthLabel}
        <DetailedMonthButton
          onClick={() => setViewInfo({ month: month + 1, year })}
        >
          &gt;
        </DetailedMonthButton>
      </DetailedMonthLabel>
      <DetailedCalendar
        displayMonth={month}
        displayYear={year}
        onDisplayChange={setViewInfo}
        rangeValue={rangeValue}
        onRangeChange={onRangeValueChange}
        getDateEnabled={getDateEnabled}
      >
        <DayLabels />
        <CalendarDays>
          {(value) => (
            <DetailedDay value={value} key={value.key}>
              <DetailedDayContents value={value.date} />
            </DetailedDay>
          )}
        </CalendarDays>
      </DetailedCalendar>
    </div>
  );
}

const eventColors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
];

function generateFakeEvents() {
  const numEvents = Math.floor(Math.random() * 5);
  return new Array(numEvents).fill(null).map(() => ({
    color: eventColors[Math.floor(Math.random() * eventColors.length)],
  }));
}

function DetailedDayContents({ value }: { value: Date }) {
  // randomly add a fake event
  const [events] = useState(generateFakeEvents);

  return (
    <DayEventGrid>
      {events.map((event, index) => (
        <DayEventDot key={index} css={{ backgroundColor: event.color }} />
      ))}
    </DayEventGrid>
  );
}

const DayEventGrid = styled('div', {
  width: '100%',
  marginTop: '4px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, 20px)',
  gridAutoRows: '20px',
});

const DayEventDot = styled('div', {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
});
