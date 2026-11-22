import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { startDomLocalization } from './utils/i18n';

// Portal builds should prevent the browser context menu from interrupting gameplay.
// Prevent context menus and native drag behavior while keeping normal pointer/touch input.
const preventBrowserUi = (event: Event) => event.preventDefault();
document.addEventListener('contextmenu', preventBrowserUi);
document.addEventListener('dragstart', preventBrowserUi);

// English is the default UI language. The localization observer also translates
// React content that is rendered later or updated dynamically.
startDomLocalization();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
