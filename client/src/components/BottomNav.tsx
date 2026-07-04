import type { TabKey } from '../lib/types';

const ITEMS: { key: TabKey; label: string; glyph: string }[] = [
  { key: 'review', label: '复习', glyph: '◑' },
  { key: 'capture', label: '记卡片', glyph: '✎' },
  { key: 'library', label: '卡片库', glyph: '▤' },
  { key: 'streak', label: '坚持', glyph: '✦' },
];

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`nav-item${active === item.key ? ' nav-item--active' : ''}`}
          onClick={() => onChange(item.key)}
        >
          <span className="nav-item__glyph" aria-hidden>
            {item.glyph}
          </span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
