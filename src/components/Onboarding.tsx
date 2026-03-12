import { Button } from '@toss/tds-mobile';
import { haptic } from '../utils/haptic';
import style from './Onboarding.module.css';

const ICON_BASE = 'https://static.toss.im/icons/svg';

const FEATURES = [
  { icon: `${ICON_BASE}/icon-pencil-mono.svg`, text: '아침, 저녁 몸무게를 간편하게 기록해요' },
  { icon: `${ICON_BASE}/icon-chart-mono.svg`, text: '그래프로 체중 변화 추이를 확인해요' },
  { icon: `${ICON_BASE}/icon-trophy-mono.svg`, text: '목표를 설정하고 달성률을 확인해요' },
];

interface Props {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: Props) {
  return (
    <div className={style.container}>
      <div className={style.top}>
        <h1 className={style.title}>매일 몸무게를 기록하고<br />변화를 확인해요</h1>
        <p className={style.subtitle}>건강한 습관, 몸무게 캘린더와 함께 해요</p>
      </div>

      <div className={style.hero}>
        <img className={style.heroImg} src="/app-icon.png" alt="" />
      </div>

      <ul className={style.features}>
        {FEATURES.map((f, i) => (
          <li key={i} className={style.featureItem}>
            <img className={style.featureIcon} src={f.icon} alt="" />
            <span className={style.featureText}>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className={style.bottom}>
        <div className={style.btnWrap}>
          <Button color="primary" display="full" size="large" onClick={() => { haptic('tap'); onComplete(); }}>
            시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
