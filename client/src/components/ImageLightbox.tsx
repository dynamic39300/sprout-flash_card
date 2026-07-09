import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface PreviewState {
  images: string[];
  index: number;
}

interface ImagePreviewContextValue {
  /** 打开大图预览；传入同组图片与起始下标以支持左右切换 */
  openPreview: (images: string[], startIndex?: number) => void;
}

const ImagePreviewContext = createContext<ImagePreviewContextValue | null>(null);

export function useImagePreview(): ImagePreviewContextValue {
  const ctx = useContext(ImagePreviewContext);
  if (!ctx) throw new Error('useImagePreview 必须在 ImagePreviewProvider 内使用');
  return ctx;
}

export function ImagePreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PreviewState | null>(null);

  const openPreview = useCallback((images: string[], startIndex = 0) => {
    if (images.length === 0) return;
    const index = Math.max(0, Math.min(startIndex, images.length - 1));
    setState({ images, index });
  }, []);

  const close = useCallback(() => setState(null), []);

  const go = useCallback((dir: number) => {
    setState((s) => {
      if (!s) return s;
      const n = s.images.length;
      return { ...s, index: (s.index + dir + n) % n };
    });
  }, []);

  useEffect(() => {
    if (!state) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    }
    window.addEventListener('keydown', onKey);
    // 打开时锁滚动，避免背景跟随滑动
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [state, close, go]);

  const multiple = (state?.images.length ?? 0) > 1;

  return (
    <ImagePreviewContext.Provider value={{ openPreview }}>
      {children}
      {state && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button
            type="button"
            className="lightbox__close"
            aria-label="关闭"
            onClick={close}
          >
            ×
          </button>
          {multiple && (
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              aria-label="上一张"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
            >
              ‹
            </button>
          )}
          <img
            className="lightbox__img"
            src={state.images[state.index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          {multiple && (
            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              aria-label="下一张"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
            >
              ›
            </button>
          )}
          {multiple && (
            <div className="lightbox__counter">
              {state.index + 1} / {state.images.length}
            </div>
          )}
        </div>
      )}
    </ImagePreviewContext.Provider>
  );
}
