import { useCallback, useRef, useState } from 'react';
import { Brand } from './components/Brand';
import { BottomNav } from './components/BottomNav';
import { CapturePage } from './pages/CapturePage';
import { LibraryPage } from './pages/LibraryPage';
import ReviewPage from './pages/ReviewPage';
import StreakPage from './pages/StreakPage';
import type { TabKey } from './lib/types';

const HEADERS: Record<TabKey, { eyebrow: string; title: string }> = {
  review: { eyebrow: 'REVIEW / 今日', title: '今日复习' },
  capture: { eyebrow: 'CAPTURE / 记录', title: '记一张卡片' },
  library: { eyebrow: 'LIBRARY / 卡片库', title: '卡片库' },
  streak: { eyebrow: 'STREAK / 坚持', title: '我的坚持' },
};

interface ToastState {
  message: string;
  type: 'ok' | 'error';
  id: number;
}

export function App() {
  const [tab, setTab] = useState<TabKey>('review');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [libRefresh, setLibRefresh] = useState(0);
  const toastTimer = useRef<number | undefined>(undefined);

  function handleTabChange(t: TabKey) {
    setTab(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const notify = useCallback((message: string, type: 'ok' | 'error' = 'ok') => {
    setToast({ message, type, id: Date.now() });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
    // 记卡成功后，让卡片库下次进入时刷新
    if (type === 'ok') setLibRefresh((n) => n + 1);
  }, []);

  const header = HEADERS[tab];

  return (
    <div className="app">
      <Brand />
      <header className="app__header">
        <div className="eyebrow">{header.eyebrow}</div>
        <h1 className="app__title">{header.title}</h1>
      </header>

      <main className="app__main">
        {tab === 'capture' && <CapturePage notify={notify} />}
        {tab === 'library' && <LibraryPage notify={notify} refreshKey={libRefresh} />}
        {tab === 'review' && <ReviewPage onToast={(msg) => notify(msg, 'error')} />}
        {tab === 'streak' && <StreakPage onToast={(msg) => notify(msg, 'error')} />}
      </main>

      {toast && (
        <div className={`toast${toast.type === 'error' ? ' toast--error' : ''}`} key={toast.id}>
          {toast.message}
        </div>
      )}

      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  );
}
