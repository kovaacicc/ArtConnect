import { useEffect, useState } from 'react';
import { artistApi } from '../../services/artistApi';
import { ART_FIELDS, type Application, type ArtField, type ArtistProfile as Profile } from '../../types/artist';
import { Loading } from '../../components/artist/ui';

export default function ArtistProfile() {
  const [p, setP] = useState<Profile | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [saved, setSaved] = useState(false);
  const [newEx, setNewEx] = useState({ title: '', year: new Date().getFullYear(), place: '' });

  useEffect(() => {
    Promise.all([artistApi.getProfile(), artistApi.getApplications()]).then(([pr, a]) => { setP(pr); setApps(a); });
  }, []);

  if (!p) return <Loading />;
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP({ ...p, [k]: v });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setP(await artistApi.saveProfile(p));
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const addExhibition = () => {
    if (!newEx.title.trim()) return;
    set('exhibitions', [{ id: crypto.randomUUID(), ...newEx }, ...p.exhibitions]);
    setNewEx({ title: '', year: new Date().getFullYear(), place: '' });
  };

  const participations = apps.filter((a) => a.status === 'prihvacena');

  return (
    <>
      <header className="ac-page-head">
        <h1>Profil</h1>
        <p className="ac-muted">Osnovni podaci, poveznice i izlagačka povijest.</p>
      </header>

      <form className="ac-card ac-form" onSubmit={save}>
        <label>Ime i prezime<input className="ac-input" required value={p.name} onChange={(e) => set('name', e.target.value)} /></label>
        <label>E-pošta<input className="ac-input" value={p.email} disabled /></label>
        <label>Područje umjetničkog djelovanja
          <select className="ac-input" value={p.field} onChange={(e) => set('field', e.target.value as ArtField)}>
            {ART_FIELDS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>
        <label>Umjetnička izjava<textarea className="ac-input" rows={3} value={p.statement} onChange={(e) => set('statement', e.target.value)} /></label>
        <div className="ac-row">
          <label className="ac-grow">Web-stranica<input className="ac-input" type="url" placeholder="https://" value={p.website} onChange={(e) => set('website', e.target.value)} /></label>
          <label className="ac-grow">Društvena mreža<input className="ac-input" type="url" placeholder="https://" value={p.social} onChange={(e) => set('social', e.target.value)} /></label>
        </div>

        <fieldset>
          <legend>Prethodne izložbe i projekti</legend>
          <ul className="ac-list">
            {p.exhibitions.map((x) => (
              <li key={x.id}>
                <div className="ac-list__main"><strong>{x.title}</strong><span className="ac-muted">{x.year} · {x.place}</span></div>
                <button type="button" className="ac-btn ac-btn--small ac-btn--danger" onClick={() => set('exhibitions', p.exhibitions.filter((e) => e.id !== x.id))}>Ukloni</button>
              </li>
            ))}
          </ul>
          <div className="ac-row">
            <input className="ac-input ac-grow" placeholder="Naziv" aria-label="Naziv izložbe" value={newEx.title} onChange={(e) => setNewEx({ ...newEx, title: e.target.value })} />
            <input className="ac-input ac-input--year" type="number" aria-label="Godina" value={newEx.year} onChange={(e) => setNewEx({ ...newEx, year: Number(e.target.value) })} />
            <input className="ac-input ac-grow" placeholder="Mjesto" aria-label="Mjesto" value={newEx.place} onChange={(e) => setNewEx({ ...newEx, place: e.target.value })} />
            <button type="button" className="ac-btn ac-btn--ghost" onClick={addExhibition}>Dodaj</button>
          </div>
        </fieldset>

        <div className="ac-row ac-row--end">
          {saved && <span className="ac-muted" role="status">Spremljeno</span>}
          <button className="ac-btn ac-btn--primary">Spremi profil</button>
        </div>
      </form>

      <section>
        <h2>Sudjelovanja putem ArtConnecta</h2>
        {participations.length === 0
          ? <p className="ac-muted">Prikazat će se nakon što te organizator prihvati.</p>
          : <ul className="ac-list">{participations.map((a) => <li key={a.id}><strong>{a.opportunityTitle}</strong></li>)}</ul>}
      </section>
    </>
  );
}
