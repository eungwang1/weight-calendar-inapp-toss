import { useState } from 'react';
import { BottomSheet, Button, useToast } from '@toss/tds-mobile';
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

interface DraftEntry {
  weight: string;
  memo: string;
  photoKeys: string[];
}

export function WeightEntrySheet({ dateStr, dayRecord, onSave, onDelete, onClose }: Props) {
  useBackHandler(true, onClose);
  const toast = useToast();

  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning');
  const [draft, setDraft] = useState<Record<'morning' | 'evening', DraftEntry>>(() => {
    const init = (tod: 'morning' | 'evening'): DraftEntry => {
      const e = dayRecord?.[tod];
      return e
        ? { weight: e.weight.toString(), memo: e.memo, photoKeys: e.photoKeys }
        : { weight: '', memo: '', photoKeys: [] };
    };
    return { morning: init('morning'), evening: init('evening') };
  });

  const current = draft[timeOfDay];
  const existing = dayRecord?.[timeOfDay];
  const isEditing = !!existing;

  const update = (patch: Partial<DraftEntry>) =>
    setDraft((prev) => ({ ...prev, [timeOfDay]: { ...prev[timeOfDay], ...patch } }));

  const dateParts = dateStr.split('-');
  const m = parseInt(dateParts[1]!, 10);
  const d = parseInt(dateParts[2]!, 10);
  const dayLabel = getDayLabel(dateStr);

  const adjust = (delta: number) => {
    const cur = parseFloat(current.weight) || 0;
    const next = Math.max(0, cur + delta);
    update({ weight: next.toFixed(1) });
    haptic('tickWeak');
  };

  const handleSave = async () => {
    const mw = parseFloat(draft.morning.weight);
    const ew = parseFloat(draft.evening.weight);
    const hasMorning = !isNaN(mw) && mw > 0 && mw <= 300;
    const hasEvening = !isNaN(ew) && ew > 0 && ew <= 300;

    if (!hasMorning && !hasEvening) {
      haptic('error');
      toast.openToast('체중을 입력해 주세요');
      return;
    }

    if (hasMorning) {
      await onSave(
        { date: dateStr, timeOfDay: 'morning', weight: mw, memo: draft.morning.memo, photoKeys: draft.morning.photoKeys },
        dayRecord?.morning?.id
      );
    }
    if (hasEvening) {
      await onSave(
        { date: dateStr, timeOfDay: 'evening', weight: ew, memo: draft.evening.memo, photoKeys: draft.evening.photoKeys },
        dayRecord?.evening?.id
      );
    }

    haptic('success');
    onClose();
  };

  const handleDelete = () => {
    onDelete(dateStr, timeOfDay);
    update({ weight: '', memo: '', photoKeys: [] });
    haptic('error');
  };

  return (
    <BottomSheet
      open
      onClose={onClose}
      header={<BottomSheet.Header>{m}월 {d}일 {dayLabel}요일</BottomSheet.Header>}
      hasTextField
      cta={
        <BottomSheet.CTA onClick={handleSave}>
          저장하기
        </BottomSheet.CTA>
      }
    >
      <div className={style.content}>
        <div className={style.toggle}>
          <button
            className={`${style.toggleBtn} ${timeOfDay === 'morning' ? style.morningActive : ''}`}
            onClick={() => setTimeOfDay('morning')}
          >
            아침{draft.morning.weight ? ` · ${draft.morning.weight}kg` : ''}
          </button>
          <button
            className={`${style.toggleBtn} ${timeOfDay === 'evening' ? style.eveningActive : ''}`}
            onClick={() => setTimeOfDay('evening')}
          >
            저녁{draft.evening.weight ? ` · ${draft.evening.weight}kg` : ''}
          </button>
        </div>

        <div className={style.weightInput}>
          <div className={style.weightValue}>
            <input
              className={style.weightNumber}
              type="number"
              step="0.1"
              value={current.weight}
              onChange={(e) => update({ weight: e.target.value })}
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
            value={current.memo}
            onChange={(e) => update({ memo: e.target.value })}
            placeholder="메모를 입력하세요"
          />
        </div>

        <div className={style.photoSection}>
          <PhotoGrid photoKeys={current.photoKeys} onPhotoKeysChange={(v) => update({ photoKeys: v })} />
        </div>

        {existing && (
          <button className={style.deleteBtn} onClick={handleDelete}>
            이 기록 삭제
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
