import { useState, useCallback } from 'react';
import { Button } from '@toss/tds-mobile';
import type { GoalConfig } from '../types';
import { useBackHandler } from '../hooks/useBackHandler';
import style from './GoalBanner.module.css';
import { GoalDialog } from './GoalDialog';

interface Props {
  goal: GoalConfig | null;
  progress: number | null;
  onSaveGoal: (config: GoalConfig) => void;
}

export function GoalBanner({ goal, progress, onSaveGoal }: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const closeDialog = useCallback(() => setShowDialog(false), []);
  useBackHandler(showDialog, closeDialog);

  if (!goal) {
    return (
      <>
        <div style={{ padding: '12px 20px 8px' }}>
          <Button
            color="dark"
            variant="weak"
            display="full"
            size="large"
            onClick={() => setShowDialog(true)}
          >
            목표 체중 설정하기
          </Button>
        </div>
        {showDialog && (
          <GoalDialog
            onSave={(config) => {
              onSaveGoal(config);
              setShowDialog(false);
            }}
            onClose={() => setShowDialog(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={style.banner} onClick={() => setShowDialog(true)}>
        <div className={style.row}>
          <span className={style.label}>목표: {goal.targetWeight}kg</span>
          {progress != null && <span className={style.percent}>{progress}%</span>}
        </div>
        <div className={style.barBg}>
          <div className={style.barFill} style={{ width: `${progress ?? 0}%` }} />
        </div>
      </div>
      {showDialog && (
        <GoalDialog
          initial={goal}
          onSave={(config) => {
            onSaveGoal(config);
            setShowDialog(false);
          }}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
