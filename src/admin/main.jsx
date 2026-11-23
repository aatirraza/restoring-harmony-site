import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Admin from './Admin.jsx';
import './admin.css';

// The admin page is ordinary React (no world engine), so StrictMode is safe here.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Admin />
  </StrictMode>,
);
