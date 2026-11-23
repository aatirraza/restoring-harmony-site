// Public endpoints called by the site: lead capture and easter-egg tracking.
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { db } from '../db.js';
import { EVENT_NAMES, parseLead, parseVisitorId } from '../validate.js';

export const publicRouter = Router();

const limit = (windowMinutes, max) =>
  rateLimit({
    windowMs: windowMinutes * 60_000,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  });

// POST /api/leads  { name, email, choice, visitorId? }
publicRouter.post('/leads', limit(60, 10), async (req, res) => {
  // Honeypot: a hidden "website" field that people never fill in but bots do.
  if (req.body?.website) return res.status(201).json({ ok: true });

  const { errors, lead } = parseLead(req.body);
  if (Object.keys(errors).length) return res.status(422).json({ error: 'Please check the form.', fields: errors });

  await db('leads').insert(lead);
  res.status(201).json({ ok: true });
});

// POST /api/events  { visitorId, name }  where name is "egg:<id>" or "coin:<n>"
// Repeats from the same visitor are ignored, so each discovery is counted once.
publicRouter.post('/events', limit(60, 300), async (req, res) => {
  const visitor_id = parseVisitorId(req.body?.visitorId);
  const name = req.body?.name;
  if (!visitor_id || !EVENT_NAMES.has(name)) return res.status(422).json({ error: 'Unknown event.' });

  await db('events').insert({ visitor_id, name }).onConflict(['visitor_id', 'name']).ignore();
  res.status(204).end();
});
