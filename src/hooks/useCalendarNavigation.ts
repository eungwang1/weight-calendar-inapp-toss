import { useState, useCallback } from 'react';
import { getNextMonth, getPrevMonth } from '../utils/date';

export function useCalendarNavigation() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const goNext = useCallback(() => {
    const next = getNextMonth(year, month);
    setYear(next.year);
    setMonth(next.month);
  }, [year, month]);

  const goPrev = useCallback(() => {
    const prev = getPrevMonth(year, month);
    setYear(prev.year);
    setMonth(prev.month);
  }, [year, month]);

  return { year, month, goNext, goPrev };
}
