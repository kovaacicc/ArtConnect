import { useEffect, useState } from 'react';
import { artistApi, errMsg, formatDate } from '../../services/artistApi';
import { getArtFields, getMe, type ArtField, type User } from '../../services/auth';
import type { ArtistProfile as Profile, Artwork, Exhibition } from '../../types/artist';
import { Empty, ErrorBox, Loading, Modal } from '../../components/artist/ui';

type Draft = {
  id?: number;
  title: string;
  year_created: string;
  technique: string;
  dimensions: string;
  description: string;
  is_public: boolean;
  imageUrl: string;
  files: Artwork['files'];
};

const blank = (): Draft => ({
  title: '', year_created: String(new Date().getFullYear()), technique: '', dimensions: '',
  description: '', is_public: true, imageUrl: '', files: [],
});

const toDraft = (a: Artwork): Draft => ({
  id: a.id, title: a.title, year_created: a.year_created ? String(a.year_created) : '',
  technique: a.technique, dimensions: a.dimensions, description: a.description,
  is_public: a.is_public, imageUrl: a.files[0]?.url ?? '', files: a.files,
});

export default function ArtistProfile() {
  const [p, setP] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [fields, setFields] = useState<ArtField[]>([]);
  const [works, setWorks] = useState<Artwork[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [newEx, setNewEx] = useState({ title: '', year: String(new Date().getFullYear()), description: '' });

  const load = () =>
    Promise.all([artistApi.getProfile(), getMe(), getArtFields(), artistApi.getArtworks(), artistApi.getExhibitions()])
      .then(([pr, u, f, w, ex]) => { setP(pr); setUser(u); setFields(f); setWorks(w); setExhibitions(ex); })
      .catch((e) => setError(errMsg(e)));

  useEffect(() => { load(); }, []);

  if (!p) return error ? <ErrorBox message={error} /> : <Loading />;

  const fullName = `${p.first_name} ${p.last_name}`.trim();

  const run = async (fn: () => Promise<unknown>) => {
    try { setError(''); await fn(); await load(); } catch (e) { setError(errMsg(e)); }
  };

  const addExhibition = () => {
    if (!newEx.title.trim()) return;
    run(async () => {
      await artistApi.createExhibition({
        title: newEx.title.trim(),
        year: newEx.year ? Number(newEx.year) : null,
        description: newEx.description.trim(),
      });
      setNewEx({ title: '', year: String(new Date().getFullYear()), description: '' });
    });
  };

  return (
    <>
      <header className="ac-profile-header">
        <div className="ac-avatar-wrapper" style={{ cursor: 'default' }}>
          <div className="ac-avatar-placeholder">{(p.first_name || '?').charAt(0)}</div>
        </div>

        <div className="ac-profile-info">
          <h2>{fullName}</h2>
          {user && <p className="ac-muted">{user.email}</p>}
          <div className="ac-row">
            {p.art_fields.map((f) => <span key={f.id} className="ac-chip">{f.name}</span>)}
          </div>
          <div className="ac-profile-stats">
            <span><strong>{works.length}</strong> radova</span>
            <span><strong>{exhibitions.length}</strong> izložbi</span>
            <span><strong>{p.participations.length}</strong> sudjelovanja</span>
          </div>
          {p.biography && <p className="ac-bio">{p.biography}</p>}
          {p.work_description && <p className="ac-bio ac-muted">{p.work_description}</p>}
          <div className="ac-row">
            {p.website_url && <a className="ac-small" href={p.website_url} target="_blank" rel="noreferrer">Web-stranica ↗</a>}
            {p.social_url && <a className="ac-small" href={p.social_url} target="_blank" rel="noreferrer">Društvena mreža ↗</a>}
          </div>
        </div>
      </header>

      {error && <ErrorBox message={error} />}

      <div className="ac-profile-actions">
        <button className="ac-btn ac-btn--block" onClick={() => setEditing(true)}>Uredi profil</button>
      </div>

      <section style={{ marginTop: '3rem' }}>
        <div className="ac-row" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>Moji radovi</h2>
          <button className="ac-btn ac-btn--primary ac-btn--small" onClick={() => setDraft(blank())}>+ Dodaj rad</button>
        </div>

        {works.length === 0 ? (
          <Empty title="Portfolio je prazan" text="Dodaj prvi rad kako bi ga organizatori mogli vidjeti." />
        ) : (
          <div className="ac-grid ac-grid--works">
            {works.map((a) => {
              const img = a.files[0]?.url;
              return (
                <article key={a.id} className="ac-work">
                  <div className="ac-work__img" style={img ? { backgroundImage: `url("${img}")` } : undefined}>
                    {!img && <span>{a.title.charAt(0)}</span>}
                    <span className={`ac-pill ${a.is_public ? 'is-public' : ''}`}>{a.is_public ? 'Javno' : 'Privatno'}</span>
                  </div>
                  <div className="ac-work__body">
                    <h3>{a.title}</h3>
                    <p className="ac-muted ac-small">{[a.year_created, a.technique].filter(Boolean).join(' · ')}</p>
                    <div className="ac-row">
                      <button className="ac-btn ac-btn--small ac-btn--ghost" onClick={() => setDraft(toDraft(a))}>Uredi</button>
                      <button className="ac-btn ac-btn--small ac-btn--ghost" onClick={() => run(() => artistApi.updateArtwork(a.id, { is_public: !a.is_public }))}>
                        {a.is_public ? 'Sakrij' : 'Objavi'}
                      </button>
                      <button className="ac-btn ac-btn--small ac-btn--danger" onClick={() => window.confirm(`Obrisati rad „${a.title}”?`) && run(() => artistApi.deleteArtwork(a.id))}>
                        Obriši
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Prethodne izložbe i projekti</h2>
        <ul className="ac-list">
          {exhibitions.map((x) => (
            <li key={x.id}>
              <div className="ac-list__main"><strong>{x.title}</strong><span>{[x.year, x.description].filter(Boolean).join(' · ')}</span></div>
              <button className="ac-btn ac-btn--small ac-btn--danger" onClick={() => run(() => artistApi.deleteExhibition(x.id))}>Ukloni</button>
            </li>
          ))}
        </ul>
        <div className="ac-row" style={{ marginTop: '1rem' }}>
          <input className="ac-input ac-grow" placeholder="Naziv" aria-label="Naziv izložbe" value={newEx.title} onChange={(e) => setNewEx({ ...newEx, title: e.target.value })} />
          <input className="ac-input ac-input--year" type="number" aria-label="Godina" value={newEx.year} onChange={(e) => setNewEx({ ...newEx, year: e.target.value })} />
          <input className="ac-input ac-grow" placeholder="Opis (neobavezno)" aria-label="Opis" value={newEx.description} onChange={(e) => setNewEx({ ...newEx, description: e.target.value })} />
          <button className="ac-btn ac-btn--ghost" onClick={addExhibition}>Dodaj</button>
        </div>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Sudjelovanja putem ArtConnecta</h2>
        {p.participations.length === 0 ? <p className="ac-muted">Nema zabilježenih sudjelovanja.</p> : (
          <ul className="ac-list">
            {p.participations.map((x) => (
              <li key={x.opportunity_id}>
                <div className="ac-list__main"><strong>{x.title}</strong><span>{x.starts_at ? formatDate(x.starts_at) : ''}</span></div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && (
        <ProfileModal
          p={p} fields={fields} onClose={() => setEditing(false)}
          onSave={async (data) => { await run(() => artistApi.saveProfile(data)); setEditing(false); }}
        />
      )}

      {draft && (
        <ArtworkModal
          draft={draft} onClose={() => setDraft(null)}
          onSave={async (d) => {
            await run(async () => {
              const input = {
                title: d.title.trim(),
                year_created: d.year_created ? Number(d.year_created) : null,
                technique: d.technique, dimensions: d.dimensions, description: d.description, is_public: d.is_public,
              };
              const saved = d.id ? await artistApi.updateArtwork(d.id, input) : await artistApi.createArtwork(input);
              const old = d.files[0];
              const url = d.imageUrl.trim();
              if ((old?.url ?? '') !== url) {
                if (old) await artistApi.deleteArtworkFile(saved.id, old.id);
                if (url) await artistApi.addArtworkFile(saved.id, url);
              }
            });
            setDraft(null);
          }}
        />
      )}
    </>
  );
}

function ProfileModal({ p, fields, onClose, onSave }: {
  p: Profile; fields: ArtField[]; onClose: () => void;
  onSave: (d: Parameters<typeof artistApi.saveProfile>[0]) => Promise<void>;
}) {
  const [f, setF] = useState({
    first_name: p.first_name, last_name: p.last_name, biography: p.biography,
    work_description: p.work_description, website_url: p.website_url, social_url: p.social_url,
  });
  const [ids, setIds] = useState<number[]>(p.art_fields.map((x) => x.id));
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (id: number) => setIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <Modal title="Uredi profil" onClose={onClose}>
      <form className="ac-form" onSubmit={(e) => { e.preventDefault(); onSave({ ...f, art_fields: ids }); }}>
        <div className="ac-row">
          <label className="ac-grow">Ime<input className="ac-input" required value={f.first_name} onChange={(e) => set('first_name', e.target.value)} /></label>
          <label className="ac-grow">Prezime<input className="ac-input" required value={f.last_name} onChange={(e) => set('last_name', e.target.value)} /></label>
        </div>
        <fieldset>
          <legend>Područja umjetničkog djelovanja</legend>
          <div className="ac-row">
            {fields.map((x) => (
              <button type="button" key={x.id} className={`ac-chip-toggle ${ids.includes(x.id) ? 'is-on' : ''}`} aria-pressed={ids.includes(x.id)} onClick={() => toggle(x.id)}>
                {x.name}
              </button>
            ))}
          </div>
        </fieldset>
        <label>Biografija<textarea className="ac-input" rows={3} value={f.biography} onChange={(e) => set('biography', e.target.value)} /></label>
        <label>Opis umjetničkog rada<textarea className="ac-input" rows={3} value={f.work_description} onChange={(e) => set('work_description', e.target.value)} /></label>
        <div className="ac-row">
          <label className="ac-grow">Web-stranica<input className="ac-input" type="url" placeholder="https://" value={f.website_url} onChange={(e) => set('website_url', e.target.value)} /></label>
          <label className="ac-grow">Društvena mreža<input className="ac-input" type="url" placeholder="https://" value={f.social_url} onChange={(e) => set('social_url', e.target.value)} /></label>
        </div>
        <div className="ac-row ac-row--end">
          <button type="button" className="ac-btn ac-btn--ghost" onClick={onClose}>Odustani</button>
          <button className="ac-btn ac-btn--primary" disabled={ids.length === 0}>Spremi promjene</button>
        </div>
      </form>
    </Modal>
  );
}

function ArtworkModal({ draft, onClose, onSave }: { draft: Draft; onClose: () => void; onSave: (d: Draft) => Promise<void> }) {
  const [d, setD] = useState<Draft>(draft);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  return (
    <Modal title={d.id ? 'Uredi rad' : 'Novi rad'} onClose={onClose}>
      <form className="ac-form" onSubmit={async (e) => { e.preventDefault(); setBusy(true); await onSave(d); }}>
        <label>Naziv<input className="ac-input" required value={d.title} onChange={(e) => set('title', e.target.value)} /></label>
        <div className="ac-row">
          <label className="ac-grow">Godina nastanka<input className="ac-input" type="number" value={d.year_created} onChange={(e) => set('year_created', e.target.value)} /></label>
          <label className="ac-grow">Dimenzije<input className="ac-input" placeholder="80 × 60 cm" value={d.dimensions} onChange={(e) => set('dimensions', e.target.value)} /></label>
        </div>
        <label>Tehnika<input className="ac-input" value={d.technique} onChange={(e) => set('technique', e.target.value)} /></label>
        <label>Opis<textarea className="ac-input" rows={3} value={d.description} onChange={(e) => set('description', e.target.value)} /></label>
        <label>Poveznica na sliku rada<input className="ac-input" type="url" placeholder="https://" value={d.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} /></label>
        {d.imageUrl && <img className="ac-preview" src={d.imageUrl} alt="Pregled slike" />}
        <label className="ac-check"><input type="checkbox" checked={d.is_public} onChange={(e) => set('is_public', e.target.checked)} />Javno vidljiv</label>
        <div className="ac-row ac-row--end">
          <button type="button" className="ac-btn ac-btn--ghost" onClick={onClose}>Odustani</button>
          <button className="ac-btn ac-btn--primary" disabled={busy}>{busy ? 'Spremam…' : 'Spremi'}</button>
        </div>
      </form>
    </Modal>
  );
}
