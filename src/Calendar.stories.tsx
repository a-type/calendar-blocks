import { styled } from '@stitches/react';
import React, { useCallback, useState } from 'react';

import { Calendar } from './Calendar';
import { CalendarDay } from './CalendarDay';
import { useCalendarDayGrid } from './useCalendarDayGrid';

export default {
  title: 'Calendar',
  component: Calendar,
};

const now = new Date();

/** Custom styling of primitive components */
const StyledDay = styled(CalendarDay, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  transition: '0.2s ease all',
  cursor: 'pointer',

  '&[data-selected]': {
    backgroundColor: 'black',
    color: '#fff',
  },
  '&[data-in-range]': {
    backgroundColor: '#fff',
  },
  '&[data-range-start]': {
    backgroundColor: 'black',
    color: '#fff',
  },
  '&[data-range-end]': {
    backgroundColor: 'black',
    color: '#fff',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'default',
  },
  '&[data-different-month]': {
    visibility: 'hidden',
  },
});

const StyledGrid = styled('div', {
  display: 'grid',
  gridGap: '4px',
  gridTemplateColumns: 'repeat(7, 32px)',
  gridAutoRows: '32px',
});

export const simple = () => {
  const [{ month, year }, setViewInfo] = useState<{
    month: number;
    year: number;
  }>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [value, setValue] = useState<Date | null>(null);

  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days = useCalendarDayGrid(month, year);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
    >
      <p>
        A Calendar is a logical input primitive which allows selecting a single
        day or range of days from a particular month
      </p>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setViewInfo((v) => ({ ...v, month: v.month - 1 }))}
          >
            &lt;
          </button>
          <span style={{ margin: '0 4px' }}>{monthLabel}</span>
          <button
            onClick={() => setViewInfo((v) => ({ ...v, month: v.month + 1 }))}
          >
            &gt;
          </button>
        </div>
        <Calendar
          displayMonth={month}
          displayYear={year}
          value={value}
          onChange={setValue}
          onDisplayChange={setViewInfo}
        >
          <StyledGrid>
            {days.map((value) => (
              <StyledDay value={value} key={value.key} />
            ))}
          </StyledGrid>
        </Calendar>
      </div>
      <p>Selected date: {value?.toLocaleDateString() ?? 'none'}</p>
    </div>
  );
};

export const range = () => {
  const [{ month, year }, setViewInfo] = useState<{
    month: number;
    year: number;
  }>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [rangeValue, setRangeValue] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days = useCalendarDayGrid(month, year);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
    >
      <p>A Calendar can select a range of dates as well</p>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setViewInfo((v) => ({ ...v, month: v.month - 1 }))}
          >
            &lt;
          </button>
          <span style={{ margin: '0 4px' }}>{monthLabel}</span>
          <button
            onClick={() => setViewInfo((v) => ({ ...v, month: v.month + 1 }))}
          >
            &gt;
          </button>
        </div>
        <Calendar
          displayMonth={month}
          displayYear={year}
          onDisplayChange={setViewInfo}
          rangeValue={rangeValue}
          onRangeChange={setRangeValue}
        >
          <StyledGrid>
            {days.map((value) => (
              <StyledDay value={value} key={value.key} />
            ))}
          </StyledGrid>
        </Calendar>
      </div>
      <p>
        Selected dates: {rangeValue.start?.toLocaleDateString()} -{' '}
        {rangeValue.end?.toLocaleDateString()}
      </p>
    </div>
  );
};

export const dayLabels = () => {
  const [{ month, year }, setViewInfo] = useState<{
    month: number;
    year: number;
  }>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [value, setValue] = useState<Date | null>(null);

  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days = useCalendarDayGrid(month, year);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
    >
      <p>
        Rendering is completely within your control - once you have a basic
        grid, you're free to add additional rendered stuff, like traditional day
        labels.
      </p>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setViewInfo((v) => ({ ...v, month: v.month - 1 }))}
          >
            &lt;
          </button>
          <span style={{ margin: '0 4px' }}>{monthLabel}</span>
          <button
            onClick={() => setViewInfo((v) => ({ ...v, month: v.month + 1 }))}
          >
            &gt;
          </button>
        </div>
        <Calendar
          displayMonth={month}
          displayYear={year}
          value={value}
          onChange={setValue}
          onDisplayChange={setViewInfo}
        >
          <StyledGrid>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                key={idx}
              >
                {day}
              </div>
            ))}
            {days.map((value) => (
              <StyledDay value={value} key={value.key} />
            ))}
          </StyledGrid>
        </Calendar>
      </div>
      <p>Selected date: {value?.toLocaleDateString() ?? 'none'}</p>
    </div>
  );
};

