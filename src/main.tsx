import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Yandex moderation checks that browser UI does not interrupt gameplay.
// Prevent context menus and native drag behavior while keeping normal pointer/touch input.
const preventBrowserUi = (event: Event) => event.preventDefault();
document.addEventListener('contextmenu', preventBrowserUi);
document.addEventListener('dragstart', preventBrowserUi);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
