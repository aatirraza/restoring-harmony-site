import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/world.css';
import './styles/forms.css';

// StrictMode is intentionally off: the world engine drives the DOM directly
// and is started once. See CLAUDE.md before turning it on.
createRoot(document.getElementById('root')).render(<App />);
