import { useState } from 'react';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useWeightStorage } from '../hooks/useWeightStorage';
import { useGoalWeight } from '../hooks/useGoalWeight';
import { haptic } from '../utils/haptic';
import { Calendar } from '../components/Calendar';
import { GoalBanner } from '../components/GoalBanner';
import { WeightEntrySheet } from '../components/WeightEntrySheet';
import style from './RecordPage.module.css';

export function RecordPage() {
  const { year, month, goNext, goPrev } = useCalendarNavigation();
  const { monthData, saveEntry, deleteEntry, getDayRecord, getAllEntries } =
    useWeightStorage(year, month);
  const { goal, saveGoal, getProgress } = useGoalWeight();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const entries = getAllEntries();
  const latestWeight = entries.length > 0 ? entries[entries.length - 1]!.weight : null;
  const progress = getProgress(latestWeight);

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  return (
    <div className={style.page}>
      <GoalBanner goal={goal} progress={progress} onSaveGoal={saveGoal} />

      <Calendar
        year={year}
        month={month}
        monthData={monthData}
        onPrev={goPrev}
        onNext={goNext}
        onDateClick={handleDateClick}
      />

      <button
        className={style.fab}
        onClick={() => {
          haptic('softMedium');
          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          setSelectedDate(todayStr);
        }}
      >
        <span className={style.fabIcon}>+</span> 기록하기
      </button>

      {selectedDate && (
        <WeightEntrySheet
          dateStr={selectedDate}
          dayRecord={getDayRecord(selectedDate)}
          onSave={saveEntry}
          onDelete={deleteEntry}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
