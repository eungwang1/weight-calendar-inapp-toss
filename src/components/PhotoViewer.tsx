import { useState } from 'react';
import { haptic } from '../utils/haptic';
import style from './PhotoViewer.module.css';

interface Props {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}

export function PhotoViewer({ photos, initialIndex, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);

  const goPrev = () => {
    if (current > 0) { setCurrent(current - 1); haptic('tap'); }
  };

  const goNext = () => {
    if (current < photos.length - 1) { setCurrent(current + 1); haptic('tap'); }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0]!.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    setOffsetX((e.touches[0]!.clientX - touchStartX) * 0.4);
  };

  const handleTouchEnd = () => {
    if (touchStartX == null) return;
    const diff = offsetX / 0.4;
    if (diff > 60) goPrev();
    else if (diff < -60) goNext();
    setOffsetX(0);
    setTouchStartX(null);
  };

  return (
    <div className={style.overlay} onClick={onClose}>
      <button className={style.closeBtn} onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={style.imageArea}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          className={style.image}
          src={photos[current]}
          alt=""
          style={{ transform: offsetX ? `translateX(${offsetX}px)` : undefined }}
        />
      </div>

      {photos.length > 1 && (
        <div className={style.counter} onClick={(e) => e.stopPropagation()}>
          {current + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
