import clsx from 'clsx';
import type { PeriodType } from '../types';
import style from './PeriodToggle.module.css';

interface Props {
  period: PeriodType;
  onChange: (period: PeriodType) => void;
}

const OPTIONS: { value: PeriodType; label: string }[] = [
  { value: '1week', label: '1주' },
  { value: '1month', label: '1개월' },
  { value: '3months', label: '3개월' },
];

export function PeriodToggle({ period, onChange }: Props) {
  return (
    <div className={style.container}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={clsx(style.btn, period === opt.value && style.active)}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
