// Admin endpoints: sign in/out, the leads list (with CSV export) and egg-discovery stats.
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { db } from '../db.js';
import {
  COOKIE, cookieOptions, createSession, dummyVerify, requireAdmin, verifyPassword,
} from '../auth.js';
import { COIN_COUNT, EGG_IDS, LEAD_CHOICES } from '../validate.js';

export const adminRouter = Router();

adminRouter.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const loginLimit = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many sign-in attempts. Please wait 15 minutes.' },
});

adminRouter.post('/login', loginLimit, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const admin = email ? await db('admins').where({ email }).first() : null;
  const ok = admin ? await verifyPassword(password, admin.password_hash) : await dummyVerify(password);
  if (!ok) return res.status(401).json({ error: 'Email or password is incorrect.' });

  await db('admins').where({ id: admin.id }).update({ last_login_at: db.fn.now() });
  res.cookie(COOKIE, createSession(admin.id), cookieOptions());
  res.json({ email: admin.email });
});

adminRouter.post('/logout', (req, res) => {
  const { maxAge, ...opts } = cookieOptions();
  res.clearCookie(COOKIE, opts);
  res.status(204).end();
});

// Everything below needs a valid session for an admin that still exists.
adminRouter.use(requireAdmin, async (req, res, next) => {
  const admin = await db('admins').where({ id: req.adminId }).first('id', 'email');
  if (!admin) return res.status(401).json({ error: 'Please sign in.' });
  req.admin = admin;
  next();
});

adminRouter.get('/me', (req, res) => res.json({ email: req.admin.email }));

adminRouter.get('/leads', async (req, res) => {
  const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 100));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  const [rows, [{ total }]] = await Promise.all([
    db('leads').select('id', 'name', 'email', 'choice', 'created_at').orderBy('id', 'desc').limit(limit).offset(offset),
    db('leads').count({ total: '*' }),
  ]);
  res.json({ total: Number(total), limit, offset, leads: rows });
});

// Spreadsheet apps treat cells starting with = + - @ as formulas, so those are prefixed with '.
const csvCell = (v) => {
  let s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

adminRouter.get('/leads.csv', async (req, res) => {
  const rows = await db('leads').select('id', 'name', 'email', 'choice', 'created_at').orderBy('id', 'desc');
  const lines = [['id', 'name', 'email', 'choice', 'created_at'], ...rows.map((r) => [r.id, r.name, r.email, r.choice, r.created_at])];
  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(lines.map((l) => l.map(csvCell).join(',')).join('\r\n'));
});

adminRouter.get('/stats', async (req, res) => {
  const [leadsByChoice, eventCounts, [{ visitors }], [{ leads }]] = await Promise.all([
    db('leads').select('choice').count({ n: '*' }).groupBy('choice'),
    db('events').select('name').count({ n: '*' }).groupBy('name'),
    db('events').countDistinct({ visitors: 'visitor_id' }),
    db('leads').count({ leads: '*' }),
  ]);
  const byName = Object.fromEntries(eventCounts.map((r) => [r.name, Number(r.n)]));
  const byChoice = Object.fromEntries(leadsByChoice.map((r) => [r.choice, Number(r.n)]));

  res.json({
    visitors: Number(visitors), // visitors who found at least one coin or egg
    leads: Number(leads),
    leadsByChoice: Object.fromEntries(LEAD_CHOICES.map((c) => [c, byChoice[c] || 0])),
    eggs: EGG_IDS.map((id) => ({ id, found: byName[`egg:${id}`] || 0 })),
    // coins[i] = how many visitors found at least i + 1 coins
    coins: Array.from({ length: COIN_COUNT }, (_, i) => byName[`coin:${i + 1}`] || 0),
  });
});
