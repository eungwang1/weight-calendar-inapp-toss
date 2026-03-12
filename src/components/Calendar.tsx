import { useRef, useState } from 'react';
import type { MonthData } from '../types';
import { getCalendarDays, formatMonthTitle } from '../utils/date';
import { haptic } from '../utils/haptic';
import { CalendarCell } from './CalendarCell';
import style from './Calendar.module.css';

interface Props {
  year: number;
  month: number;
  monthData: MonthData;
  onPrev: () => void;
  onNext: () => void;
  onDateClick: (dateStr: string) => void;
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];
const SWIPE_THRESHOLD = 50;

export function Calendar({ year, month, monthData, onPrev, onNext, onDateClick }: Props) {
  const days = getCalendarDays(year, month);
  const touchStartX = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [slideClass, setSlideClass] = useState('');

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]!.clientX;
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const diff = e.touches[0]!.clientX - touchStartX.current;
    // 제한적 드래그 피드백
    setSwipeOffset(diff * 0.3);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current == null) return;
    const diff = swipeOffset / 0.3; // 원래 diff 복원

    if (diff > SWIPE_THRESHOLD) {
      setSlideClass(style.slideInFromLeft!);
      haptic('tap');
      onPrev();
    } else if (diff < -SWIPE_THRESHOLD) {
      setSlideClass(style.slideInFromRight!);
      haptic('tap');
      onNext();
    }

    setSwipeOffset(0);
    touchStartX.current = null;

    // 애니메이션 후 클래스 제거
    setTimeout(() => setSlideClass(''), 250);
  };

  const handlePrev = () => {
    setSlideClass(style.slideInFromLeft!);
    haptic('tap');
    onPrev();
    setTimeout(() => setSlideClass(''), 250);
  };

  const handleNext = () => {
    setSlideClass(style.slideInFromRight!);
    haptic('tap');
    onNext();
    setTimeout(() => setSlideClass(''), 250);
  };

  return (
    <div>
      <div className={style.header}>
        <button className={style.navBtn} onClick={handlePrev}>
          ‹
        </button>
        <span className={style.title}>{formatMonthTitle(year, month)}</span>
        <button className={style.navBtn} onClick={handleNext}>
          ›
        </button>
      </div>

      <div className={style.weekdays}>
        {WEEKDAYS.map((d) => (
          <span key={d} className={style.weekday}>
            {d}
          </span>
        ))}
      </div>

      <div
        className={`${style.grid} ${slideClass}`}
        style={{ transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {days.map((day) => (
          <CalendarCell
            key={day.dateStr}
            day={day.dayOfMonth}
            dateStr={day.dateStr}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.isToday}
            record={monthData[day.dateStr]}
            onClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
}
