import { useState, useCallback } from 'react';
import { Button } from '@toss/tds-mobile';
import type { GoalConfig } from '../types';
import { useBackHandler } from '../hooks/useBackHandler';
import style from './GoalBanner.module.css';
import { GoalDialog } from './GoalDialog';

interface Props {
  goal: GoalConfig | null;
  goalType: 'loss' | 'gain' | 'maintain' | null;
  progress: number | null;
  onSaveGoal: (config: GoalConfig) => void;
}

export function GoalBanner({ goal, goalType, progress, onSaveGoal }: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const closeDialog = useCallback(() => setShowDialog(false), []);
  useBackHandler(showDialog, closeDialog);

  const isCompleted = progress != null && progress >= 100;

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
      <div
        className={`${style.banner} ${isCompleted ? style.bannerCompleted : ''}`}
        onClick={() => isCompleted ? setShowCelebration(true) : setShowDialog(true)}
      >
        {isCompleted ? (
          <div className={style.completedContent}>
            <span className={style.completedEmoji}>🎉</span>
            <div className={style.completedText}>
              <span className={style.completedTitle}>목표 달성!</span>
              <span className={style.completedSub}>{goal.targetWeight}kg 도달을 축하해요</span>
            </div>
          </div>
        ) : (
          <>
            <div className={style.row}>
              <span className={style.label}>목표 {goal.targetWeight}kg</span>
              {progress != null && <span className={style.percent}>{progress}%</span>}
            </div>
            <div className={style.barBg}>
              <div className={style.barFill} style={{ width: `${progress ?? 0}%` }} />
            </div>
          </>
        )}
      </div>

      {showCelebration && (
        <div className={style.celebrationOverlay} onClick={() => setShowCelebration(false)}>
          <div className={style.celebrationCard} onClick={(e) => e.stopPropagation()}>
            <div className={style.celebrationEmoji}>🏆</div>
            <div className={style.celebrationTitle}>목표 달성을 축하합니다!</div>
            <div className={style.celebrationDesc}>
              {goal.startWeight}kg에서 {goal.targetWeight}kg까지
              <br />
              {Math.abs(goal.startWeight - goal.targetWeight).toFixed(1)}kg {goalType === 'loss' ? '감량' : '증량'}에 성공했어요!
            </div>
            <div className={style.celebrationActions}>
              <Button
                color="dark"
                variant="weak"
                size="medium"
                onClick={() => {
                  setShowCelebration(false);
                  setShowDialog(true);
                }}
              >
                새 목표 설정
              </Button>
              <Button
                color="primary"
                size="medium"
                onClick={() => setShowCelebration(false)}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}

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
