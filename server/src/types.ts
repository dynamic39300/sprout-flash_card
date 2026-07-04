export type CardSide = 'front' | 'back';

export interface Card {
  id: number;
  frontText: string;
  backText: string;
  frontImages: string[];
  backImages: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface CreateCardInput {
  frontText?: string;
  backText?: string;
  frontImages?: string[];
  backImages?: string[];
  tags?: string[];
}

export type UpdateCardInput = CreateCardInput;

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewState {
  cardId: number;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueDate: string;
  lastReviewedAt: string | null;
}

export interface TodayReviewCard extends Card {
  reviewState: ReviewState;
}

export interface TodayReviewResult {
  total: number;
  cards: TodayReviewCard[];
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface StreakStats {
  totalDays: number;
  todayReviewed: number;
  todayDue: number;
  heatmap: HeatmapDay[];
}

export interface ApiOk<T> {
  ok: true;
  data: T;
}

export interface ApiErr {
  ok: false;
  error: { code: string; message: string };
}
