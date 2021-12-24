import { styled } from '@stitches/react';
import React, { useCallback, useMemo } from 'react';
import { FixedSizeGrid } from 'react-window';

import { Calendar, CalendarDay, useCalendarDay } from '../../../src';
import { ExampleProps } from './types';

const DAY_SIZE = 48;
const VIEWPORT_WIDTH = 7 * (DAY_SIZE + 2) + 1;
const VIEWPORT_HEIGHT = 6 * (DAY_SIZE + 2);

const ScrollingCalendar = styled(Calendar, {});

const ScrollingCalendarDay = styled(CalendarDay, {
  border: '1px solid transparent',
  backgroundColor: 'transparent',

  borderRadius: 0,
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
    outline: 'black auto 1px',
  },
  '&[data-selected]': {
    backgroundColor: 'black',
    color: 'white',
  },
  '&[data-in-range]': {
    backgroundColor: 'black',
    color: 'white',
  },
  '&[data-range-start]': {
    backgroundColor: 'black',
    color: 'white',
  },
  '&[data-range-end]': {
    backgroundColor: 'black',
    color: 'white',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'default',
  },
  '&[data-first-week]': {
    borderTop: '1px solid rgba(0,20,80, 0.5)',
  },
  '&[data-day-first]:not([data-first-column])': {
    borderLeft: '1px solid rgba(0,20,80, 0.5)',
  },
});

function getMonthLabel(month: number, year: number) {
  const date = new Date(year, month);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export function ScrollingExample({
  rangeValue,
  onRangeValueChange,
}: ExampleProps) {
  // rather than using dynamic display values, for this scrolling list example
  // we always start from today's month.
  const { month, year } = useMemo(() => {
    const today = new Date();
    return {
      month: today.getMonth(),
      year: today.getFullYear(),
    };
  }, []);

  const [monthLabel, setMonthLabel] = React.useState(() =>
    getMonthLabel(month, year)
  );

  /**
   * These two callbacks help keep the month label in sync.
   *
   * The first one responds to keyboard interaction which moves the highlighted
   * date - this is a fine-grained way to ensure when the user has a date highlighted,
   * the month label always matches it regardless of scroll position.
   */
  const handleDisplayChange = useCallback(
    ({ month, year }: { month: number; year: number }) => {
      setMonthLabel(getMonthLabel(month, year));
    },
    []
  );
  /**
   * The second one responds to scrolling of the windowed list, computing
   * the estimated month based on total scroll offset.
   */
  const handleScroll = useCallback(
    ({ scrollTop }: { scrollTop: number }) => {
      // compute current month from the scroll position

      // add 1 row to start showing the month before it fully
      // reaches the top of the viewport
      const rowsFromTop = Math.floor(scrollTop / DAY_SIZE) + 1;
      const daysFromTop = rowsFromTop * 7;
      const topDay = new Date(year, month, 1 + daysFromTop);

      setMonthLabel(getMonthLabel(topDay.getMonth(), topDay.getFullYear()));
    },
    [month, year]
  );

  return (
    <div>
      <h2>{monthLabel}</h2>
      <ScrollingCalendar
        displayMonth={month}
        displayYear={year}
        onDisplayChange={handleDisplayChange}
        rangeValue={rangeValue}
        onRangeChange={onRangeValueChange}
      >
        <FixedSizeGrid
          columnCount={7}
          columnWidth={DAY_SIZE}
          rowCount={1000}
          rowHeight={DAY_SIZE}
          height={VIEWPORT_HEIGHT}
          width={VIEWPORT_WIDTH}
          onScroll={handleScroll}
        >
          {ScrollingCalendarGridCell}
        </FixedSizeGrid>
      </ScrollingCalendar>
    </div>
  );
}

function ScrollingCalendarGridCell({
  columnIndex,
  rowIndex,
  style,
}: {
  columnIndex: number;
  rowIndex: number;
  style: any;
}) {
  // get the date by the offset from
  // the start of the calendar
  const gridOffset = columnIndex + rowIndex * 7;
  const value = useCalendarDay(gridOffset);
  // turn of 'different month' - it doesn't
  // mean much in this context
  const scrollingValue = useMemo(
    () => ({
      ...value,
      isDifferentMonth: false,
    }),
    [value]
  );

  return <ScrollingCalendarDay style={style} value={scrollingValue} />;
}
