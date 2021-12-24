import { SetStateAction } from 'react';

export interface ExampleProps {
  viewInfo: { month: number; year: number };
  setViewInfo: (
    action: SetStateAction<{ month: number; year: number }>
  ) => void;
  rangeValue: { start: Date | null; end: Date | null };
  onRangeValueChange: (value: { start: Date | null; end: Date | null }) => void;
}
