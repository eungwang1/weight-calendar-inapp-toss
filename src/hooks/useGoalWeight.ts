import { useCallback, useEffect, useState } from 'react';
import type { GoalConfig } from '../types';
import { getItem, setItem, removeItem } from '../utils/storage';

const GOAL_KEY = 'goal';

export function useGoalWeight() {
  const [goal, setGoal] = useState<GoalConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getItem<GoalConfig>(GOAL_KEY);
      setGoal(data);
      setLoading(false);
    })();
  }, []);

  const saveGoal = useCallback(async (config: GoalConfig) => {
    setGoal(config);
    await setItem(GOAL_KEY, config);
  }, []);

  const clearGoal = useCallback(async () => {
    setGoal(null);
    await removeItem(GOAL_KEY);
  }, []);

  const getProgress = useCallback(
    (currentWeight: number | null): number | null => {
      if (!goal || currentWeight == null) return null;
      const totalDiff = goal.startWeight - goal.targetWeight;
      if (totalDiff === 0) return 100;
      const achieved = goal.startWeight - currentWeight;
      return Math.min(100, Math.max(0, Math.round((achieved / totalDiff) * 100)));
    },
    [goal]
  );

  return { goal, loading, saveGoal, clearGoal, getProgress };
}
