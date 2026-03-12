import { Button } from '@toss/tds-mobile';
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
        <Button
          key={opt.value}
          color={period === opt.value ? 'primary' : 'dark'}
          variant={period === opt.value ? 'fill' : 'weak'}
          size="small"
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
