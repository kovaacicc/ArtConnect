import { useEffect, useRef, useState } from 'react';
import { artistApi } from '../../services/artistApi';
import { ART_FIELDS, type Application, type ArtField, type ArtistProfile as Profile, type Artwork } from '../../types/artist';
import { Empty, Loading, Modal } from '../../components/artist/ui';

type Draft = Omit<Artwork, 'id'> & { id?: string };
const blank = (): Draft => ({ title: '', year: new Date().getFullYear(), technique: '', dimensions: '', description: '', isPublic: true });

export default function ArtistProfile() {
  const [p, setP] = useState<Profile | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [works, setWorks] = useState<Artwork[]>([]);
  
  const [isEditing, setIsEditing] = useState(false); // Stanje za modal profila
  const [draft, setDraft] = useState<Draft | null>(null); // Stanje za modal radova
  const [saved, setSaved] = useState(false);
  
  const [newEx, setNewEx] = useState({ title: '', year: new Date().getFullYear(), place: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([artistApi.getProfile(), artistApi.getApplications(), artistApi.getArtworks()]).then(([pr, a, w]) => {
      setP(pr); setApps(a); setWorks(w);
    });
  }, []);

  if (!p) return <Loading />;

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP({ ...p, [k]: v });

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setP(await artistApi.saveProfile(p));
    setIsEditing(false); // Zatvori modal
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('avatarUrl', String(reader.result));
    reader.readAsDataURL(file);
  };

  const addExhibition = () => {
    if (!newEx.title.trim()) return;
    set('exhibitions', [{ id: crypto.randomUUID(), ...newEx }, ...p.exhibitions]);
    setNewEx({ title: '', year: new Date().getFullYear(), place: '' });
  };

  const participations = apps.filter((a) => a.status === 'prihvacena');

  // Funkcije za radove (preuzeto iz Portfolio.tsx)
  const togglePublic = async (a: Artwork) => setWorks(await artistApi.saveArtwork({ ...a, isPublic: !a.isPublic }));
  const removeArtwork = async (a: Artwork) => {
    if (window.confirm(`Obrisati rad „${a.title}”?`)) setWorks(await artistApi.deleteArtwork(a.id));
  };

  return (
    <>
      {/* --- HEADER (Instagram stil) --- */}
      <header className="ac-profile-header">
        <div className="ac-avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
          {p.avatarUrl ? <img src={p.avatarUrl} alt="Profilna" className="ac-avatar-img" /> : <div className="ac-avatar-placeholder">{p.name.charAt(0)}</div>}
          <div className="ac-avatar-overlay">Promijeni</div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} />
        </div>

        <div className="ac-profile-info">
          <div className="ac-profile-title">
            <h2>{p.username}</h2>
          </div>
          <p className="ac-name">{p.name}</p>
          
          <div className="ac-profile-stats">
            <span><strong>{works.length}</strong> radova</span>
            <span><strong>{p.exhibitions.length}</strong> izložbi</span>
            <span><strong>{participations.length}</strong> sudjelovanja</span>
          </div>

          <p className="ac-bio">{p.bio}</p>
        </div>
      </header>

      {/* --- GUMB ZA UREĐIVANJE --- */}
      <div className="ac-profile-actions">
        <button className="ac-btn ac-btn--block" onClick={() => setIsEditing(true)}>
          Uredi profil
        </button>
      </div>

      {/* --- PORTFOLIO SEKCIJA --- */}
      <section style={{ marginTop: '3rem' }}>
        <div className="ac-row" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Moji radovi</h2>
          <button className="ac-btn ac-btn--primary ac-btn--small" onClick={() => setDraft(blank())}>+ Dodaj rad</button>
        </div>
        
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
                  <p className="ac-muted ac-small">{a.year} · {a.technique}</p>
                  <div className="ac-row">
                    <button className="ac-btn ac-btn--small ac-btn--ghost" onClick={() => setDraft(a)}>Uredi</button>
                    <button className="ac-btn ac-btn--small ac-btn--ghost" onClick={() => togglePublic(a)}>{a.isPublic ? 'Sakrij' : 'Objavi'}</button>
                    <button className="ac-btn ac-btn--small ac-btn--danger" onClick={() => removeArtwork(a)}>Obriši</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>Sudjelovanja putem ArtConnecta</h2>
        {participations.length === 0 ? <p className="ac-muted">Nema zabilježenih sudjelovanja.</p> : (
          <ul className="ac-list">{participations.map((a) => <li key={a.id}><strong>{a.opportunityTitle}</strong></li>)}</ul>
        )}
      </section>

      {/* --- MODAL ZA UREĐIVANJE PROFILA --- */}
      {isEditing && (
        <Modal title="Uredi profil" onClose={() => setIsEditing(false)}>
          <form className="ac-form" onSubmit={saveProfile}>
            <div className="ac-row">
              <label className="ac-grow">Korisničko ime<input className="ac-input" required value={p.username} onChange={(e) => set('username', e.target.value)} /></label>
              <label className="ac-grow">Ime i prezime<input className="ac-input" required value={p.name} onChange={(e) => set('name', e.target.value)} /></label>
            </div>
            <label>Područje umjetničkog djelovanja
              <select className="ac-input" value={p.field} onChange={(e) => set('field', e.target.value as ArtField)}>
                {ART_FIELDS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </label>
            <label>Kratki opis (Bio)<textarea className="ac-input" rows={2} value={p.bio} onChange={(e) => set('bio', e.target.value)} /></label>
            <label>Umjetnička izjava<textarea className="ac-input" rows={3} value={p.statement} onChange={(e) => set('statement', e.target.value)} /></label>
            <div className="ac-row">
              <label className="ac-grow">Web-stranica<input className="ac-input" type="url" value={p.website} onChange={(e) => set('website', e.target.value)} /></label>
              <label className="ac-grow">Društvena mreža<input className="ac-input" type="url" value={p.social} onChange={(e) => set('social', e.target.value)} /></label>
            </div>

            <fieldset>
              <legend>Izložbe i projekti</legend>
              <ul className="ac-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {p.exhibitions.map((x) => (
                  <li key={x.id}>
                    <div className="ac-list__main"><strong>{x.title}</strong><span className="ac-muted">{x.year} · {x.place}</span></div>
                    <button type="button" className="ac-btn ac-btn--small ac-btn--danger" onClick={() => set('exhibitions', p.exhibitions.filter((e) => e.id !== x.id))}>✕</button>
                  </li>
                ))}
              </ul>
              <div className="ac-row" style={{ marginTop: '0.5rem' }}>
                <input className="ac-input ac-grow" placeholder="Naziv" value={newEx.title} onChange={(e) => setNewEx({ ...newEx, title: e.target.value })} />
                <input className="ac-input ac-input--year" type="number" value={newEx.year} onChange={(e) => setNewEx({ ...newEx, year: Number(e.target.value) })} />
                <input className="ac-input ac-grow" placeholder="Mjesto" value={newEx.place} onChange={(e) => setNewEx({ ...newEx, place: e.target.value })} />
                <button type="button" className="ac-btn ac-btn--ghost" onClick={addExhibition}>Dodaj</button>
              </div>
            </fieldset>

            <div className="ac-row ac-row--end">
              <button type="button" className="ac-btn ac-btn--ghost" onClick={() => setIsEditing(false)}>Odustani</button>
              <button className="ac-btn ac-btn--primary">Spremi promjene</button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- MODAL ZA DODAVANJE/UREĐIVANJE RADA --- */}
      {draft && (
        <ArtworkModal
          draft={draft} onClose={() => setDraft(null)}
          onSave={async (d) => { setWorks(await artistApi.saveArtwork(d)); setDraft(null); }}
        />
      )}
    </>
  );
}

