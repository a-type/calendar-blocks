import React, { FC, FocusEvent, forwardRef, HTMLAttributes, memo, MouseEvent, useCallback, useMemo } from 'react';

import { CalendarContextData, CalendarContextProvider } from './CalendarContext';
import { WeekDay } from './constants';
import { today } from './dateUtils';
import { isEventTargetDay } from './eventUtils';
import useCalendarSelection from './useCalendarSelection';

export type CalendarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'value' | 'onChange'
> & {
  /**
   * Called when the month / year of the calendar view is changed by the user
   */
  onDisplayChange?: (newValue: { month: number; year: number }) => any;
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
  /**
   * You can override the locale default week start day
   */
  weekStartsOn?: WeekDay;
};

const noop = () => {};
const defaultGetDateEnabled = () => true;

/**
 * An all-purpose Calendar primitive which manages day selection and various useful event callbacks.
 * Rendering is up to you; this component doesn't render any days or interactive elements - just a div
 * to help track focus within the component.
 * @public
 */
export const Calendar = forwardRef<any, CalendarProps>(
  (
    {
      value: providedValue,
      onChange,
      displayMonth: month,
      displayYear: year,
      onDisplayChange: onMonthChange = noop,
      rangeValue: providedRangeValue,
      onRangeChange,
      onRangeStartChange,
      getDateEnabled = defaultGetDateEnabled,
      defaultDate = today,
      onFocus,
      onBlur,
      weekStartsOn = WeekDay.Sunday,
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

    const [isFocusWithin, setIsFocusWithin] = React.useState(false);

    const context = useMemo<CalendarContextData>(
      () => ({
        setDay: onDaySelect,
        setDayHovered: onDayHover,
        highlightedDate,
        month,
        year,
        value,
        rangeValue,
        getDateEnabled,
        isFocusWithin,
        weekStartsOn,
      }),
      [
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
        isFocusWithin,
        weekStartsOn,
      ]
    );

    const handleRootFocus = useCallback(
      (ev: FocusEvent<HTMLDivElement>) => {
        // if a day element was focused, update context
        if (isEventTargetDay(ev)) {
          setIsFocusWithin(true);
        }
        onFocus?.(ev);
      },
      [onFocus]
    );
    const handleRootBlur = useCallback(
      (ev: FocusEvent<HTMLDivElement>) => {
        setIsFocusWithin(false);
        onBlur?.(ev);
      },
      [onBlur]
    );

    return (
      <CalendarContextProvider value={context}>
        <div
          {...restProps}
          {...props}
          onFocus={handleRootFocus}
          onBlur={handleRootBlur}
          ref={ref}
        />
      </CalendarContextProvider>
    );
  }
);

Calendar.displayName = 'Calendar';

/** @private docs only! */
export const DocsCalendar = (props: CalendarProps) => <Calendar {...props} />;
