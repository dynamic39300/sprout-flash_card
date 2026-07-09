import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './styles/app.css';
import { App } from './App';
import { ImagePreviewProvider } from './components/ImageLightbox';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('root element missing');

createRoot(rootEl).render(
  <StrictMode>
    <ImagePreviewProvider>
      <App />
    </ImagePreviewProvider>
  </StrictMode>,
);
