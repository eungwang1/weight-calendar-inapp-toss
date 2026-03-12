export interface WeightEntry {
  id: string;
  date: string; // "2026-03-12"
  timeOfDay: 'morning' | 'evening';
  weight: number; // kg
  memo: string;
  photoKeys: string[]; // max 4, storage keys
  createdAt: number;
  updatedAt: number;
}

export interface DayRecord {
  morning?: WeightEntry;
  evening?: WeightEntry;
}

export interface GoalConfig {
  targetWeight: number;
  startWeight: number;
  startDate: string;
}

export type MonthData = Record<string, DayRecord>;

export type PeriodType = '1week' | '1month' | '3months';
