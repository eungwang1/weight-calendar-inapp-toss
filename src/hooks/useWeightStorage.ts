import { useCallback, useEffect, useState } from 'react';
import type { WeightEntry, DayRecord, MonthData } from '../types';
import { getItem, setItem, getMonthKey } from '../utils/storage';
import { format } from '../utils/date';
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

      const newData = { ...monthData };
      const dayRecord: DayRecord = newData[dayKey] ?? {};

      const fullEntry: WeightEntry = {
        ...entry,
        id: existingId ?? nanoid(),
        createdAt: existingId ? (dayRecord[entry.timeOfDay]?.createdAt ?? now) : now,
        updatedAt: now,
      };

      dayRecord[entry.timeOfDay] = fullEntry;
      newData[dayKey] = dayRecord;

      setMonthData(newData);
      await setItem(storageKey, newData);
      return fullEntry;
    },
    [monthData, storageKey]
  );

  const deleteEntry = useCallback(
    async (dateStr: string, timeOfDay: 'morning' | 'evening') => {
      const newData = { ...monthData };
      const dayRecord = newData[dateStr];
      if (!dayRecord) return;

      delete dayRecord[timeOfDay];
      if (!dayRecord.morning && !dayRecord.evening) {
        delete newData[dateStr];
      } else {
        newData[dateStr] = dayRecord;
      }

      setMonthData(newData);
      await setItem(storageKey, newData);
    },
    [monthData, storageKey]
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
