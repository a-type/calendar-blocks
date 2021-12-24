import React, { FC, forwardRef, HTMLAttributes, MouseEvent, useCallback, useEffect, useRef } from 'react';

import { useCalendarContext } from './CalendarContext';
import { VALUE_DATA_ATTRIBUTE } from './constants';
import { serializeDateValue } from './dataAttributeUtils';
import {
  getIsFirstRow,
  getIsFirstWeek,
  getIsLastRow,
  getIsLastWeek,
  getIsWeekend,
  isBefore,
  isBetweenDays,
  isSameDay,
} from './dateUtils';
import useCombinedRef from './useCombinedRef';

export interface CalendarDayProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'value' | 'onClick'> {
  /** the day this calendar day box represents */
  value: { date: Date; isDifferentMonth?: boolean };
  /** called when the user clicks the day box */
  onClick?: (ev: MouseEvent<HTMLButtonElement>, value: Date) => any;
  disabled?: boolean;
}

/** the basic props needed for each day element */
const useDayProps = (value: Date, isDifferentMonth: boolean) => {
  const {
    value: selectedValue,
    highlightedDate,
    rangeValue,
    isFocusWithin,
    getDateEnabled,
  } = useCalendarContext();

  const attributes = {
    [VALUE_DATA_ATTRIBUTE]: serializeDateValue(value),
    'aria-label': value.toDateString(),
    'data-date-number': value.getDate(),
    'data-day-number': value.getDay(),
  } as Record<string, any>;

  const firstDay = new Date(value.getFullYear(), value.getMonth(), 1);
  const lastDay = new Date(value.getFullYear(), value.getMonth() + 1, 0);
  const isRangeReversed =
    rangeValue && isBefore(rangeValue.end, rangeValue.start);

  if (isDifferentMonth) {
    attributes['data-different-month'] = true;
  } else {
    // these attributes aren't assigned to days
    // rendered in a grid for a different month
    if (isSameDay(value, firstDay)) {
      attributes['data-day-first'] = true;
    }
    if (isSameDay(value, lastDay)) {
      attributes['data-day-last'] = true;
    }
    if (getIsFirstRow(value)) {
      attributes['data-first-row'] = true;
    }
    if (getIsLastRow(value)) {
      attributes['data-last-row'] = true;
    }
    if (getIsFirstWeek(value)) {
      attributes['data-first-week'] = true;
    }
    if (getIsLastWeek(value)) {
      attributes['data-last-week'] = true;
    }
    if (value.getDay() === 0) {
      attributes['data-first-column'] = true;
    }
    if (value.getDay() === 6) {
      attributes['data-last-column'] = true;
    }
    if (isSameDay(value, new Date())) {
      attributes['data-today'] = true;
    }
  }
  if (!getDateEnabled(value)) {
    attributes['data-disabled'] = true;
    attributes['aria-disabled'] = true;
  }
  if (getIsWeekend(value)) {
    attributes['data-weekend'] = true;
  }

  if (selectedValue && isSameDay(value, selectedValue)) {
    attributes['data-selected'] = true;
  }

  if (isSameDay(value, highlightedDate)) {
    if (isFocusWithin) {
      attributes['data-highlighted'] = true;
    } else {
      attributes['data-highlighted-inactive'] = true;
    }
  }

  if (!!rangeValue && isSameDay(value, rangeValue.start)) {
    if (isRangeReversed) {
      attributes['data-range-end'] = true;
    } else {
      attributes['data-range-start'] = true;
    }
  }
  if (!!rangeValue && isSameDay(value, rangeValue.end)) {
    if (isRangeReversed) {
      attributes['data-range-start'] = true;
    } else {
      attributes['data-range-end'] = true;
    }
  }
  if (!!rangeValue && isBetweenDays(value, rangeValue.start, rangeValue.end)) {
    attributes['data-in-range'] = true;
  }

  return attributes;
};

/**
 * Renders a single day in a calendar. The proper rendering of a day depends on the presence
 * of a wrapping Calendar component. This component renders an unstyled <button> with a
 * variety of attributes you can use to style the day. It automatically reports interactions
 * to the parent Calendar context; there's no need to add your own event handlers to achieve
 * functionality.
 * @public
 */
export const CalendarDay = forwardRef<HTMLButtonElement, CalendarDayProps>(
  (
    {
      onClick,
      onMouseEnter,
      onMouseLeave,
      value: { date, isDifferentMonth = false },
      children,
      disabled = isDifferentMonth,
      ...restProps
    },
    ref
  ) => {
    const {
      setDay,
      setDayHovered,
      getDateEnabled,
      isFocusWithin,
      highlightedDate,
    } = useCalendarContext();

    const highlighted = isSameDay(date, highlightedDate);

    const handleClick = useCallback(
      (ev: MouseEvent<HTMLButtonElement>) => {
        setDay(date);
        onClick?.(ev, date);
      },
      [date, onClick, setDay]
    );
    const handleHover = useCallback(
      (ev: MouseEvent<HTMLButtonElement>) => {
        const successfulHover = setDayHovered(date);
        if (!successfulHover) {
          (ev.target as HTMLElement).setAttribute('data-invalid-hover', '');
        }
        onMouseEnter?.(ev);
      },
      [date, onMouseEnter, setDayHovered]
    );
    const handleUnhover = useCallback(
      (ev: MouseEvent<HTMLButtonElement>) => {
        (ev.target as HTMLElement).removeAttribute('data-invalid-hover');
        onMouseLeave?.(ev);
      },
      [onMouseLeave]
    );
    const dayProps = useDayProps(date, isDifferentMonth);

    const privateRef = useRef<Element | null>(null);
    const combinedRef = useCombinedRef<Element | null>(ref, privateRef);

    // auto-focus when highlighted and calendar is focused - this
    // moves focus from day to day as the user navigates
    const shouldAutoFocus = highlighted && isFocusWithin;
    useEffect(() => {
      if (shouldAutoFocus) {
        privateRef.current && (privateRef.current as HTMLElement).focus();
      }
    }, [shouldAutoFocus]);

    return (
      <button
        ref={combinedRef as any}
        onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={handleUnhover}
        tabIndex={highlighted ? 0 : -1}
        disabled={!getDateEnabled(date) || disabled}
        {...dayProps}
        {...restProps}
      >
        {children || date.getDate()}
      </button>
    );
  }
);

CalendarDay.displayName = 'CalendarDay';

/** @private docs only! */
export const DocsCalendarDay = (props: CalendarDayProps) => (
  <CalendarDay {...props} />
);
