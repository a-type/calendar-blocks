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
  isBetweenDays,
  isSameDay,
} from './dateUtils';
import useCombinedRef from './useCombinedRef';

export interface CalendarDayProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'value' | 'onClick'> {
  /** the day this calendar day box represents */
  value: Date;
  /** called when the user clicks the day box */
  onClick?: (ev: MouseEvent<HTMLButtonElement>, value: Date) => any;
  /** called when the user hovers the day box */
  onHover?: (ev: MouseEvent<HTMLButtonElement>, value: Date) => any;
}

/** the basic props needed for each day element */
const useDayProps = (value: Date) => {
  const {
    value: selectedValue,
    highlightedDate,
    rangeValue,
  } = useCalendarContext();

  const attributes = {
    [VALUE_DATA_ATTRIBUTE]: serializeDateValue(value),
    'aria-label': value.toDateString(),
    'data-date-number': value.getDate(),
    'data-day-number': value.getDay(),
  } as Record<string, any>;

  const firstDay = new Date(value.getFullYear(), value.getMonth(), 1);
  const lastDay = new Date(value.getFullYear(), value.getMonth() + 1, 0);

  if (isSameDay(value, firstDay)) {
    attributes['data-day-first'] = true;
  }
  if (isSameDay(value, lastDay)) {
    attributes['data-day-last'] = true;
  }
  if (getIsFirstRow(value)) {
    attributes['data-top-row'] = true;
  }
  if (getIsLastRow(value)) {
    attributes['data-bottom-row'] = true;
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
  if (getIsWeekend(value)) {
    attributes['data-weekend'] = true;
  }

  if (selectedValue && isSameDay(value, selectedValue)) {
    attributes['data-selected'] = true;
  }

  if (isSameDay(value, highlightedDate)) {
    attributes['data-highlighted'] = true;
  }

  if (!!rangeValue && isSameDay(value, rangeValue.start)) {
    attributes['data-range-start'] = true;
  }
  if (!!rangeValue && isSameDay(value, rangeValue.end)) {
    attributes['data-range-end'] = true;
  }
  if (!!rangeValue && isBetweenDays(value, rangeValue.start, rangeValue.end)) {
    attributes['data-in-range'] = true;
  }
  if (isSameDay(value, new Date())) {
    attributes['data-today'] = true;
  }

  return attributes;
};

/**
 * Renders a single day in a CalendarDayGrid. The proper rendering of a single CalendarDay
 * must be coordinated within the larger CalendarDayGrid component.
 * @public
 */
export const CalendarDay = forwardRef<any, CalendarDayProps>(
  ({ onClick, onHover, value, children, ...restProps }, ref) => {
    const { onDayClick, onDayHover, getDateEnabled } = useCalendarContext();

    const handleClick = useCallback(
      (ev: MouseEvent<HTMLButtonElement>) => {
        onDayClick(ev, value);
        onClick?.(ev, value);
      },
      [value, onClick, onDayClick]
    );
    const handleHover = useCallback(
      (ev: MouseEvent<HTMLButtonElement>) => {
        onDayHover(ev, value);
        onHover?.(ev, value);
      },
      [value, onHover, onDayHover]
    );
    const dayProps = useDayProps(value);
    const highlighted = dayProps['data-highlighted'];

    const privateRef = useRef<Element | null>(null);
    const combinedRef = useCombinedRef<Element | null>(ref, privateRef);

    // auto-focus when highlighted
    useEffect(() => {
      if (highlighted) {
        privateRef.current && (privateRef.current as HTMLElement).focus();
      }
    }, [highlighted]);

    return (
      <button
        ref={combinedRef as any}
        onClick={handleClick}
        onMouseEnter={handleHover}
        tabIndex={highlighted ? 0 : -1}
        disabled={!getDateEnabled(value)}
        {...dayProps}
        {...restProps}
      >
        {children || value.getDate()}
      </button>
    );
  }
);

CalendarDay.displayName = 'CalendarDay';

/** @private docs only! */
export const DocsCalendarDay = (props: CalendarDayProps) => (
  <CalendarDay {...props} />
);
