import { useDialog } from '@toss/tds-mobile';
import { clearAll } from '../utils/storage';
import style from './InfoPage.module.css';

export function InfoPage() {
  const { openConfirm } = useDialog();

  const handleReset = async () => {
    const confirmed = await openConfirm({
      title: '데이터를 초기화할까요?',
      description: '모든 기록, 사진, 목표가 삭제돼요.\n이 작업은 되돌릴 수 없어요.',
      confirmButton: '초기화',
      cancelButton: '취소',
    });
    if (confirmed) {
      await clearAll();
      window.location.reload();
    }
  };

  return (
    <div className={style.page}>
      <h2 className={style.title}>설정</h2>

      <section className={style.section}>
        <h3 className={style.sectionTitle}>약관 및 정책</h3>
        <a className={style.row} href="https://eungwang1.github.io/weight-calendar-inapp-toss/terms.html" target="_blank" rel="noopener noreferrer">
          <span className={style.rowLabel}>서비스 이용약관</span>
          <ChevronIcon />
        </a>
        <a className={style.row} href="https://eungwang1.github.io/weight-calendar-inapp-toss/privacy.html" target="_blank" rel="noopener noreferrer">
          <span className={style.rowLabel}>개인정보처리방침</span>
          <ChevronIcon />
        </a>
      </section>

      <section className={style.section}>
        <h3 className={style.sectionTitle}>데이터 관리</h3>
        <button className={style.row} onClick={handleReset}>
          <span className={`${style.rowLabel} ${style.danger}`}>데이터 전체 초기화</span>
          <ChevronIcon />
        </button>
      </section>

      <div className={style.appMeta}>
        <img className={style.appIcon} src="/app-icon.png" alt="" />
        <span className={style.appName}>몸무게 캘린더</span>
        <span className={style.appVersion}>v1.0.0</span>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B0B8C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
