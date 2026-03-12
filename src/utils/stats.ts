import type { WeightEntry } from '../types';

export interface WeightStats {
  current: number | null;
  average: number | null;
  min: number | null;
  max: number | null;
  change: number | null;
}

export function calculateStats(entries: WeightEntry[]): WeightStats {
  if (entries.length === 0) {
    return { current: null, average: null, min: null, max: null, change: null };
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const weights = sorted.map((e) => e.weight);
  const current = weights[weights.length - 1]!;
  const first = weights[0]!;
  const sum = weights.reduce((a, b) => a + b, 0);

  return {
    current,
    average: Math.round((sum / weights.length) * 10) / 10,
    min: Math.min(...weights),
    max: Math.max(...weights),
    change: Math.round((current - first) * 10) / 10,
  };
}
