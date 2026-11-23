// Server settings, read from environment variables (or a .env file in the project root).
// See .env.example for every option.
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;
const isProd = env.NODE_ENV === 'production';

const DB_CLIENTS = { sqlite: 'better-sqlite3', mysql: 'mysql2', postgres: 'pg' };
const dbKind = (env.DB_CLIENT || 'sqlite').toLowerCase();
if (!DB_CLIENTS[dbKind]) {
  throw new Error(`DB_CLIENT must be one of: ${Object.keys(DB_CLIENTS).join(', ')} (got "${dbKind}")`);
}

if (isProd && (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32)) {
  throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters in production.');
}

export const config = {
  root: ROOT,
  isProd,
  port: Number(env.PORT) || 3001,
  // Number of proxies in front of the app (cPanel/Passenger, nginx). Needed for correct client IPs in rate limiting.
  trustProxy: env.TRUST_PROXY ? Number(env.TRUST_PROXY) : 0,
  sessionSecret: env.SESSION_SECRET || 'dev-only-secret-change-me-dev-only-secret',
  sessionHours: Number(env.SESSION_HOURS) || 12,
  serveStatic: env.SERVE_STATIC !== 'false',
  db: {
    kind: dbKind,
    client: DB_CLIENTS[dbKind],
    connection:
      dbKind === 'sqlite'
        ? { filename: path.resolve(ROOT, env.SQLITE_FILE || 'data/dev.sqlite') }
        : env.DATABASE_URL || {
            host: env.DB_HOST || '127.0.0.1',
            port: env.DB_PORT ? Number(env.DB_PORT) : undefined,
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
            ssl: env.DB_SSL === 'true' ? { rejectUnauthorized: env.DB_SSL_STRICT !== 'false' } : undefined,
          },
  },
};
