import { useEffect, useMemo, useState } from 'react';
import { listCards, listTags, deleteCard, ApiError } from '../lib/api';
import type { Card } from '../lib/types';
import { useImagePreview } from '../components/ImageLightbox';

interface Props {
  notify: (message: string, type?: 'ok' | 'error') => void;
  refreshKey: number;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isDueTodayOrOverdue(card: Card, today: string): boolean {
  return Boolean(card.dueDate && card.dueDate <= today);
}

function sortLibrary(cards: Card[], today: string): Card[] {
  return [...cards].sort((a, b) => {
    const aDue = isDueTodayOrOverdue(a, today) ? 0 : 1;
    const bDue = isDueTodayOrOverdue(b, today) ? 0 : 1;
    if (aDue !== bDue) return aDue - bDue;
    const ad = a.dueDate ?? '9999';
    const bd = b.dueDate ?? '9999';
    if (ad !== bd) return ad.localeCompare(bd);
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function LibraryPage({ notify, refreshKey }: Props) {
  const { openPreview } = useImagePreview();
  const [cards, setCards] = useState<Card[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const today = todayLocal();

  async function load() {
    setLoading(true);
    try {
      const [c, t] = await Promise.all([
        listCards({ q, tag: activeTag ?? undefined }),
        listTags(),
      ]);
      setCards(c);
      setTags(t);
    } catch (err) {
      notify(err instanceof ApiError ? err.message : '加载失败。', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, activeTag, refreshKey]);

  const sorted = useMemo(() => sortLibrary(cards, today), [cards, today]);

  async function remove(card: Card) {
    try {
      await deleteCard(card.id);
      setCards((prev) => prev.filter((c) => c.id !== card.id));
      notify('已删除');
    } catch (err) {
      notify(err instanceof ApiError ? err.message : '删除失败。', 'error');
    }
  }

  return (
    <div className="library-page">
      <div className="toolbar">
        <input
          className="search"
          placeholder="搜索正反面内容…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {tags.length > 0 && (
        <div className="tags-row tags-row--compact">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className={`tag tag--interactive${activeTag === t ? ' tag--active' : ''}`}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {!loading && cards.length > 0 && (
        <div className="section-count">{cards.length} 张卡片</div>
      )}

      {loading ? null : cards.length === 0 ? (
        <div className="empty">
          <div className="empty__title">
            {q || activeTag ? '没有匹配的卡片' : '还没有卡片'}
          </div>
          <p>
            {q || activeTag
              ? '换个关键词或标签试试。'
              : '去「记卡片」记下第一个知识点吧。'}
          </p>
        </div>
      ) : (
        <div className="library-list">
          {sorted.map((card) => {
            const due = isDueTodayOrOverdue(card, today);
            return (
              <article className={`lib-card${due ? ' lib-card--due' : ''}`} key={card.id}>
                {due && <span className="lib-card__badge">今日到期</span>}
                <div className="lib-card__face">
                  <span className="lib-card__facelabel">正面</span>
                  {card.frontText && <div className="lib-card__text">{card.frontText}</div>}
                  {card.frontImages.length > 0 && (
                    <div className="lib-card__images">
                      {card.frontImages.map((src, idx) => (
                        <img
                          key={src}
                          src={src}
                          alt=""
                          onClick={() => openPreview(card.frontImages, idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="lib-card__face">
                  <span className="lib-card__facelabel">背面</span>
                  {card.backText && <div className="lib-card__text">{card.backText}</div>}
                  {card.backImages.length > 0 && (
                    <div className="lib-card__images">
                      {card.backImages.map((src, idx) => (
                        <img
                          key={src}
                          src={src}
                          alt=""
                          onClick={() => openPreview(card.backImages, idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="lib-card__time">
                  <span>创建 {formatTime(card.createdAt)}</span>
                  {card.updatedAt && card.updatedAt !== card.createdAt && (
                    <span>编辑 {formatTime(card.updatedAt)}</span>
                  )}
                </div>
                <div className="lib-card__foot">
                  <span className="lib-card__meta">
                    {card.tags.length > 0 ? card.tags.map((t) => `#${t}`).join(' ') : '无标签'}
                  </span>
                  <span className="lib-card__due">
                    {card.dueDate ? `复习 ${card.dueDate}` : ''}
                  </span>
                  <button type="button" className="link-danger" onClick={() => remove(card)}>
                    删除
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
