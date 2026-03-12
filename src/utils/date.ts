import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  subWeeks,
  isSameMonth,
  isSameDay,
  getDay,
} from 'date-fns';

export function getCalendarDays(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calStart, end: calEnd }).map((day) => ({
    date: day,
    dateStr: format(day, 'yyyy-MM-dd'),
    dayOfMonth: day.getDate(),
    isCurrentMonth: isSameMonth(day, date),
    isToday: isSameDay(day, new Date()),
    dayOfWeek: getDay(day),
  }));
}

export function formatMonthTitle(year: number, month: number): string {
  return `${year}년 ${month}월`;
}

export function getNextMonth(year: number, month: number) {
  const d = addMonths(new Date(year, month - 1, 1), 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function getPrevMonth(year: number, month: number) {
  const d = subMonths(new Date(year, month - 1, 1), 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function getDayLabel(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const d = new Date(dateStr);
  return days[d.getDay()]!;
}

export function getDateRangeForPeriod(
  period: '1week' | '1month' | '3months'
): { start: Date; end: Date } {
  const end = new Date();
  let start: Date;
  switch (period) {
    case '1week':
      start = subWeeks(end, 1);
      break;
    case '1month':
      start = subMonths(end, 1);
      break;
    case '3months':
      start = subMonths(end, 3);
      break;
  }
  return { start, end };
}

export { format };
