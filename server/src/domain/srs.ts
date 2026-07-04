import type { Rating } from '../types.js';

export interface SrsInput {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  rating: Rating;
  today: string; // YYYY-MM-DD
}

export interface SrsOutput {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueDate: string; // YYYY-MM-DD
}

const RATING_QUALITY: Record<Rating, number> = {
  again: 2,
  hard: 3,
  good: 4,
  easy: 5,
};

/** Add `days` calendar days to a YYYY-MM-DD string without timezone drift. */
export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(year, month - 1, day + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * SM-2 scheduling algorithm.
 * Returns updated scheduling parameters and the next due date.
 *
 * Reference: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */
export function scheduleSM2(input: SrsInput): SrsOutput {
  const q = RATING_QUALITY[input.rating];
  let { easeFactor, intervalDays, repetitions } = input;

  if (q < 3) {
    // Failed recall → reset to beginning
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Successful recall
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor (EF must not drop below 1.3)
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  easeFactor = Math.max(1.3, easeFactor + delta);

  const dueDate = addDays(input.today, intervalDays);

  return { easeFactor, intervalDays, repetitions, dueDate };
}
