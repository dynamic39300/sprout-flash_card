import { getDb } from './index.js';
import { addDays } from '../domain/srs.js';
import type { HeatmapDay, StreakStats } from '../types.js';

/** Build an array of 112 YYYY-MM-DD strings ending on `today`. */
function buildDateRange(today: string): string[] {
  const days: string[] = [];
  for (let i = 111; i >= 0; i--) {
    // addDays with negative offset: use a small helper
    const [y, m, d] = today.split('-').map(Number);
    const dt = new Date(y, m - 1, d - i);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    days.push(`${yy}-${mm}-${dd}`);
  }
  return days;
}

export function getStreakStats(today: string): StreakStats {
  const db = getDb();

  const totalDays = (
    db.prepare(`SELECT COUNT(DISTINCT review_day) AS cnt FROM review_logs`).get() as { cnt: number }
  ).cnt;

  const todayReviewed = (
    db.prepare(`SELECT COUNT(*) AS cnt FROM review_logs WHERE review_day = ?`).get(today) as { cnt: number }
  ).cnt;

  const todayDue = (
    db.prepare(`
      SELECT COUNT(*) AS cnt
      FROM review_states rs
      JOIN cards c ON c.id = rs.card_id
      WHERE rs.due_date <= ? AND c.deleted_at IS NULL
    `).get(today) as { cnt: number }
  ).cnt;

  // Pull raw activity within the 112-day window
  const windowStart = buildDateRange(today)[0];
  const rows = db.prepare(`
    SELECT review_day, COUNT(*) AS cnt
    FROM review_logs
    WHERE review_day >= ?
    GROUP BY review_day
  `).all(windowStart) as { review_day: string; cnt: number }[];

  const activityMap = new Map(rows.map((r) => [r.review_day, r.cnt]));
  const heatmap: HeatmapDay[] = buildDateRange(today).map((date) => ({
    date,
    count: activityMap.get(date) ?? 0,
  }));

  return { totalDays, todayReviewed, todayDue, heatmap };
}
