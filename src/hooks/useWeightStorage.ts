import { useCallback, useEffect, useState } from 'react';
import type { WeightEntry, DayRecord, MonthData } from '../types';
import { getItem, setItem, getMonthKey } from '../utils/storage';
import { nanoid } from 'nanoid';

export function useWeightStorage(year: number, month: number) {
  const [monthData, setMonthData] = useState<MonthData>({});
  const [loading, setLoading] = useState(true);
  const storageKey = getMonthKey(year, month);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getItem<MonthData>(storageKey);
    setMonthData(data ?? {});
    setLoading(false);
  }, [storageKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveEntry = useCallback(
    async (entry: Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => {
      const now = Date.now();
      const dayKey = entry.date;

      // 최신 데이터를 storage에서 직접 읽어서 stale closure 방지
      const current = (await getItem<MonthData>(storageKey)) ?? {};
      const dayRecord: DayRecord = current[dayKey] ?? {};

      const fullEntry: WeightEntry = {
        ...entry,
        id: existingId ?? nanoid(),
        createdAt: existingId ? (dayRecord[entry.timeOfDay]?.createdAt ?? now) : now,
        updatedAt: now,
      };

      dayRecord[entry.timeOfDay] = fullEntry;
      current[dayKey] = dayRecord;

      await setItem(storageKey, current);
      setMonthData(current);
      return fullEntry;
    },
    [storageKey]
  );

  const deleteEntry = useCallback(
    async (dateStr: string, timeOfDay: 'morning' | 'evening') => {
      const current = (await getItem<MonthData>(storageKey)) ?? {};
      const dayRecord = current[dateStr];
      if (!dayRecord) return;

      delete dayRecord[timeOfDay];
      if (!dayRecord.morning && !dayRecord.evening) {
        delete current[dateStr];
      } else {
        current[dateStr] = dayRecord;
      }

      await setItem(storageKey, current);
      setMonthData(current);
    },
    [storageKey]
  );

  const getDayRecord = useCallback(
    (dateStr: string): DayRecord | undefined => {
      return monthData[dateStr];
    },
    [monthData]
  );

  const getAllEntries = useCallback((): WeightEntry[] => {
    const entries: WeightEntry[] = [];
    for (const dayRecord of Object.values(monthData)) {
      if (dayRecord.morning) entries.push(dayRecord.morning);
      if (dayRecord.evening) entries.push(dayRecord.evening);
    }
    return entries.sort((a, b) => a.date.localeCompare(b.date));
  }, [monthData]);

  return {
    monthData,
    loading,
    saveEntry,
    deleteEntry,
    getDayRecord,
    getAllEntries,
    reload: loadData,
  };
}

export async function loadMonthData(year: number, month: number): Promise<MonthData> {
  const key = getMonthKey(year, month);
  return (await getItem<MonthData>(key)) ?? {};
}

export function collectEntriesFromMonthData(data: MonthData): WeightEntry[] {
  const entries: WeightEntry[] = [];
  for (const dayRecord of Object.values(data)) {
    if (dayRecord.morning) entries.push(dayRecord.morning);
    if (dayRecord.evening) entries.push(dayRecord.evening);
  }
  return entries.sort((a, b) => a.date.localeCompare(b.date));
}
