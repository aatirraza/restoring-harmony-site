// Admin passwords and sessions, using only Node's built-in crypto.
// Passwords: scrypt with a random salt. Sessions: an HMAC-signed, httpOnly cookie.
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { config } from './config.js';

const scrypt = promisify(crypto.scrypt);
const KEYLEN = 64;
export const COOKIE = 'rh_admin';

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, KEYLEN);
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, saltB64, keyB64] = String(stored).split('$');
  if (scheme !== 'scrypt' || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, 'base64');
  const key = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length);
  return crypto.timingSafeEqual(key, expected);
}

// A fixed hash to compare against when the email is unknown, so a login attempt
// takes the same time whether or not the account exists.
let dummyHash;
export async function dummyVerify(password) {
  dummyHash ??= await hashPassword(crypto.randomBytes(16).toString('hex'));
  await verifyPassword(password, dummyHash);
  return false;
}

const sign = (data) => crypto.createHmac('sha256', config.sessionSecret).update(data).digest('base64url');

export function createSession(adminId) {
  const payload = Buffer.from(
    JSON.stringify({ sub: adminId, exp: Date.now() + config.sessionHours * 3600_000 }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSession(token) {
  if (typeof token !== 'string') return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const a = Buffer.from(sig), b = Buffer.from(sign(payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.isProd,
    path: '/api/admin',
    maxAge: config.sessionHours * 3600_000,
  };
}

export function getCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export function requireAdmin(req, res, next) {
  const session = readSession(getCookie(req, COOKIE));
  if (!session) return res.status(401).json({ error: 'Please sign in.' });
  req.adminId = session.sub;
  next();
}
