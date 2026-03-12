import { useState } from 'react';
import { BottomSheet, Button } from '@toss/tds-mobile';
import type { GoalConfig } from '../types';
import { format } from '../utils/date';
import style from './GoalDialog.module.css';

interface Props {
  initial?: GoalConfig;
  onSave: (config: GoalConfig) => void;
  onClose: () => void;
}

export function GoalDialog({ initial, onSave, onClose }: Props) {
  const [targetWeight, setTargetWeight] = useState(initial?.targetWeight?.toString() ?? '');
  const [startWeight, setStartWeight] = useState(initial?.startWeight?.toString() ?? '');

  const handleSave = () => {
    const target = parseFloat(targetWeight);
    const start = parseFloat(startWeight);
    if (isNaN(target) || isNaN(start) || target <= 0 || start <= 0) return;

    onSave({
      targetWeight: target,
      startWeight: start,
      startDate: initial?.startDate ?? format(new Date(), 'yyyy-MM-dd'),
    });
  };

  return (
    <BottomSheet
      open
      onClose={onClose}
      header={<BottomSheet.Header>목표 체중 설정</BottomSheet.Header>}
      hasTextField
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="dark" variant="weak" display="full" size="xlarge" onClick={onClose}>
              취소
            </Button>
          }
          rightButton={
            <Button color="primary" display="full" size="xlarge" onClick={handleSave}>
              저장
            </Button>
          }
        />
      }
    >
      <div className={style.fields}>
        <div className={style.field}>
          <div className={style.fieldLabel}>현재 체중 (kg)</div>
          <input
            className={style.input}
            type="number"
            step="0.1"
            value={startWeight}
            onChange={(e) => setStartWeight(e.target.value)}
            placeholder="72.0"
          />
        </div>

        <div className={style.field}>
          <div className={style.fieldLabel}>목표 체중 (kg)</div>
          <input
            className={style.input}
            type="number"
            step="0.1"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="68.0"
          />
        </div>
      </div>
    </BottomSheet>
  );
}
