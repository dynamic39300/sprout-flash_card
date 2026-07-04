import type { Card, CreateCardInput, Rating, TodayReviewCard, TodayReviewResult, StreakStats } from './types';

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ApiError('BAD_RESPONSE', '服务器返回异常，请稍后再试。');
  }
  const payload = body as
    | { ok: true; data: T }
    | { ok: false; error: { code: string; message: string } };
  if (!payload.ok) {
    throw new ApiError(payload.error.code, payload.error.message);
  }
  return payload.data;
}

export async function uploadImage(file: File | Blob): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const data = await request<{ path: string }>('/api/images', {
    method: 'POST',
    body: form,
  });
  return data.path;
}

export function createCard(input: CreateCardInput): Promise<Card> {
  return request<Card>('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function listCards(params: { q?: string; tag?: string } = {}): Promise<Card[]> {
  const usp = new URLSearchParams();
  if (params.q) usp.set('q', params.q);
  if (params.tag) usp.set('tag', params.tag);
  const qs = usp.toString();
  return request<Card[]>(`/api/cards${qs ? `?${qs}` : ''}`);
}

export function listTags(): Promise<string[]> {
  return request<string[]>('/api/tags');
}

export function deleteCard(id: number): Promise<{ id: number }> {
  return request<{ id: number }>(`/api/cards/${id}`, { method: 'DELETE' });
}

export function getTodayReview(): Promise<TodayReviewResult> {
  return request<TodayReviewResult>('/api/reviews/today');
}

export function submitRating(cardId: number, rating: Rating): Promise<TodayReviewCard['reviewState']> {
  return request(`/api/reviews/${cardId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  });
}

export function getStreakStats(): Promise<StreakStats> {
  return request<StreakStats>('/api/stats/streak');
}
