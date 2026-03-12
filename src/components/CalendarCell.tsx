import clsx from 'clsx';
import type { DayRecord } from '../types';
import { haptic } from '../utils/haptic';
import style from './CalendarCell.module.css';

interface Props {
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  record?: DayRecord;
  onClick: (dateStr: string) => void;
}

export function CalendarCell({ day, dateStr, isCurrentMonth, isToday, record, onClick }: Props) {
  return (
    <div
      className={clsx(
        style.cell,
        !isCurrentMonth && style.otherMonth,
        isToday && style.today
      )}
      onClick={() => { haptic('tap'); onClick(dateStr); }}
    >
      <span className={style.dayNumber}>{day}</span>
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
