import type { ComponentType, SVGProps } from 'react';
import type { TabKey } from '../lib/types';
import { IconCapture, IconLibrary, IconReview, IconStreak } from './NavIcons';

const ITEMS: { key: TabKey; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: 'review', label: '复习', Icon: IconReview },
  { key: 'capture', label: '记卡片', Icon: IconCapture },
  { key: 'library', label: '卡片库', Icon: IconLibrary },
  { key: 'streak', label: '坚持', Icon: IconStreak },
];

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
  muted?: boolean;
}

export function BottomNav({ active, onChange, muted }: Props) {
  return (
    <nav className={`bottom-nav${muted ? ' bottom-nav--muted' : ''}`} aria-label="主导航">
      {ITEMS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={`nav-item${active === key ? ' nav-item--active' : ''}`}
          onClick={() => onChange(key)}
        >
          <span className="nav-item__glyph" aria-hidden>
            <Icon />
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}
