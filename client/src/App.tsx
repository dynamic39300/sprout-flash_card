import { useCallback, useEffect, useRef, useState } from 'react';
import { Brand } from './components/Brand';
import { BottomNav } from './components/BottomNav';
import { CapturePage } from './pages/CapturePage';
import { LibraryPage } from './pages/LibraryPage';
import ReviewPage from './pages/ReviewPage';
import StreakPage from './pages/StreakPage';
import type { TabKey } from './lib/types';

interface ToastState {
  message: string;
  type: 'ok' | 'error';
  id: number;
}

export function App() {
  const [tab, setTab] = useState<TabKey>('review');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [libRefresh, setLibRefresh] = useState(0);
  const [reviewSession, setReviewSession] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);

  const sessionActive = tab === 'review' && reviewSession;

  function handleTabChange(t: TabKey) {
    setTab(t);
    if (t !== 'review') setReviewSession(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const notify = useCallback((message: string, type: 'ok' | 'error' = 'ok') => {
    setToast({ message, type, id: Date.now() });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
    if (type === 'ok') setLibRefresh((n) => n + 1);
  }, []);

  const reviewToast = useCallback((msg: string) => notify(msg, 'error'), [notify]);
  const streakToast = useCallback((msg: string) => notify(msg, 'error'), [notify]);
  const goCapture = useCallback(() => {
    setTab('capture');
    setReviewSession(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    document.body.classList.toggle('body--session', sessionActive);
    return () => document.body.classList.remove('body--session');
  }, [sessionActive]);

  return (
    <div className={`app${sessionActive ? ' app--session' : ' app--shell'}`}>
      {!sessionActive && tab !== 'review' && (
        <header className="app__top">
          <Brand />
        </header>
      )}

      <main className="app__main">
        {tab === 'capture' && <CapturePage notify={notify} />}
        {tab === 'library' && <LibraryPage notify={notify} refreshKey={libRefresh} />}
        {tab === 'review' && (
          <ReviewPage
            onToast={reviewToast}
            onSessionChange={setReviewSession}
            onGoCapture={goCapture}
          />
        )}
        {tab === 'streak' && <StreakPage onToast={streakToast} />}
      </main>

      {toast && (
        <div className={`toast${toast.type === 'error' ? ' toast--error' : ''}`} key={toast.id}>
          {toast.message}
        </div>
      )}

      <BottomNav active={tab} onChange={handleTabChange} muted={sessionActive} />
    </div>
  );
}
