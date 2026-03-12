import { useCallback, useEffect, useState } from 'react';
import type { WeightEntry, PeriodType } from '../types';
import { useGoalWeight } from '../hooks/useGoalWeight';
import { loadMonthData, collectEntriesFromMonthData } from '../hooks/useWeightStorage';
import { getDateRangeForPeriod, format } from '../utils/date';
import { calculateStats } from '../utils/stats';
import { PeriodToggle } from '../components/PeriodToggle';
import { WeightGraph } from '../components/WeightGraph';
import style from './GraphPage.module.css';

export function GraphPage() {
  const [period, setPeriod] = useState<PeriodType>('1month');
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const { goal } = useGoalWeight();

  const loadEntries = useCallback(async () => {
    const { start, end } = getDateRangeForPeriod(period);
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');

    // Collect all months in range
    const months = new Set<string>();
    const cursor = new Date(start);
    while (cursor <= end) {
      months.add(`${cursor.getFullYear()}-${cursor.getMonth() + 1}`);
      cursor.setMonth(cursor.getMonth() + 1);
    }
    // Include end month
    months.add(`${end.getFullYear()}-${end.getMonth() + 1}`);

    const allEntries: WeightEntry[] = [];
    for (const key of months) {
      const [y, m] = key.split('-').map(Number) as [number, number];
      const data = await loadMonthData(y, m);
      allEntries.push(...collectEntriesFromMonthData(data));
    }

    const filtered = allEntries.filter((e) => e.date >= startStr && e.date <= endStr);
    filtered.sort((a, b) => a.date.localeCompare(b.date));
    setEntries(filtered);
  }, [period]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const stats = calculateStats(entries);

  return (
    <div className={style.page}>
      <PeriodToggle period={period} onChange={setPeriod} />
      <WeightGraph entries={entries} stats={stats} goal={goal} />
    </div>
  );
}
