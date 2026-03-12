import type { WeightEntry, GoalConfig } from '../types';
import type { WeightStats } from '../utils/stats';
import { format } from '../utils/date';
import style from './WeightGraph.module.css';

interface Props {
  entries: WeightEntry[];
  stats: WeightStats;
  goal: GoalConfig | null;
}

export function WeightGraph({ entries, stats, goal }: Props) {
  if (entries.length === 0) {
    return <div className={style.empty}>아직 기록이 없어요</div>;
  }

  // Use morning entries preferentially, fallback to evening
  const dataPoints = getDataPoints(entries);

  if (dataPoints.length < 2) {
    return (
      <div className={style.container}>
        <div className={style.empty}>그래프를 그리려면 2개 이상의 기록이 필요해요</div>
        <StatsCard stats={stats} />
      </div>
    );
  }

  const weights = dataPoints.map((d) => d.weight);
  const allWeights = [...weights];
  if (goal) allWeights.push(goal.targetWeight);

  const minW = Math.min(...allWeights) - 1;
  const maxW = Math.max(...allWeights) + 1;
  const range = maxW - minW || 1;

  const svgW = 320;
  const svgH = 200;
  const padX = 40;
  const padY = 20;
  const chartW = svgW - padX * 2;
  const chartH = svgH - padY * 2;

  const points = dataPoints.map((d, i) => ({
    x: padX + (i / (dataPoints.length - 1)) * chartW,
    y: padY + (1 - (d.weight - minW) / range) * chartH,
    label: format(new Date(d.date), 'M/d'),
    weight: d.weight,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const goalY = goal ? padY + (1 - (goal.targetWeight - minW) / range) * chartH : null;

  // Y-axis labels
  const yLabels = 5;
  const yLabelValues = Array.from({ length: yLabels }, (_, i) =>
    Math.round((minW + (range * i) / (yLabels - 1)) * 10) / 10
  );

  return (
    <div className={style.container}>
      <div className={style.svgContainer}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="auto">
          {/* Y-axis labels */}
          {yLabelValues.map((v) => {
            const y = padY + (1 - (v - minW) / range) * chartH;
            return (
              <g key={v}>
                <line x1={padX} y1={y} x2={svgW - padX} y2={y} stroke="#e5e8eb" strokeWidth={0.5} />
                <text x={padX - 6} y={y + 3} textAnchor="end" fontSize={9} fill="#8b95a1">
                  {v}
                </text>
              </g>
            );
          })}

          {/* Goal line */}
          {goalY != null && (
            <g>
              <line
                x1={padX}
                y1={goalY}
                x2={svgW - padX}
                y2={goalY}
                stroke="#3182F6"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <text x={svgW - padX + 4} y={goalY + 3} fontSize={9} fill="#3182F6">
                {goal!.targetWeight}
              </text>
            </g>
          )}

          {/* Line */}
          <path d={linePath} fill="none" stroke="#3182F6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3} fill="#3182F6" />
          ))}

          {/* X-axis labels (show a subset) */}
          {points
            .filter((_, i) => i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2))
            .map((p, i) => (
              <text key={i} x={p.x} y={svgH - 2} textAnchor="middle" fontSize={9} fill="#8b95a1">
                {p.label}
              </text>
            ))}
        </svg>
      </div>

      <StatsCard stats={stats} />
    </div>
  );
}

function StatsCard({ stats }: { stats: WeightStats }) {
  const changeClass =
    stats.change == null || stats.change === 0
      ? style.zero
      : stats.change < 0
        ? style.negative
        : style.positive;
  const arrow = stats.change == null || stats.change === 0 ? '' : stats.change < 0 ? ' ↓' : ' ↑';

  return (
    <div className={style.statsCard}>
      <div className={style.statsRow}>
        <span className={style.statsLabel}>현재</span>
        <span className={style.statsValue}>{stats.current != null ? `${stats.current}kg` : '-'}</span>
      </div>
      <div className={style.statsRow}>
        <span className={style.statsLabel}>평균</span>
        <span className={style.statsValue}>{stats.average != null ? `${stats.average}kg` : '-'}</span>
      </div>
      <div className={style.statsRow}>
        <span className={style.statsLabel}>최저 / 최고</span>
        <span className={style.statsValue}>
          {stats.min != null && stats.max != null ? `${stats.min}kg / ${stats.max}kg` : '-'}
        </span>
      </div>
      <div className={style.statsRow}>
        <span className={style.statsLabel}>변화</span>
        <span className={`${style.statsChange} ${changeClass}`}>
          {stats.change != null ? `${stats.change > 0 ? '+' : ''}${stats.change}kg${arrow}` : '-'}
        </span>
      </div>
    </div>
  );
}

interface DataPoint {
  date: string;
  weight: number;
}

function getDataPoints(entries: WeightEntry[]): DataPoint[] {
  const byDate = new Map<string, number>();
  for (const e of entries) {
    // Prefer morning, but use whatever is available
    if (!byDate.has(e.date) || e.timeOfDay === 'morning') {
      byDate.set(e.date, e.weight);
    }
  }
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, weight]) => ({ date, weight }));
}
