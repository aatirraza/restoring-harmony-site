// Input rules shared by the API routes. The egg ids must match EGGS in src/engine/world.js.

export const EGG_IDS = ['eyes', 'beam', 'harmony', 'coins', 'room', 'rams', 'fire', 'twins', 'sig'];
export const COIN_COUNT = 7;
export const EVENT_NAMES = new Set([
  ...EGG_IDS.map((id) => `egg:${id}`),
  ...Array.from({ length: COIN_COUNT }, (_, i) => `coin:${i + 1}`),
]);

// The options on the unlock page. Keep in sync with the radio values in OfferPage.jsx.
export const LEAD_CHOICES = ['full', 'trustpilot', 'google'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VISITOR_RE = /^[0-9a-f-]{36}$/i;

const clean = (v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');

export function parseVisitorId(v) {
  return typeof v === 'string' && VISITOR_RE.test(v) ? v.toLowerCase() : null;
}

export function parseLead(body = {}) {
  const errors = {};
  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const choice = clean(body.choice);
  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > 120) errors.name = 'That name is too long.';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  if (!LEAD_CHOICES.includes(choice)) errors.choice = 'Please choose an option.';
  return { errors, lead: { name, email, choice, visitor_id: parseVisitorId(body.visitorId) } };
}
