// Admin page: sign in, then see leads and easter-egg discovery stats.
import { useCallback, useEffect, useState } from 'react';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function api(path, options = {}) {
  const res = await fetch(`${BASE}/api/admin${path}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const body = res.status === 204 ? null : await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body?.error || 'Request failed.'), { status: res.status });
  return body;
}

const EGG_LABELS = {
  eyes: 'The eyes in the dark', beam: 'The beam', harmony: 'Her name', coins: 'Seven gold coins',
  room: 'Room 144', rams: 'Twelve rams', fire: 'Darkness disappears', twins: 'The twins', sig: 'A signature',
};
const CHOICE_LABELS = { full: 'Full price · $1,999', trustpilot: 'Trustpilot · $1,499', google: 'Google · $1,749' };
const PAGE = 50;

const fmtDate = (v) => {
  const d = new Date(typeof v === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(v) ? `${v.replace(' ', 'T')}Z` : v);
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

export default function Admin() {
  const [me, setMe] = useState(undefined); // undefined = checking, null = signed out
  useEffect(() => {
    api('/me').then(setMe).catch(() => setMe(null));
  }, []);

  if (me === undefined) return <main className="adm center"><p className="muted">Loading…</p></main>;
  if (!me) return <Login onIn={setMe} />;
  return <Dashboard me={me} onOut={() => setMe(null)} />;
}

function Login({ onIn }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      onIn(await api('/login', { method: 'POST', body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="adm center">
      <form className="panel login" onSubmit={submit}>
        <div className="eyebrow">Restoring Harmony</div>
        <h1>Admin sign in</h1>
        <label className="field"><span>Email</span><input name="email" type="email" autoComplete="username" required /></label>
        <label className="field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="err" role="alert">{error}</p>
      </form>
    </main>
  );
}

function Dashboard({ me, onOut }) {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState({ total: 0, leads: [] });
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState('');

  const guard = useCallback((err) => (err.status === 401 ? onOut() : setError(err.message)), [onOut]);

  const loadStats = useCallback(() => api('/stats').then(setStats).catch(guard), [guard]);
  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => {
    api(`/leads?limit=${PAGE}&offset=${offset}`).then(setLeads).catch(guard);
  }, [offset, guard]);

  async function signOut() {
    await api('/logout', { method: 'POST' }).catch(() => {});
    onOut();
  }

  const maxEgg = Math.max(1, ...(stats?.eggs.map((e) => e.found) || [0]));
  const maxCoin = Math.max(1, ...(stats?.coins || [0]));

  return (
    <main className="adm">
      <header className="top">
        <div>
          <div className="eyebrow">Restoring Harmony</div>
          <h1>Admin</h1>
        </div>
        <div className="who">
          <span className="muted">{me.email}</span>
          <button className="btn ghost" onClick={signOut}>Sign out</button>
        </div>
      </header>

      {error && <p className="err" role="alert">{error}</p>}

      <section className="tiles">
        <div className="panel tile"><span className="muted">Leads</span><b>{stats?.leads ?? '–'}</b></div>
        <div className="panel tile"><span className="muted">Explorers</span><b>{stats?.visitors ?? '–'}</b><small className="muted">visitors who found a coin or an egg</small></div>
        {stats && Object.entries(stats.leadsByChoice).map(([c, n]) => (
          <div className="panel tile" key={c}><span className="muted">{CHOICE_LABELS[c] || c}</span><b>{n}</b></div>
        ))}
      </section>

      <section className="grid">
        <div className="panel">
          <div className="head"><h2>Easter eggs found</h2><button className="link" onClick={loadStats}>Refresh</button></div>
          <ul className="bars">
            {stats?.eggs.map((e) => (
              <li key={e.id}>
                <span>{EGG_LABELS[e.id] || e.id}</span>
                <i style={{ '--w': `${(e.found / maxEgg) * 100}%` }} />
                <b>{e.found}</b>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <div className="head"><h2>Gold coins</h2></div>
          <p className="muted small">Visitors who found at least this many coins.</p>
          <ul className="bars">
            {stats?.coins.map((n, i) => (
              <li key={i}>
                <span>{i + 1} {i ? 'coins' : 'coin'}</span>
                <i style={{ '--w': `${(n / maxCoin) * 100}%` }} />
                <b>{n}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <div className="head">
          <h2>Leads <span className="muted">({leads.total})</span></h2>
          <a className="link" href={`${BASE}/api/admin/leads.csv`}>Download CSV</a>
        </div>
        {leads.leads.length === 0 ? (
          <p className="muted">No leads yet.</p>
        ) : (
          <div className="tablewrap">
            <table>
              <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Option</th></tr></thead>
              <tbody>
                {leads.leads.map((l) => (
                  <tr key={l.id}>
                    <td className="nowrap">{fmtDate(l.created_at)}</td>
                    <td>{l.name}</td>
                    <td><a href={`mailto:${l.email}`}>{l.email}</a></td>
                    <td className="nowrap">{CHOICE_LABELS[l.choice] || l.choice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {leads.total > PAGE && (
          <div className="pager">
            <button className="btn ghost" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>Newer</button>
            <span className="muted">{offset + 1}–{Math.min(offset + PAGE, leads.total)} of {leads.total}</span>
            <button className="btn ghost" disabled={offset + PAGE >= leads.total} onClick={() => setOffset(offset + PAGE)}>Older</button>
          </div>
        )}
      </section>
    </main>
  );
}
