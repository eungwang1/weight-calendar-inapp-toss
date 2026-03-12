import type { WeightEntry, GoalConfig, PeriodType } from '../types';
import type { WeightStats } from '../utils/stats';
import { format } from '../utils/date';
import style from './WeightGraph.module.css';

interface Props {
  entries: WeightEntry[];
  stats: WeightStats;
  goal: GoalConfig | null;
  period: PeriodType;
}

export function WeightGraph({ entries, stats, goal, period }: Props) {
  if (entries.length === 0) {
    return <div className={style.empty}>아직 기록이 없어요</div>;
  }

  // 모든 기간에서 하루 평균으로 합침 (라벨 겹침 방지)
  const rawPoints = getDataPoints(entries);
  const dataPoints = condenseToDailyAvg(rawPoints);

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

  const linePath = period === '1week'
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : smoothPath(points);

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
          <path d={linePath} fill="none" stroke="#3182F6" strokeWidth={period === '1week' ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots - 1주일은 전부, 그 외에는 일정 간격만 */}
          {points
            .filter((_, i) => {
              if (period === '1week') return true;
              const step = Math.max(1, Math.floor(points.length / 15));
              return i === 0 || i === points.length - 1 || i % step === 0;
            })
            .map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={period === '1week' ? 3 : 2} fill="#3182F6" />
            ))}

          {/* X-axis labels */}
          {(() => {
            const labelCount = period === '1week' ? 4 : period === '1month' ? 5 : 6;
            const step = Math.max(1, Math.floor((points.length - 1) / (labelCount - 1)));
            const indices = new Set<number>();
            for (let i = 0; i < points.length; i += step) indices.add(i);
            indices.add(points.length - 1);
            return [...indices].map((idx) => {
              const p = points[idx]!;
              return (
                <text key={idx} x={p.x} y={svgH - 2} textAnchor="middle" fontSize={9} fill="#8b95a1">
                  {p.label}
                </text>
              );
            });
          })()}
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
  timeOfDay: 'morning' | 'evening';
}

function getDataPoints(entries: WeightEntry[]): DataPoint[] {
  return entries
    .map((e) => ({
      date: e.date,
      weight: e.weight,
      timeOfDay: e.timeOfDay,
      sortKey: `${e.date}-${e.timeOfDay === 'morning' ? '0' : '1'}`,
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ date, weight, timeOfDay }) => ({ date, weight, timeOfDay }));
}

/** 하루에 여러 기록이 있으면 평균으로 합쳐서 1일 1포인트로 만듦 */
function condenseToDailyAvg(points: DataPoint[]): DataPoint[] {
  const byDate = new Map<string, number[]>();
  for (const p of points) {
    const arr = byDate.get(p.date);
    if (arr) arr.push(p.weight);
    else byDate.set(p.date, [p.weight]);
  }
  return [...byDate.entries()].map(([date, weights]) => ({
    date,
    weight: Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10,
    timeOfDay: 'morning' as const,
  }));
}

/** Catmull-Rom spline → SVG cubic bezier path */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M ${pts[0]!.x} ${pts[0]!.y} L ${pts[1]!.x} ${pts[1]!.y}`;

  const tension = 0.3;
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}
