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
  const [showGoalDialog, setShowGoalDialog] = useState(false);

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

  const goalChip = !goal ? (
    <button
      className={style.goalChip}
      onClick={() => { haptic('tap'); setShowGoalDialog(true); }}
    >
      목표 설정
    </button>
  ) : null;

  return (
    <div className={style.page}>
      <GoalBanner
        goal={goal}
        goalType={goalType}
        progress={progress}
        latestWeight={latestWeight}
        onSaveGoal={saveGoal}
        showDialog={showGoalDialog}
        onOpenDialog={() => setShowGoalDialog(true)}
        onCloseDialog={() => setShowGoalDialog(false)}
      />

      <Calendar
        year={year}
        month={month}
        monthData={monthData}
        selectedDate={viewingDate}
        onPrev={goPrev}
        onNext={goNext}
        onDateClick={handleDateClick}
        headerRight={goalChip}
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
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block', position: 'relative', top: -1 }}>
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              기록하기
            </span>
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
