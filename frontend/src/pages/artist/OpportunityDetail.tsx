import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { artistApi, formatDate } from '../../services/artistApi';
import type { Application, Artwork, Opportunity } from '../../types/artist';
import { ApplicationBadge, Empty, Loading, Modal, OpportunityBadge } from '../../components/artist/ui';

export default function OpportunityDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [opp, setOpp] = useState<Opportunity | null | undefined>(undefined);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [existing, setExisting] = useState<Application | undefined>();
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    Promise.all([artistApi.getOpportunity(id), artistApi.getArtworks(), artistApi.getApplications()]).then(([o, a, apps]) => {
      setOpp(o); setArtworks(a); setExisting(apps.find((x) => x.opportunityId === id));
    });
  }, [id]);

  if (opp === undefined) return <Loading />;
  if (opp === null) return <Empty title="Prilika nije pronađena" action={<Link className="ac-btn" to="/umjetnik/prilike">Natrag na prilike</Link>} />;

  const canApply = opp.status === 'otvoreno' && !existing;

  return (
    <>
      <Link to="/umjetnik/prilike" className="ac-back">← Sve prilike</Link>
      <header className="ac-page-head">
        <div className="ac-row"><span className="ac-chip">{opp.field}</span><OpportunityBadge status={opp.status} /></div>
        <h1>{opp.title}</h1>
        <p className="ac-muted">{opp.organizer}</p>
      </header>

      <div className="ac-cols ac-cols--detail">
        <section>
          <p className="ac-prose">{opp.description}</p>
          <dl className="ac-meta ac-meta--stack">
            <div><dt>Rok za prijavu</dt><dd>{formatDate(opp.deadline)}</dd></div>
            <div><dt>Događanje</dt><dd>{formatDate(opp.eventDate)}</dd></div>
            <div><dt>Mjesto</dt><dd>{opp.address ?? opp.city}</dd></div>
            {opp.ageCriteria && <div><dt>Dob</dt><dd>{opp.ageCriteria}</dd></div>}
            {opp.reward && <div><dt>Nagrada / naknada</dt><dd>{opp.reward}</dd></div>}
          </dl>

          {existing ? (
            <div className="ac-alert">
              Već si se prijavio/la. Status: <ApplicationBadge status={existing.status} />{' '}
              <Link to="/umjetnik/prijave">Moje prijave</Link>
            </div>
          ) : canApply ? (
            <button className="ac-btn ac-btn--primary" onClick={() => setApplying(true)}>Prijavi se</button>
          ) : (
            <p className="ac-muted">Prijave za ovu priliku trenutno nisu otvorene.</p>
          )}
        </section>

        {opp.address && (
          <section>
            <iframe
              className="ac-map"
              title={`Karta: ${opp.address}`}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(opp.address)}&output=embed`}
            />
          </section>
        )}
      </div>

      {applying && (
        <ApplyModal
          opp={opp} artworks={artworks}
          onClose={() => setApplying(false)}
          onDone={() => navigate('/umjetnik/prijave')}
        />
      )}
    </>
  );
}

function ApplyModal({ opp, artworks, onClose, onDone }: { opp: Opportunity; artworks: Artwork[]; onClose: () => void; onDone: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await artistApi.createApplication({ opportunityId: opp.id, artworkIds: selected, message, materialsUrl: url || undefined });
    onDone();
  };

  return (
    <Modal title={`Prijava: ${opp.title}`} onClose={onClose}>
      <form onSubmit={submit} className="ac-form">
        <fieldset>
          <legend>Radovi iz portfolija</legend>
          {artworks.length === 0 ? (
            <p className="ac-muted">Portfolio je prazan. <Link to="/umjetnik/portfolio">Dodaj prvi rad</Link></p>
          ) : artworks.map((a) => (
            <label key={a.id} className="ac-check ac-check--block">
              <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} />
              {a.title} <span className="ac-muted">({a.year}, {a.technique})</span>
            </label>
          ))}
        </fieldset>
        <label>Poveznica na dodatne materijale
          <input className="ac-input" type="url" placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <label>Poruka organizatoru
          <textarea className="ac-input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
        <div className="ac-row ac-row--end">
          <button type="button" className="ac-btn ac-btn--ghost" onClick={onClose}>Odustani</button>
          <button className="ac-btn ac-btn--primary" disabled={selected.length === 0 || busy}>
            {busy ? 'Šaljem…' : 'Pošalji prijavu'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
