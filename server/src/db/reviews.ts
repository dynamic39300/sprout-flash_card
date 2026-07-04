import { getDb } from './index.js';
import { getCardById } from './cards.js';
import { scheduleSM2 } from '../domain/srs.js';
import type { Rating, ReviewState, TodayReviewCard, TodayReviewResult } from '../types.js';

export function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

interface ReviewStateRow {
  card_id: number;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  due_date: string;
  last_reviewed_at: string | null;
}

function rowToReviewState(row: ReviewStateRow): ReviewState {
  return {
    cardId: row.card_id,
    easeFactor: row.ease_factor,
    intervalDays: row.interval_days,
    repetitions: row.repetitions,
    dueDate: row.due_date,
    lastReviewedAt: row.last_reviewed_at,
  };
}

/** Return all cards due on or before today, ordered by due_date then card_id. */
export function getTodayReview(): TodayReviewResult {
  const db = getDb();
  const today = todayString();

  const rows = db.prepare(`
    SELECT rs.*
    FROM review_states rs
    JOIN cards c ON c.id = rs.card_id
    WHERE rs.due_date <= ?
      AND c.deleted_at IS NULL
    ORDER BY rs.due_date ASC, rs.card_id ASC
  `).all(today) as ReviewStateRow[];

  const cards: TodayReviewCard[] = rows.map((row) => {
    const card = getCardById(row.card_id);
    if (!card) throw new Error(`Card ${row.card_id} not found`);
    return { ...card, reviewState: rowToReviewState(row) };
  });

  return { total: cards.length, cards };
}

/** Submit a rating for a card, update SM-2 state, write review log. */
export function submitRating(cardId: number, rating: Rating): ReviewState {
  const db = getDb();
  const today = todayString();
  const now = new Date().toISOString();

  const existing = db.prepare(`
    SELECT * FROM review_states WHERE card_id = ?
  `).get(cardId) as ReviewStateRow | undefined;

  if (!existing) {
    throw new Error(`No review state found for card ${cardId}`);
  }

  const result = scheduleSM2({
    easeFactor: existing.ease_factor,
    intervalDays: existing.interval_days,
    repetitions: existing.repetitions,
    rating,
    today,
  });

  const update = db.transaction(() => {
    db.prepare(`
      UPDATE review_states
      SET ease_factor = ?, interval_days = ?, repetitions = ?, due_date = ?, last_reviewed_at = ?
      WHERE card_id = ?
    `).run(result.easeFactor, result.intervalDays, result.repetitions, result.dueDate, now, cardId);

    db.prepare(`
      INSERT INTO review_logs (card_id, reviewed_at, review_day, rating)
      VALUES (?, ?, ?, ?)
    `).run(cardId, now, today, rating);
  });

  update();

  return {
    cardId,
    easeFactor: result.easeFactor,
    intervalDays: result.intervalDays,
    repetitions: result.repetitions,
    dueDate: result.dueDate,
    lastReviewedAt: now,
  };
}
