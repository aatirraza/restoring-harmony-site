// Restoring Harmony API server (Express).
// In development Vite serves the site on :5173 and proxies /api here.
// In production this one process serves both the API and the built site from dist/.
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import { config } from './config.js';
import { db, migrate } from './db.js';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';

const app = express();
app.set('trust proxy', config.trustProxy);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }),
);

const api = express.Router();
api.use(express.json({ limit: '10kb' }));
api.get('/health', async (req, res) => {
  await db.raw('select 1');
  res.json({ ok: true });
});
api.use(publicRouter);
api.use('/admin', adminRouter);
api.use((req, res) => res.status(404).json({ error: 'Not found.' }));
api.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large.' });
  console.error('[api]', err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});
app.use('/api', api);

const dist = path.join(config.root, 'dist');
if (config.serveStatic && fs.existsSync(dist)) {
  app.use(express.static(dist, { index: 'index.html', maxAge: '1h' }));
  app.get('/admin', (req, res) => res.sendFile(path.join(dist, 'admin.html')));
  app.use((req, res) => res.status(404).sendFile(path.join(dist, 'index.html')));
}

await migrate();
app.listen(config.port, () => {
  console.log(`[api] listening on http://localhost:${config.port} (db: ${config.db.kind})`);
});