// Preuzeto iz Portfolio.tsx - Modal za radove
function ArtworkModal({ draft, onClose, onSave }: { draft: Draft; onClose: () => void; onSave: (d: Draft) => Promise<void> }) {
  const [d, setD] = useState<Draft>(draft);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set('imageUrl', String(r.result));
    r.readAsDataURL(f);
  };

  return (
    <Modal title={d.id ? 'Uredi rad' : 'Novi rad'} onClose={onClose}>
      <form className="ac-form" onSubmit={(e) => { e.preventDefault(); onSave(d); }}>
        <label>Naziv<input className="ac-input" required value={d.title} onChange={(e) => set('title', e.target.value)} /></label>
        <div className="ac-row">
          <label className="ac-grow">Godina<input className="ac-input" type="number" required value={d.year} onChange={(e) => set('year', Number(e.target.value))} /></label>
          <label className="ac-grow">Dimenzije<input className="ac-input" placeholder="80 × 60 cm" value={d.dimensions} onChange={(e) => set('dimensions', e.target.value)} /></label>
        </div>
        <label>Tehnika<input className="ac-input" required value={d.technique} onChange={(e) => set('technique', e.target.value)} /></label>
        <label>Opis<textarea className="ac-input" rows={2} value={d.description} onChange={(e) => set('description', e.target.value)} /></label>
        <label>Fotografija rada<input className="ac-input" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} /></label>
        {d.imageUrl && <img className="ac-preview" src={d.imageUrl} alt="Pregled" />}
        <label className="ac-check"><input type="checkbox" checked={d.isPublic} onChange={(e) => set('isPublic', e.target.checked)} />Javno vidljiv</label>
        <div className="ac-row ac-row--end">
          <button type="button" className="ac-btn ac-btn--ghost" onClick={onClose}>Odustani</button>
          <button className="ac-btn ac-btn--primary">Spremi</button>
        </div>
      </form>
    </Modal>
  );
}