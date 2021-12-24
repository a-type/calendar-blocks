import { getMonthWeekdayOffset } from '.';
import { WeekDay } from './constants';
import { getIsLastRow } from './dateUtils';

describe('dateUtils', () => {
  describe('getIsLastRow', () => {
    test('identifies the last 2 days of January 2022', () => {
      let date = new Date(2022, 0, 29);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(false);
      date = new Date(2022, 0, 30);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(true);
      date = new Date(2022, 0, 31);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(true);
    });

    test('identifies the last 6 days of December 2021', () => {
      let date = new Date(2021, 11, 25);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(false);
      date = new Date(2021, 11, 26);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(true);
      date = new Date(2021, 11, 27);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(true);
      date = new Date(2021, 11, 28);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(true);
      date = new Date(2021, 11, 29);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(true);
      date = new Date(2021, 11, 30);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(true);
      date = new Date(2021, 11, 31);
      expect(getIsLastRow(date, WeekDay.Sunday)).toBe(true);
    });
  });

  describe('getMonthWeekdayOffset', () => {
    test('works with non-default week start', () => {
      expect(getMonthWeekdayOffset(11, 2021, WeekDay.Sunday)).toBe(3);
      expect(getMonthWeekdayOffset(11, 2021, WeekDay.Monday)).toBe(2);
      expect(getMonthWeekdayOffset(11, 2021, WeekDay.Saturday)).toBe(4);
    });
  });
});
