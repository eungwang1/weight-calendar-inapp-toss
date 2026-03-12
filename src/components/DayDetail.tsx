import { useEffect, useState } from 'react';
import type { DayRecord } from '../types';
import { getDayLabel } from '../utils/date';
import { usePhotoPicker } from '../hooks/usePhotoPicker';
import style from './DayDetail.module.css';

interface Props {
  dateStr: string;
  dayRecord?: DayRecord;
}

function EntryCard({ entry }: { entry: NonNullable<DayRecord['morning']> }) {
  const { loadPhoto } = usePhotoPicker();
  const [photos, setPhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    entry.photoKeys.forEach(async (key) => {
      if (!photos[key]) {
        const data = await loadPhoto(key);
        if (data) setPhotos((prev) => ({ ...prev, [key]: data }));
      }
    });
  }, [entry.photoKeys]);

  const isMorning = entry.timeOfDay === 'morning';

  return (
    <div className={style.entryCard}>
      <div className={style.entryTop}>
        <span className={`${style.timeLabel} ${isMorning ? style.morning : style.evening}`}>
          {isMorning ? '아침' : '저녁'}
        </span>
        <span className={style.weight}>
          {entry.weight}
          <span className={style.weightUnit}>kg</span>
        </span>
      </div>
      {entry.memo && <div className={style.memo}>{entry.memo}</div>}
      {entry.photoKeys.length > 0 && (
        <div className={style.photos}>
          {entry.photoKeys.map(
            (key) =>
              photos[key] && (
                <img key={key} className={style.photo} src={photos[key]} alt="" />
              )
          )}
        </div>
      )}
    </div>
  );
}

export function DayDetail({ dateStr, dayRecord }: Props) {
  const dateParts = dateStr.split('-');
  const m = parseInt(dateParts[1]!, 10);
  const d = parseInt(dateParts[2]!, 10);
  const dayLabel = getDayLabel(dateStr);

  const hasMorning = !!dayRecord?.morning;
  const hasEvening = !!dayRecord?.evening;
  const hasAny = hasMorning || hasEvening;

  return (
    <div className={style.container}>
      <div className={style.header}>
        <span className={style.dateLabel}>
          {m}월 {d}일 {dayLabel}요일
        </span>
      </div>

      {!hasAny ? (
        <div className={style.empty}>
          <div>기록이 없어요</div>
        </div>
      ) : (
        <div className={style.entries}>
          {dayRecord?.morning && <EntryCard entry={dayRecord.morning} />}
          {hasMorning && hasEvening && <div className={style.divider} />}
          {dayRecord?.evening && <EntryCard entry={dayRecord.evening} />}
        </div>
      )}
    </div>
  );
}
