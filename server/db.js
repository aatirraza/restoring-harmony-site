// One Knex instance for the whole server. The same queries run on SQLite (local),
// MySQL or PostgreSQL; pick one with DB_CLIENT in .env.
import fs from 'node:fs';
import path from 'node:path';
import knex from 'knex';
import { config } from './config.js';
import * as m001 from './migrations/001_init.js';

if (config.db.kind === 'sqlite') {
  fs.mkdirSync(path.dirname(config.db.connection.filename), { recursive: true });
}

export const db = knex({
  client: config.db.client,
  connection: config.db.connection,
  useNullAsDefault: config.db.kind === 'sqlite',
  pool: config.db.kind === 'sqlite' ? { min: 1, max: 1 } : { min: 0, max: 10 },
});

// Migrations are listed in code (not loaded from a folder) so they work the same
// in every environment. Add new ones to the end of this list; never edit old ones.
const MIGRATIONS = { '001_init': m001 };

const migrationSource = {
  getMigrations: async () => Object.keys(MIGRATIONS),
  getMigrationName: (name) => name,
  getMigration: async (name) => MIGRATIONS[name],
};

export async function migrate() {
  const [, applied] = await db.migrate.latest({ migrationSource });
  if (applied.length) console.log(`[db] applied migrations: ${applied.join(', ')}`);
}
