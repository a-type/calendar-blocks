import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import { addMonths, defaultGetDateEnabled, getDaysInMonth, isBefore, today } from './dateUtils';

type UseCalendarSelectionArgs = {
  /** The selected month of the calendar */
  month: number;
  /** The selected year of the calendar */
  year: number;
  /** Called when the selected month must change to accommodate date selection */
  onMonthChange: (newValue: { month: number; year: number }) => any;
  /** The currently selected day value. incompatible with `rangeValue` */
  value?: Date | null;
  /** Called when the currently selected day changes */
  onChange?: (value: Date | null) => any;
  /** The currently selected range of days. incompatible with `value` */
  rangeValue?: { start: Date | null; end: Date | null };
  /** Called when the currently selected range of days changes */
  onRangeChange?: (value: { start: Date | null; end: Date | null }) => any;
  /** Called when the user selects the first part of a date range */
  onRangeStartChange?: (value: Date) => any;
  /** A function used to determine whether a day can be selected */
  getDateEnabled?: (date: Date) => boolean;
  /** A fallback day to focus if no other information is available */
  defaultDate?: Date;
};

/**
 * Manages selection and focus state for the calendar grid control.
 *
 * Focus is managed using the 'roving tabindex' method, where the currently
 * selected day element is given a tabindex=0, while others are given -1.
 * This makes the only logically focusable element the currently selected
 * day, so when the user tabs away from the calendar and then comes back,
 * their cursor is back on the current day.
 */
export default ({
  onMonthChange,
  onChange,
  value = null,
  rangeValue,
  onRangeStartChange,
  onRangeChange,
  month,
  year,
  getDateEnabled = defaultGetDateEnabled,
  defaultDate = today,
  ...rest
}: UseCalendarSelectionArgs) => {
  if (!!rangeValue && !onRangeChange) {
    throw new Error('onRangeChange must be supplied if rangeValue is supplied');
  }
  if (!!rangeValue && value && process.env.NODE_ENV !== 'production') {
    console.warn(
      'You provided a value to useCalendarSelection in addition to a rangeValue. The value will be ignored in favor of the rangeValue. Remove value to avoid this warning.'
    );
  }

  const [selectedDate, setSelectedDate] = useState(
    (rangeValue && rangeValue.end) || value
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const highlightedDate = hoveredDate || selectedDate;

  const [pendingRangeStart, setPendingRangeStart] = useState<Date | null>(null);

  const handleKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      const currentDate = highlightedDate || defaultDate;
      let newDate = new Date(currentDate);
      if (ev.key === 'ArrowLeft') {
        newDate.setDate(newDate.getDate() - 1);
      } else if (ev.key === 'ArrowRight') {
        newDate.setDate(newDate.getDate() + 1);
      } else if (ev.key === 'ArrowUp') {
        newDate.setDate(newDate.getDate() - 7);
      } else if (ev.key === 'ArrowDown') {
        newDate.setDate(newDate.getDate() + 7);
      } else if (ev.key === 'PageUp') {
        if (ev.altKey) {
          newDate = addMonths(newDate, -12);
        } else {
          newDate = addMonths(newDate, -1);
        }
      } else if (ev.key === 'PageDown') {
        if (ev.altKey) {
          newDate = addMonths(newDate, 12);
        } else {
          newDate = addMonths(newDate, 1);
        }
      } else if (ev.key === 'Home') {
        newDate.setDate(newDate.getDate() - newDate.getDay());
      } else if (ev.key === 'End') {
        newDate.setDate(newDate.getDate() + 6 - newDate.getDay());
      } else {
        return;
      }

      ev.preventDefault();

      if (getDateEnabled(newDate)) {
        setSelectedDate(newDate);
        setHoveredDate(null);
        if (
          !highlightedDate ||
          newDate.getMonth() !== highlightedDate.getMonth() ||
          newDate.getFullYear() !== highlightedDate.getFullYear()
        ) {
          onMonthChange({
            month: newDate.getMonth(),
            year: newDate.getFullYear(),
          });
        }
      }
    },
    [highlightedDate, setSelectedDate, onMonthChange, getDateEnabled]
  );

  const previousMonthAndYear = useRef({ month, year });
  useEffect(() => {
    const {
      month: previousMonth,
      year: previousYear,
    } = previousMonthAndYear.current;

    // didn't actually change
    if (previousMonth === month && previousYear === year) {
      return;
    }

    const wentBackwards =
      (previousMonth > month && previousYear === year) || previousYear > year;
    if (
      selectedDate?.getMonth() !== month ||
      selectedDate?.getFullYear() !== year
    ) {
      setSelectedDate(
        new Date(year, month, wentBackwards ? getDaysInMonth(month, year) : 1)
      );
    }
    previousMonthAndYear.current = { month, year };
  }, [month, year, previousMonthAndYear]);

  const handleDaySelect = useCallback(
    (value: Date) => {
      if (!getDateEnabled(value)) {
        return;
      }

      setSelectedDate(value);

      if (!!rangeValue) {
        if (!pendingRangeStart) {
          // starting a range selection
          setPendingRangeStart(value);
          onRangeStartChange?.(value);
        } else {
          // ending a range selection and committing the result

          // reset range start selection flag
          setPendingRangeStart(null);

          // for range operations, we 'normalize' the selected values
          // to determine which one is earler, then inform the user of
          // the dates in the correct order

          if (isBefore(value, pendingRangeStart)) {
            // the values are inverted (the user selected backwards), so reverse them
            onRangeChange &&
              onRangeChange({ start: value, end: pendingRangeStart });
          } else {
            onRangeChange &&
              onRangeChange({ start: pendingRangeStart, end: value });
          }
        }
      } else {
        onChange && onChange(value);
      }
    },
    [
      onChange,
      !!rangeValue,
      setPendingRangeStart,
      pendingRangeStart,
      setSelectedDate,
      onRangeChange,
      getDateEnabled,
    ]
  );

  const handleDayHover = useCallback(
    (value: Date) => {
      setHoveredDate(value);
    },
    [setHoveredDate]
  );

  return {
    props: {
      onKeyDown: handleKeyDown,
    },
    highlightedDate,
    setHighlightedDate: setSelectedDate,
    onDaySelect: handleDaySelect,
    onDayHover: handleDayHover,
    onChange,
    onRangeChange,
    value,
    onMonthChange,
    month,
    year,
    rangeValue: !!pendingRangeStart
      ? { start: pendingRangeStart, end: highlightedDate }
      : rangeValue,
    ...rest,
  };
};
