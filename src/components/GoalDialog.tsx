import { useState } from 'react';
import { BottomSheet, Button } from '@toss/tds-mobile';
import type { GoalConfig } from '../types';
import { format } from '../utils/date';
import { haptic } from '../utils/haptic';
import style from './GoalDialog.module.css';

interface Props {
  initial?: GoalConfig;
  onSave: (config: GoalConfig) => void;
  onClose: () => void;
}

export function GoalDialog({ initial, onSave, onClose }: Props) {
  const [targetWeight, setTargetWeight] = useState(initial?.targetWeight?.toString() ?? '');
  const [startWeight, setStartWeight] = useState(initial?.startWeight?.toString() ?? '');

  const adjustStart = (delta: number) => {
    const cur = parseFloat(startWeight) || 0;
    setStartWeight(Math.max(0, cur + delta).toFixed(1));
    haptic('tickWeak');
  };

  const adjustTarget = (delta: number) => {
    const cur = parseFloat(targetWeight) || 0;
    setTargetWeight(Math.max(0, cur + delta).toFixed(1));
    haptic('tickWeak');
  };

  const handleSave = () => {
    const target = parseFloat(targetWeight);
    const start = parseFloat(startWeight);
    if (isNaN(target) || isNaN(start) || target <= 0 || start <= 0) {
      haptic('error');
      return;
    }

    onSave({
      targetWeight: target,
      startWeight: start,
      startDate: initial?.startDate ?? format(new Date(), 'yyyy-MM-dd'),
    });
    haptic('success');
    onClose();
  };

  return (
    <BottomSheet
      open
      onClose={onClose}
      header={<BottomSheet.Header>목표 체중 설정</BottomSheet.Header>}
      hasTextField
      cta={
        <BottomSheet.CTA onClick={handleSave}>
          저장하기
        </BottomSheet.CTA>
      }
    >
      <div className={style.content}>
        <div className={style.section}>
          <div className={style.sectionLabel}>현재 체중</div>
          <div className={style.weightInput}>
            <div className={style.weightValue}>
              <input
                className={style.weightNumber}
                type="number"
                step="0.1"
                value={startWeight}
                onChange={(e) => setStartWeight(e.target.value)}
                placeholder="0.0"
              />
              <span className={style.weightUnit}>kg</span>
            </div>
            <div className={style.adjustBtns}>
              <Button color="dark" variant="weak" size="small" onClick={() => adjustStart(-0.1)}>
                -0.1
              </Button>
              <Button color="dark" variant="weak" size="small" onClick={() => adjustStart(0.1)}>
                +0.1
              </Button>
            </div>
          </div>
        </div>

        <div className={style.section}>
          <div className={style.sectionLabel}>목표 체중</div>
          <div className={style.weightInput}>
            <div className={style.weightValue}>
              <input
                className={style.weightNumber}
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="0.0"
              />
              <span className={style.weightUnit}>kg</span>
            </div>
            <div className={style.adjustBtns}>
              <Button color="dark" variant="weak" size="small" onClick={() => adjustTarget(-0.1)}>
                -0.1
              </Button>
              <Button color="dark" variant="weak" size="small" onClick={() => adjustTarget(0.1)}>
                +0.1
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
