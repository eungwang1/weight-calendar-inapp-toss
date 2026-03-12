import clsx from 'clsx';
import type { DayRecord } from '../types';
import { haptic } from '../utils/haptic';
import style from './CalendarCell.module.css';

interface Props {
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  isSelected: boolean;
  record?: DayRecord;
  onClick: (dateStr: string) => void;
}

export function CalendarCell({ day, dateStr, isCurrentMonth, isToday, isFuture, isSelected, record, onClick }: Props) {
  return (
    <div
      className={clsx(
        style.cell,
        !isCurrentMonth && style.otherMonth,
        isFuture && isCurrentMonth && style.future,
        isSelected && style.selected
      )}
      onClick={() => { haptic('tap'); onClick(dateStr); }}
    >
      <span className={clsx(style.dayNumber, (isToday || isSelected) && style.dayCircle, isSelected ? style.selectedCircle : isToday && style.todayCircle)}>{day}</span>
      <div className={style.labels}>
        {record?.morning && (
          <span className={style.morningLabel}>{record.morning.weight.toFixed(1)}</span>
        )}
        {record?.evening && (
          <span className={style.eveningLabel}>{record.evening.weight.toFixed(1)}</span>
        )}
      </div>
    </div>
  );
}
