import { useState, useEffect, useCallback } from 'react';
import { getTodayReview, submitRating } from '../lib/api';
import type { Rating, TodayReviewCard } from '../lib/types';

interface ReviewPageProps {
  onToast?: (msg: string) => void;
}

type CardPhase = 'question' | 'answer';

const RATINGS: { key: Rating; label: string; sub: string; hotkey: string }[] = [
  { key: 'again',  label: '再来一次',  sub: 'Again',  hotkey: '1' },
  { key: 'hard',   label: '有点难',    sub: 'Hard',   hotkey: '2' },
  { key: 'good',   label: '记住了',    sub: 'Good',   hotkey: '3' },
  { key: 'easy',   label: '轻而易举',  sub: 'Easy',   hotkey: '4' },
];

export default function ReviewPage({ onToast }: ReviewPageProps) {
  const [queue, setQueue] = useState<TodayReviewCard[]>([]);
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set());
  const [total, setTotal] = useState(0);
  const [phase, setPhase] = useState<CardPhase>('question');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const current = queue[0] ?? null;
  const doneCount = doneIds.size;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTodayReview();
      setQueue(result.cards);
      setTotal(result.total);
      setDoneIds(new Set());
      setPhase('question');
      setRevealed(false);
    } catch {
      onToast?.('加载复习卡失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => { void load(); }, [load]);

  // Keyboard shortcuts: Space to reveal, 1-4 to rate
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' && phase === 'question' && !loading) {
        e.preventDefault();
        handleReveal();
      }
      if (phase === 'answer' && !submitting) {
        const idx = ['1', '2', '3', '4'].indexOf(e.key);
        if (idx !== -1) void handleRate(RATINGS[idx].key);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, loading, submitting]);

  function handleReveal() {
    setPhase('answer');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
  }

  async function handleRate(rating: Rating) {
    if (!current || submitting) return;
    setSubmitting(true);
    try {
      await submitRating(current.id, rating);
      if (rating === 'again') {
        // Re-queue at the end of the current session so the user practices it again today
        setQueue((q) => [...q.slice(1), q[0]]);
      } else {
        setDoneIds((s) => new Set([...s, current.id]));
        setQueue((q) => q.slice(1));
      }
      setPhase('question');
      setRevealed(false);
    } catch {
      onToast?.('评分提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="review-loading">
        <span className="review-loading__dot" />
      </div>
    );
  }

  const isDone = !loading && queue.length === 0;

  return (
    <div className="review-page">
      {/* 进度条 */}
      <div className="review-progress" role="status" aria-label="今日复习进度">
        <div
          className="review-progress__bar"
          style={{ width: total > 0 ? `${(doneCount / total) * 100}%` : '0%' }}
        />
        <span className="review-progress__label">
          {isDone && total === 0 ? '今日无待复习' : `${doneCount} / ${total}`}
        </span>
      </div>

      {isDone ? (
        /* ── 完成态 ── */
        <div className="review-done">
          <div className="review-done__sprout" aria-hidden>🌱</div>
          <h2 className="review-done__title">今日已清空</h2>
          <p className="review-done__sub">
            {total === 0
              ? '还没有卡片到期，去记录新知识吧。'
              : `完成了 ${total} 张，继续生长。`}
          </p>
        </div>
      ) : (
        /* ── 翻卡区 ── */
        <div className="review-card-area">
          {/* 正面 */}
          <div className={`riso-card riso-card--front review-card review-card--front ${phase === 'answer' ? 'review-card--collapsed' : ''}`}>
            <p className="review-card__label">问题</p>
            <div className="review-card__content">
              {current?.frontText && (
                <p className="review-card__text">{current.frontText}</p>
              )}
              {current?.frontImages?.map((src) => (
                <img key={src} src={src} className="review-card__img" alt="" />
              ))}
            </div>
          </div>

          {/* 背面（揭晓） */}
          {phase === 'answer' && (
            <div className={`riso-card riso-card--back review-card review-card--back ${revealed ? 'review-card--revealed' : ''}`}>
              <p className="review-card__label">答案</p>
              <div className="review-card__content">
                {current?.backText && (
                  <p className="review-card__text">{current.backText}</p>
                )}
                {current?.backImages?.map((src) => (
                  <img key={src} src={src} className="review-card__img" alt="" />
                ))}
              </div>
            </div>
          )}

          {/* 操作区 */}
          <div className="review-actions">
            {phase === 'question' ? (
              <button className="btn-reveal" onClick={handleReveal}>
                翻面看答案 <span className="btn-reveal__arrow">↓</span>
              </button>
            ) : (
              <div className="review-ratings" role="group" aria-label="难度评分">
                {RATINGS.map(({ key, label, sub, hotkey }) => (
                  <button
                    key={key}
                    className={`btn-rating btn-rating--${key}`}
                    onClick={() => handleRate(key)}
                    disabled={submitting}
                  >
                    <span className="btn-rating__label">{label}</span>
                    <span className="btn-rating__sub">{sub}</span>
                    <span className="btn-rating__hotkey">{hotkey}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
