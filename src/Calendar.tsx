import React, { FC, FocusEvent, forwardRef, HTMLAttributes, memo, MouseEvent, useCallback, useMemo } from 'react';

import { CalendarContextData, CalendarContextProvider } from './CalendarContext';
import { defaultGetDateEnabled, today } from './dateUtils';
import useCalendarSelection from './useCalendarSelection';

export type CalendarRenderProps = {
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
};

export type CalendarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'value' | 'onChange'
> & {
  /**
   * Called when the month / year of the calendar view is changed by the user
   */
  onDisplayChange: (newValue: { month: number; year: number }) => any;
  /**
   * The year to display in the calendar view
   */
  displayYear: number;
  /**
   * The month to display in the calendar view
   */
  displayMonth: number;
  /**
   * The selected date value, if any. If you want to use range selection, use
   * rangeValue instead.
   */
  value?: Date | null;
  /**
   * Called when the user selects a new date. Will not be called if the month
   * view is changed; only on the selection of a specific day. If you want to use
   * range selection, use onRangeChange instead.
   */
  onChange?: (value: Date | null) => any;
  /**
   * Provide rangeValue instead of value to enable ranged mode. See onRangeChange, also.
   */
  rangeValue?: { start: Date | null; end: Date | null };
  /**
   * Change handler for range mode. See rangeValue, also.
   */
  onRangeChange?: (range: { start: Date | null; end: Date | null }) => any;
  /**
   * Change handler for when the user selects the starting date in a range.
   */
  onRangeStartChange?: (range: Date) => any;
  /**
   * Allows disabling specific dates. Note that disabled dates can still
   * be included within a selected range. If you want to omit disabled
   * dates from your range, you must encode that into your app's logic
   * when processing the final field value.
   */
  getDateEnabled?: (date: Date) => boolean;
  /**
   * change the default highlighted date if the field has no value
   * and becomes focused. Defaults to today.
   */
  defaultDate?: Date;
};

/**
 * An all-purpose Calendar primitive which manages day selection, rendering the right
 * days for a given month, and various useful event callbacks. Rendering is fully
 * overrideable, allowing you to create your own visual implementation of the
 * final Calendar view. The default will use CalendarDayGrid.
 * @public
 */
export const Calendar = forwardRef<any, CalendarProps>(
  (
    {
      value: providedValue,
      onChange,
      displayMonth: month,
      displayYear: year,
      onDisplayChange: onMonthChange,
      rangeValue: providedRangeValue,
      onRangeChange,
      onRangeStartChange,
      getDateEnabled = defaultGetDateEnabled,
      defaultDate = today,
      ...restProps
    },
    ref
  ) => {
    const {
      props,
      highlightedDate,
      onDaySelect,
      onDayHover,
      rangeValue,
      value,
      setHighlightedDate,
    } = useCalendarSelection({
      value: providedValue,
      onChange,
      onMonthChange,
      month,
      year,
      rangeValue: providedRangeValue,
      onRangeChange,
      onRangeStartChange,
      getDateEnabled,
      defaultDate,
    });

    const handleDayClick = useCallback(
      (_ev: any, value: Date) => {
        onDaySelect(value);
      },
      [onDaySelect]
    );

    const handleDayHover = useCallback(
      (_ev: any, value: Date) => {
        onDayHover(value);
      },
      [onDayHover]
    );

    const context = useMemo<CalendarContextData>(
      () => ({
        onDayClick: handleDayClick,
        setDay: onDaySelect,
        onDayHover: handleDayHover,
        setDayHovered: onDayHover,
        highlightedDate,
        month,
        year,
        value,
        rangeValue,
        getDateEnabled,
      }),
      [
        handleDayClick,
        handleDayHover,
        highlightedDate,
        month,
        onDayHover,
        onDaySelect,
        onMonthChange,
        onRangeChange,
        onRangeStartChange,
        rangeValue,
        setHighlightedDate,
        year,
        value,
        getDateEnabled,
      ]
    );

    const noValueHighlighted = !highlightedDate;

    const handleRootFocus = useCallback(
      (ev: FocusEvent) => {
        // only if the root itself was the target of the focus event
        if (ev.target === ev.currentTarget) {
          if (!getDateEnabled(defaultDate)) {
            console.warn(
              'Violation: the defaultDate value is not an enabled date. This breaks selection logic!'
            );
          }
          setHighlightedDate(defaultDate);
        }
      },
      [defaultDate, setHighlightedDate, getDateEnabled]
    );

    return (
      <CalendarContextProvider value={context}>
        <div
          {...restProps}
          {...props}
          tabIndex={noValueHighlighted ? 0 : -1}
          onFocus={handleRootFocus}
          ref={ref}
        />
      </CalendarContextProvider>
    );
  }
);

Calendar.displayName = 'Calendar';

/** @private docs only! */
export const DocsCalendar = (props: CalendarProps) => <Calendar {...props} />;
