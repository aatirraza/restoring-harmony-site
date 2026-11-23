// Talks to the backend (server/). Calls fail quietly for tracking, so the site
// still works as a pure static page when no API is running.
// Set VITE_API_URL at build time only if the API lives on a different origin.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

let vid;
export function visitorId() {
  if (vid) return vid;
  try {
    vid = localStorage.getItem('rh_vid');
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem('rh_vid', vid);
    }
  } catch {
    vid = crypto.randomUUID(); // private mode: per-visit id
  }
  return vid;
}

const sent = new Set();
export function track(name) {
  if (sent.has(name)) return;
  sent.add(name);
  fetch(`${BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId: visitorId(), name }),
    keepalive: true,
  }).catch(() => {});
}

// Resolves to { ok: true } or { ok: false, error, fields? }.
export async function submitLead(data) {
  try {
    const res = await fetch(`${BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, visitorId: visitorId() }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.error || 'Something went wrong. Please try again.', fields: body.fields };
  } catch {
    return { ok: false, error: 'We could not reach the server. Please check your connection and try again.' };
  }
}
