import { useState, useEffect } from 'react';
import { getStreakStats } from '../lib/api';
import type { StreakStats, HeatmapDay } from '../lib/types';

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

function heatLevel(count: number): 0 | 1 | 2 | 3 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 9) return 2;
  return 3;
}

function encourageText(days: number): string {
  if (days === 0) return '今天就是第一天，开始吧 🌱';
  if (days === 1) return '第一步已迈出，继续生长';
  if (days < 7)  return `已坚持 ${days} 天，种子发芽中`;
  if (days < 30) return `${days} 天了，小芽越来越茁壮`;
  if (days < 90) return `${days} 天，知识在悄悄长根`;
  return `${days} 天，你是认真在学的人 🌳`;
}

/** Group heatmap (112 days) into 16 weeks × 7 days, week starting Sunday */
function toWeeks(heatmap: HeatmapDay[]): (HeatmapDay | null)[][] {
  if (heatmap.length === 0) return [];
  // Pad leading days so the first day falls in the right weekday column
  const firstDow = new Date(heatmap[0].date + 'T00:00:00').getDay(); // 0=Sun
  const padded: (HeatmapDay | null)[] = [
    ...Array(firstDow).fill(null),
    ...heatmap,
  ];
  const weeks: (HeatmapDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

interface CircleProps {
  reviewed: number;
  due: number;
}

function ProgressCircle({ reviewed, due }: CircleProps) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = due > 0 ? Math.min(reviewed / due, 1) : 0;
  const dash = pct * circ;

  return (
    <svg className="progress-circle" viewBox="0 0 88 88" aria-label={`今日进度 ${reviewed} / ${due}`}>
      <circle cx="44" cy="44" r={r} className="progress-circle__bg" />
      <circle
        cx="44" cy="44" r={r}
        className="progress-circle__fg"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={0}
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="40" className="progress-circle__num">{reviewed}</text>
      <text x="44" y="56" className="progress-circle__den">/ {due}</text>
    </svg>
  );
}

interface StreakPageProps {
  onToast?: (msg: string) => void;
}

export default function StreakPage({ onToast }: StreakPageProps) {
  const [stats, setStats] = useState<StreakStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStreakStats()
      .then(setStats)
      .catch(() => onToast?.('加载统计数据失败'))
      .finally(() => setLoading(false));
  }, [onToast]);

  if (loading) {
    return (
      <div className="review-loading">
        <span className="review-loading__dot" />
      </div>
    );
  }

  if (!stats) return null;

  const weeks = toWeeks(stats.heatmap);

  return (
    <div className="streak-page">
      {/* 累计天数 */}
      <div className="streak-hero riso-card riso-card--front">
        <p className="streak-hero__label">累计复习天数</p>
        <p className="streak-hero__days">{stats.totalDays}</p>
        <p className="streak-hero__encourage">{encourageText(stats.totalDays)}</p>
      </div>

      {/* 今日进度 */}
      <div className="streak-today">
        <ProgressCircle reviewed={stats.todayReviewed} due={stats.todayReviewed + stats.todayDue} />
        <div className="streak-today__text">
          <p className="streak-today__title">今日进度</p>
          <p className="streak-today__sub">
            {stats.todayDue === 0 && stats.todayReviewed === 0
              ? '今天暂无到期卡片'
              : stats.todayDue === 0
                ? '今日已完成，继续生长 ✓'
                : `还剩 ${stats.todayDue} 张待复习`}
          </p>
        </div>
      </div>

      {/* 热力图 */}
      <div className="streak-heatmap-wrap">
        <p className="field-label">近 16 周复习记录</p>
        <div className="streak-heatmap" role="img" aria-label="复习热力图">
          {/* 周几标签 */}
          <div className="heatmap-dow">
            {WEEK_LABELS.map((l) => (
              <span key={l} className="heatmap-dow__label">{l}</span>
            ))}
          </div>
          {/* 格子 */}
          <div className="heatmap-grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap-col">
                {week.map((day, di) =>
                  day ? (
                    <div
                      key={day.date}
                      className={`heatmap-cell heatmap-cell--l${heatLevel(day.count)}`}
                      title={`${day.date}  ${day.count} 张`}
                    />
                  ) : (
                    <div key={`pad-${wi}-${di}`} className="heatmap-cell heatmap-cell--empty" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="heatmap-legend">
          <span className="heatmap-legend__label">少</span>
          {([0, 1, 2, 3] as const).map((l) => (
            <div key={l} className={`heatmap-cell heatmap-cell--l${l}`} />
          ))}
          <span className="heatmap-legend__label">多</span>
        </div>
      </div>
    </div>
  );
}
