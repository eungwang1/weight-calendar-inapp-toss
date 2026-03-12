import { useState, useEffect } from 'react';
import { BottomSheet, Button } from '@toss/tds-mobile';
import type { DayRecord, WeightEntry } from '../types';
import { getDayLabel } from '../utils/date';
import { haptic } from '../utils/haptic';
import { useBackHandler } from '../hooks/useBackHandler';
import { PhotoGrid } from './PhotoGrid';
import style from './WeightEntrySheet.module.css';

interface Props {
  dateStr: string;
  dayRecord?: DayRecord;
  onSave: (entry: Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => void;
  onDelete: (dateStr: string, timeOfDay: 'morning' | 'evening') => void;
  onClose: () => void;
}

export function WeightEntrySheet({ dateStr, dayRecord, onSave, onDelete, onClose }: Props) {
  useBackHandler(true, onClose);

  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning');
  const [weight, setWeight] = useState('');
  const [memo, setMemo] = useState('');
  const [photoKeys, setPhotoKeys] = useState<string[]>([]);

  const existing = dayRecord?.[timeOfDay];
  const isEditing = !!existing;

  useEffect(() => {
    if (existing) {
      setWeight(existing.weight.toString());
      setMemo(existing.memo);
      setPhotoKeys(existing.photoKeys);
    } else {
      setWeight('');
      setMemo('');
      setPhotoKeys([]);
    }
  }, [timeOfDay, existing?.id]);

  const dateParts = dateStr.split('-');
  const m = parseInt(dateParts[1]!, 10);
  const d = parseInt(dateParts[2]!, 10);
  const dayLabel = getDayLabel(dateStr);

  const adjust = (delta: number) => {
    const current = parseFloat(weight) || 0;
    const next = Math.max(0, current + delta);
    setWeight(next.toFixed(1));
    haptic('tickWeak');
  };

  const handleSave = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0 || w > 300) return;

    onSave(
      {
        date: dateStr,
        timeOfDay,
        weight: w,
        memo,
        photoKeys,
      },
      existing?.id
    );
    haptic('success');
    onClose();
  };

  const handleDelete = () => {
    onDelete(dateStr, timeOfDay);
    haptic('error');
    onClose();
  };

  return (
    <BottomSheet
      open
      onClose={onClose}
      header={<BottomSheet.Header>{m}월 {d}일 {dayLabel}요일</BottomSheet.Header>}
      hasTextField
      cta={
        <BottomSheet.CTA>
          <Button color="primary" display="full" size="xlarge" onClick={handleSave}>
            저장하기
          </Button>
        </BottomSheet.CTA>
      }
    >
      <div className={style.content}>
        <div className={style.toggle}>
          <button
            className={`${style.toggleBtn} ${timeOfDay === 'morning' ? style.morningActive : ''}`}
            onClick={() => setTimeOfDay('morning')}
          >
            아침
          </button>
          <button
            className={`${style.toggleBtn} ${timeOfDay === 'evening' ? style.eveningActive : ''}`}
            onClick={() => setTimeOfDay('evening')}
          >
            저녁
          </button>
        </div>

        <div className={style.weightInput}>
          <div className={style.weightValue}>
            <input
              className={style.weightNumber}
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.0"
            />
            <span className={style.weightUnit}>kg</span>
          </div>
          <div className={style.adjustBtns}>
            <Button color="dark" variant="weak" size="small" onClick={() => adjust(-0.1)}>
              -0.1
            </Button>
            <Button color="dark" variant="weak" size="small" onClick={() => adjust(0.1)}>
              +0.1
            </Button>
          </div>
        </div>

        <div className={style.memoSection}>
          <div className={style.memoLabel}>메모</div>
          <textarea
            className={style.memoInput}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요"
          />
        </div>

        <div className={style.photoSection}>
          <PhotoGrid photoKeys={photoKeys} onPhotoKeysChange={setPhotoKeys} />
        </div>

        {isEditing && (
          <Button color="danger" variant="weak" display="full" size="large" onClick={handleDelete}>
            삭제하기
          </Button>
        )}
      </div>
    </BottomSheet>
  );
}
