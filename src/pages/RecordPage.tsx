import { useState } from 'react';
import { Button } from '@toss/tds-mobile';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useWeightStorage } from '../hooks/useWeightStorage';
import { useGoalWeight } from '../hooks/useGoalWeight';
import { haptic } from '../utils/haptic';
import { Calendar } from '../components/Calendar';
import { GoalBanner } from '../components/GoalBanner';
import { DayDetail } from '../components/DayDetail';
import { WeightEntrySheet } from '../components/WeightEntrySheet';
import style from './RecordPage.module.css';

export function RecordPage() {
  const { year, month, goNext, goPrev } = useCalendarNavigation();
  const { monthData, saveEntry, deleteEntry, getDayRecord, getAllEntries } =
    useWeightStorage(year, month);
  const { goal, goalType, saveGoal, getProgress } = useGoalWeight();

  const [viewingDate, setViewingDate] = useState<string | null>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const entries = getAllEntries();
  const latestWeight = entries.length > 0 ? entries[entries.length - 1]!.weight : null;
  const progress = getProgress(latestWeight);

  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  })();
  const isFutureSelected = !!viewingDate && viewingDate > todayStr;

  const handleDateClick = (dateStr: string) => {
    haptic('tap');
    setViewingDate(dateStr);
  };

  return (
    <div className={style.page}>
      <GoalBanner goal={goal} goalType={goalType} progress={progress} onSaveGoal={saveGoal} />

      <Calendar
        year={year}
        month={month}
        monthData={monthData}
        selectedDate={viewingDate}
        onPrev={goPrev}
        onNext={goNext}
        onDateClick={handleDateClick}
      />

      {viewingDate && (
        <DayDetail
          dateStr={viewingDate}
          dayRecord={getDayRecord(viewingDate)}
        />
      )}

      {!isFutureSelected && (
        <div className={style.fabContainer}>
          <Button
            color="primary"
            size="large"
            onClick={() => {
              haptic('softMedium');
              const targetDate = viewingDate ?? todayStr;
              setViewingDate(targetDate);
              setEditingDate(targetDate);
            }}
          >
            + 기록하기
          </Button>
        </div>
      )}

      {editingDate && (
        <WeightEntrySheet
          dateStr={editingDate}
          dayRecord={getDayRecord(editingDate)}
          onSave={saveEntry}
          onDelete={deleteEntry}
          onClose={() => setEditingDate(null)}
        />
      )}
    </div>
  );
}
