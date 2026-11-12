import { useEffect, useState } from 'react';
import { artistApi } from '../../services/artistApi';
import type { ArtistProfile, Artwork } from '../../types/artist';
import { Empty, Loading, Modal } from '../../components/artist/ui';

type Draft = Omit<Artwork, 'id'> & { id?: string };
const blank = (): Draft => ({ title: '', year: new Date().getFullYear(), technique: '', dimensions: '', description: '', isPublic: true });

export default function Portfolio() {
  const [works, setWorks] = useState<Artwork[]>([]);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([artistApi.getArtworks(), artistApi.getProfile()])
      .then(([w, p]) => { setWorks(w); setProfile(p); setBio(p.bio); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) return <Loading />;

  const saveBio = async () => {
    setProfile(await artistApi.saveProfile({ ...profile, bio }));
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  const togglePublic = async (a: Artwork) => setWorks(await artistApi.saveArtwork({ ...a, isPublic: !a.isPublic }));
  const remove = async (a: Artwork) => {
    if (window.confirm(`Obrisati rad „${a.title}”?`)) setWorks(await artistApi.deleteArtwork(a.id));
  };

  return (
    <>
      <header className="ac-page-head ac-page-head--row">
        <div>
          <h1>Portfolio</h1>
          <p className="ac-muted">Javno su vidljivi samo radovi označeni kao javni.</p>
        </div>
        <button className="ac-btn ac-btn--primary" onClick={() => setDraft(blank())}>Dodaj rad</button>
      </header>

      <section className="ac-card">
        <label className="ac-label" htmlFor="bio">Biografija i opis rada</label>
        <textarea id="bio" className="ac-input" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        <div className="ac-row ac-row--end">
          {saved && <span className="ac-muted" role="status">Spremljeno</span>}
          <button className="ac-btn ac-btn--small" onClick={saveBio} disabled={bio === profile.bio}>Spremi biografiju</button>
        </div>
      </section>

      <h2>Radovi</h2>
      {works.length === 0 ? (
        <Empty title="Portfolio je prazan" text="Dodaj prvi rad kako bi se mogao prijaviti na natječaje." />
      ) : (
        <div className="ac-grid ac-grid--works">
          {works.map((a) => (
            <article key={a.id} className="ac-work">
              <div className="ac-work__img" style={a.imageUrl ? { backgroundImage: `url(${a.imageUrl})` } : undefined}>
                {!a.imageUrl && <span>{a.title.charAt(0)}</span>}
                <span className={`ac-pill ${a.isPublic ? 'is-public' : ''}`}>{a.isPublic ? 'Javno' : 'Privatno'}</span>
              </div>
              <div className="ac-work__body">
                <h3>{a.title}</h3>
                <p className="ac-muted ac-small">{a.year} · {a.technique} · {a.dimensions}</p>
                <div className="ac-row">
                  <button className="ac-btn ac-btn--small ac-btn--ghost" onClick={() => setDraft(a)}>Uredi</button>
                  <button className="ac-btn ac-btn--small ac-btn--ghost" onClick={() => togglePublic(a)}>{a.isPublic ? 'Sakrij' : 'Objavi'}</button>
                  <button className="ac-btn ac-btn--small ac-btn--danger" onClick={() => remove(a)}>Obriši</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {draft && (
        <ArtworkModal
          draft={draft} onClose={() => setDraft(null)}
          onSave={async (d) => { setWorks(await artistApi.saveArtwork(d)); setDraft(null); }}
        />
      )}
    </>
  );
}

function ArtworkModal({ draft, onClose, onSave }: { draft: Draft; onClose: () => void; onSave: (d: Draft) => Promise<void> }) {
  const [d, setD] = useState<Draft>(draft);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set('imageUrl', String(r.result)); // privremeno data URL; kasnije upload na backend
    r.readAsDataURL(f);
  };

  return (
    <Modal title={d.id ? 'Uredi rad' : 'Novi rad'} onClose={onClose}>
      <form className="ac-form" onSubmit={(e) => { e.preventDefault(); onSave(d); }}>
        <label>Naziv<input className="ac-input" required value={d.title} onChange={(e) => set('title', e.target.value)} /></label>
        <div className="ac-row">
          <label className="ac-grow">Godina nastanka<input className="ac-input" type="number" min={1900} max={2100} required value={d.year} onChange={(e) => set('year', Number(e.target.value))} /></label>
          <label className="ac-grow">Dimenzije<input className="ac-input" placeholder="npr. 80 × 60 cm" value={d.dimensions} onChange={(e) => set('dimensions', e.target.value)} /></label>
        </div>
        <label>Tehnika<input className="ac-input" required value={d.technique} onChange={(e) => set('technique', e.target.value)} /></label>
        <label>Opis<textarea className="ac-input" rows={3} value={d.description} onChange={(e) => set('description', e.target.value)} /></label>
        <label>Fotografija rada<input className="ac-input" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} /></label>
        {d.imageUrl && <img className="ac-preview" src={d.imageUrl} alt="Pregled odabrane fotografije" />}
        <label className="ac-check"><input type="checkbox" checked={d.isPublic} onChange={(e) => set('isPublic', e.target.checked)} />Javno vidljiv na profilu</label>
        <div className="ac-row ac-row--end">
          <button type="button" className="ac-btn ac-btn--ghost" onClick={onClose}>Odustani</button>
          <button className="ac-btn ac-btn--primary">Spremi rad</button>
        </div>
      </form>
    </Modal>
  );
}
