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
      const totalDiff = goal.startWeight - goal.targetWeight; // 감량이면 양수, 증량이면 음수
      if (totalDiff === 0) return 100;
      const achieved = goal.startWeight - currentWeight; // 감량이면 양수, 증량이면 음수
      // 같은 방향으로 진행했을 때만 진행률 계산
      const ratio = achieved / totalDiff;
      return Math.min(100, Math.max(0, Math.round(ratio * 100)));
    },
    [goal]
  );

  const goalType = goal
    ? goal.targetWeight < goal.startWeight ? 'loss' : goal.targetWeight > goal.startWeight ? 'gain' : 'maintain'
    : null;

  return { goal, goalType, loading, saveGoal, clearGoal, getProgress };
}
