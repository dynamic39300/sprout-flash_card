import { useState, useEffect, useCallback, useRef } from 'react';
import { getTodayReview, submitRating } from '../lib/api';
import type { Rating, TodayReviewCard } from '../lib/types';

interface ReviewPageProps {
  onToast?: (msg: string) => void;
  onSessionChange?: (active: boolean) => void;
  onGoCapture?: () => void;
}

type CardPhase = 'question' | 'answer';

const RATINGS: { key: Rating; label: string; sub: string; hotkey: string }[] = [
  { key: 'again', label: '再来一次', sub: 'Again', hotkey: '1' },
  { key: 'hard', label: '有点难', sub: 'Hard', hotkey: '2' },
  { key: 'good', label: '记住了', sub: 'Good', hotkey: '3' },
  { key: 'easy', label: '轻而易举', sub: 'Easy', hotkey: '4' },
];

export default function ReviewPage({ onToast, onSessionChange, onGoCapture }: ReviewPageProps) {
  const [queue, setQueue] = useState<TodayReviewCard[]>([]);
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set());
  const [total, setTotal] = useState(0);
  const [phase, setPhase] = useState<CardPhase>('question');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const onToastRef = useRef(onToast);
  onToastRef.current = onToast;

  const current = queue[0] ?? null;
  const doneCount = doneIds.size;
  const isDone = !loading && queue.length === 0;
  const sessionActive = !loading && !isDone;

  useEffect(() => {
    onSessionChange?.(sessionActive);
  }, [sessionActive, onSessionChange]);

  useEffect(() => {
    return () => onSessionChange?.(false);
  }, [onSessionChange]);

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
      onToastRef.current?.('加载复习卡失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleReveal = useCallback(() => {
    setPhase('answer');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
  }, []);

  const handleRate = useCallback(
    async (rating: Rating) => {
      if (!current || submitting) return;
      setSubmitting(true);
      try {
        await submitRating(current.id, rating);
        if (rating === 'again') {
          setQueue((q) => [...q.slice(1), q[0]]);
        } else {
          setDoneIds((s) => new Set([...s, current.id]));
          setQueue((q) => q.slice(1));
        }
        setPhase('question');
        setRevealed(false);
      } catch {
        onToastRef.current?.('评分提交失败，请重试');
      } finally {
        setSubmitting(false);
      }
    },
    [current, submitting],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' && phase === 'question' && sessionActive) {
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
  }, [phase, sessionActive, submitting, handleReveal, handleRate]);

  if (loading) {
    return (
      <div className="review-loading">
        <span className="review-loading__dot" />
      </div>
    );
  }

  return (
    <div className={`review-page${sessionActive ? ' review-page--session' : ''}`}>
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
        <div className="review-done">
          <h2 className="review-done__title">今日已清空</h2>
          <p className="review-done__sub">
            {total === 0
              ? '还没有卡片到期，去记录新知识吧。'
              : `完成了 ${total} 张，继续生长。`}
          </p>
          {total === 0 && onGoCapture && (
            <button type="button" className="btn btn--primary review-done__cta" onClick={onGoCapture}>
              去记卡片
            </button>
          )}
        </div>
      ) : (
        <div className="review-stage">
          <div className="review-stage__card">
            {phase === 'question' ? (
              <div className="review-card review-card--solo riso-card riso-card--front">
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
            ) : (
              <>
                <div className="review-card review-card--mini">
                  <p className="review-card__label">问题</p>
                  <p className="review-card__text review-card__text--compact">
                    {current?.frontText || '（图片题）'}
                  </p>
                </div>
                <div
                  className={`review-card review-card--solo riso-card riso-card--back ${revealed ? 'review-card--revealed' : ''}`}
                >
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
              </>
            )}
          </div>

          <div className="review-dock">
            {phase === 'question' ? (
              <button type="button" className="btn-reveal" onClick={handleReveal}>
                翻面看答案
              </button>
            ) : (
              <div className="review-ratings" role="group" aria-label="难度评分">
                {RATINGS.map(({ key, label, sub, hotkey }) => (
                  <button
                    key={key}
                    type="button"
                    className={`btn-rating btn-rating--${key}`}
                    onClick={() => void handleRate(key)}
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