export const wideRange = () => {
  const [{ month, year }, setViewInfo] = useState<{
    month: number;
    year: number;
  }>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [rangeValue, setRangeValue] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

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
    <>
      <p>
        It's relatively trivial to synchronize two calendars to display a larger
        selection range by utilizing a render prop to change how the calendar
        state is displayed
      </p>
      <Calendar
        displayMonth={month}
        displayYear={year}
        onDisplayChange={onMonthChange}
        rangeValue={rangeValue}
        onRangeChange={setRangeValue}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() =>
                  setViewInfo((v) => ({ ...v, month: v.month - 1 }))
                }
              >
                &lt;
              </button>
              <span style={{ margin: '0 auto 0 auto' }}>{monthLabel}</span>
            </div>
            <StyledGrid>
              {leftDays.map((value) => (
                <StyledDay value={value} key={value.key} />
              ))}
            </StyledGrid>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span style={{ margin: '0 auto 0 auto' }}>{nextMonthLabel}</span>
              <button
                onClick={() =>
                  setViewInfo((v) => ({ ...v, month: v.month + 1 }))
                }
              >
                &gt;
              </button>
            </div>
            <StyledGrid>
              {rightDays.map((value) => (
                <StyledDay value={value} key={value.key} />
              ))}
            </StyledGrid>
          </div>
        </div>
      </Calendar>
    </>
  );
};

export const disabledDays = () => {
  const [{ month, year }, setViewInfo] = useState<{
    month: number;
    year: number;
  }>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [value, setValue] = useState<Date | null>(null);

  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // example: disable next week
  const nextWeekEnds = new Date(year, month, now.getDate() + 14);
  const getDateEnabled = useCallback((date: Date) => {
    return !(
      date.getTime() >= now.getTime() && date.getTime() < nextWeekEnds.getTime()
    );
  }, []);

  const days = useCalendarDayGrid(month, year);

  return (
    <>
      <p>
        Days or ranges of days can be disabled using the "getDateEnabled" prop
      </p>
      <div>
        <span>{monthLabel}</span>
        <Calendar
          displayMonth={month}
          displayYear={year}
          value={value}
          onChange={setValue}
          onDisplayChange={setViewInfo}
          getDateEnabled={getDateEnabled}
        >
          <StyledGrid>
            {days.map((value) => (
              <StyledDay value={value} key={value.key} />
            ))}
          </StyledGrid>
        </Calendar>
      </div>
    </>
  );
};

/**
 * Stylized examples
 */

const StylizedGrid = styled(StyledGrid, {
  gridGap: 0,
});

const StylizedDay = styled(StyledDay, {
  border: '1px solid transparent',
  backgroundColor: 'transparent',

  borderRadius: 0,
  // border collapse
  marginRight: -1,
  marginBottom: -1,
  // keep above blank days
  position: 'relative',

  '&[data-weekend]': {
    backgroundColor: '#fafaff',
  },
  '&[data-highlighted]': {
    backgroundColor: '#e5efee',
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
  '&[data-today]': {
    boxShadow: '0 0 0 2px #ecce1f',
    zIndex: 1,
  },
  '&[data-first-week]': {
    borderTop: '1px solid #000',
  },
  '&[data-last-week]': {
    borderBottom: '1px solid #000',
  },
  '&[data-first-column]': {
    borderLeft: '1px solid #000',
  },
  '&[data-last-column]': {
    borderRight: '1px solid #000',
  },
  '&[data-day-first]': {
    borderLeft: '1px solid #000',
  },
  '&[data-day-last]': {
    borderRight: '1px solid #000',
  },
});

export const stylized = () => {
  const [{ month, year }, setViewInfo] = useState<{
    month: number;
    year: number;
  }>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [rangeValue, setRangeValue] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

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
    <>
      <p>
        Calendar day elements receive plenty of data attributes which let you
        implement advanced styling based on their visual or temporal position.
      </p>
      <Calendar
        displayMonth={month}
        displayYear={year}
        onDisplayChange={onMonthChange}
        rangeValue={rangeValue}
        onRangeChange={setRangeValue}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '8px' }}>
            <span>{monthLabel}</span>
            <StylizedGrid>
              {leftDays.map((value) => (
                <StylizedDay value={value} key={value.key} />
              ))}
            </StylizedGrid>
          </div>
          <div>
            <span>{nextMonthLabel}</span>
            <StylizedGrid>
              {rightDays.map((value) => (
                <StylizedDay value={value} key={value.key} />
              ))}
            </StylizedGrid>
          </div>
        </div>
      </Calendar>
    </>
  );
};
