import clsx from 'clsx';
import { haptic } from '../utils/haptic';
import style from './TabBar.module.css';

interface Props {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const TABS = ['기록', '그래프'];

export function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <div className={style.tabBar}>
      {TABS.map((label, i) => (
        <button
          key={label}
          className={clsx(style.tab, activeTab === i && style.active)}
          onClick={() => { haptic('tap'); onTabChange(i); }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
