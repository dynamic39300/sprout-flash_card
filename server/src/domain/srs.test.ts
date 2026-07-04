import { describe, it, expect } from 'vitest';
import { scheduleSM2, addDays } from './srs.js';

describe('addDays', () => {
  it('adds days across month boundary', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02');
  });
  it('adds days across year boundary', () => {
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01');
  });
  it('adds zero days', () => {
    expect(addDays('2026-07-04', 0)).toBe('2026-07-04');
  });
});

describe('scheduleSM2', () => {
  const base = { easeFactor: 2.5, intervalDays: 0, repetitions: 0, today: '2026-07-04' };

  describe('failed recall (again / hard below q<3)', () => {
    it('again: resets repetitions to 0 and interval to 1', () => {
      const r = scheduleSM2({ ...base, rating: 'again' });
      expect(r.repetitions).toBe(0);
      expect(r.intervalDays).toBe(1);
      expect(r.dueDate).toBe('2026-07-05');
    });

    it('again after several reps: still resets', () => {
      const r = scheduleSM2({ ...base, easeFactor: 2.5, intervalDays: 30, repetitions: 5, rating: 'again' });
      expect(r.repetitions).toBe(0);
      expect(r.intervalDays).toBe(1);
    });
  });

  describe('successful recall (good / easy / hard q>=3)', () => {
    it('first rep (rep=0) with good: interval=1, rep becomes 1', () => {
      const r = scheduleSM2({ ...base, rating: 'good' });
      expect(r.repetitions).toBe(1);
      expect(r.intervalDays).toBe(1);
      expect(r.dueDate).toBe('2026-07-05');
    });

    it('second rep (rep=1) with good: interval=6, rep becomes 2', () => {
      const r = scheduleSM2({ ...base, repetitions: 1, intervalDays: 1, rating: 'good' });
      expect(r.repetitions).toBe(2);
      expect(r.intervalDays).toBe(6);
      expect(r.dueDate).toBe('2026-07-10');
    });

    it('third rep (rep=2): interval = round(prev * ef)', () => {
      const r = scheduleSM2({ ...base, repetitions: 2, intervalDays: 6, rating: 'good' });
      expect(r.repetitions).toBe(3);
      expect(r.intervalDays).toBe(Math.round(6 * 2.5));
    });

    it('easy: interval grows faster due to lower EF delta penalty', () => {
      const good = scheduleSM2({ ...base, repetitions: 2, intervalDays: 6, rating: 'good' });
      const easy = scheduleSM2({ ...base, repetitions: 2, intervalDays: 6, rating: 'easy' });
      expect(easy.easeFactor).toBeGreaterThan(good.easeFactor);
    });
  });

  describe('ease factor bounds', () => {
    it('EF never drops below 1.3', () => {
      let state = { ...base };
      for (let i = 0; i < 20; i++) {
        const r = scheduleSM2({ ...state, rating: 'again' });
        expect(r.easeFactor).toBeGreaterThanOrEqual(1.3);
        state = { ...state, ...r, today: r.dueDate };
      }
    });

    it('EF increases with easy ratings', () => {
      const r = scheduleSM2({ ...base, rating: 'easy' });
      expect(r.easeFactor).toBeGreaterThan(2.5);
    });

    it('hard (q=3) slightly decreases EF', () => {
      const r = scheduleSM2({ ...base, rating: 'hard' });
      expect(r.easeFactor).toBeLessThan(2.5);
    });
  });

  describe('multi-step scheduling', () => {
    it('follows expected interval growth: 0→1→6→interval pattern', () => {
      let state = { easeFactor: 2.5, intervalDays: 0, repetitions: 0, today: '2026-07-04' };
      const r1 = scheduleSM2({ ...state, rating: 'good' });
      expect(r1.intervalDays).toBe(1);

      state = { ...r1, today: r1.dueDate };
      const r2 = scheduleSM2({ ...state, rating: 'good' });
      expect(r2.intervalDays).toBe(6);

      state = { ...r2, today: r2.dueDate };
      const r3 = scheduleSM2({ ...state, rating: 'good' });
      expect(r3.intervalDays).toBe(Math.round(6 * r2.easeFactor));
    });
  });
});
