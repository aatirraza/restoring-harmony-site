// Create an admin account, or reset its password if the email already exists.
// Usage: npm run admin:create -- you@example.com
// The password is asked for in the terminal so it never lands in shell history.
import readline from 'node:readline';
import { db, migrate } from '../db.js';
import { hashPassword } from '../auth.js';

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : '');
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

const email = String(process.argv[2] || '').trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: npm run admin:create -- you@example.com');
  process.exit(1);
}

try {
  await migrate();
  const password = process.env.ADMIN_PASSWORD || (await askHidden('Password (min 12 characters): '));
  if (password.length < 12) throw new Error('Password must be at least 12 characters.');
  const password_hash = await hashPassword(password);
  const existing = await db('admins').where({ email }).first();
  if (existing) await db('admins').where({ id: existing.id }).update({ password_hash });
  else await db('admins').insert({ email, password_hash });
  console.log(existing ? `Password updated for ${email}.` : `Admin ${email} created.`);
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await db.destroy();
}
