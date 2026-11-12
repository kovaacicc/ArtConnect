import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artistApi, formatDate, googleCalendarUrl } from '../../services/artistApi';
import { APPLICATION_STATUS_LABEL, type Application, type ApplicationStatus, type Artwork, type Opportunity } from '../../types/artist';
import { ApplicationBadge, Empty, Loading } from '../../components/artist/ui';

const STEPS: ApplicationStatus[] = ['predana', 'u_pregledu', 'prihvacena'];

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [works, setWorks] = useState<Artwork[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([artistApi.getApplications(), artistApi.getOpportunities(), artistApi.getArtworks()])
      .then(([a, o, w]) => { setApps(a); setOpps(o); setWorks(w); })
      .finally(() => setLoading(false));
  }, []);

  const shown = apps.filter((a) => (filter ? a.status === filter : true));

  return (
    <>
      <header className="ac-page-head">
        <h1>Moje prijave</h1>
        <p className="ac-muted">Prati status svake prijave i odgovori na zahtjeve organizatora.</p>
      </header>

      <div className="ac-tabs" role="tablist" aria-label="Filtriraj po statusu">
        <button role="tab" aria-selected={filter === ''} className={filter === '' ? 'is-active' : ''} onClick={() => setFilter('')}>Sve</button>
        {(Object.keys(APPLICATION_STATUS_LABEL) as ApplicationStatus[]).map((s) => (
          <button key={s} role="tab" aria-selected={filter === s} className={filter === s ? 'is-active' : ''} onClick={() => setFilter(s)}>
            {APPLICATION_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : shown.length === 0 ? (
        <Empty title="Nema prijava" text="Pronađi priliku i pošalji svoj portfolio." action={<Link className="ac-btn ac-btn--primary" to="/umjetnik/prilike">Pregledaj prilike</Link>} />
      ) : (
        <ul className="ac-stack">
          {shown.map((a) => {
            const opp = opps.find((o) => o.id === a.opportunityId);
            const step = STEPS.indexOf(a.status === 'potrebna_dopuna' ? 'u_pregledu' : a.status === 'odbijena' ? 'u_pregledu' : a.status);
            return (
              <li key={a.id} className="ac-card">
                <div className="ac-card__top">
                  <h3><Link to={`/umjetnik/prilike/${a.opportunityId}`}>{a.opportunityTitle}</Link></h3>
                  <ApplicationBadge status={a.status} />
                </div>
                <p className="ac-muted">Predano {formatDate(a.submittedAt)} · {a.artworkIds.length} {a.artworkIds.length === 1 ? 'rad' : 'radova'}</p>

                <ol className="ac-steps" aria-label="Tijek prijave">
                  {STEPS.map((s, i) => (
                    <li key={s} className={i <= step ? 'is-done' : ''}>
                      {s === 'prihvacena' && a.status === 'odbijena' ? 'Odbijena' : APPLICATION_STATUS_LABEL[s]}
                    </li>
                  ))}
                </ol>

                <p className="ac-muted ac-small">
                  Priloženo: {a.artworkIds.map((id) => works.find((w) => w.id === id)?.title).filter(Boolean).join(', ') || '—'}
                </p>

                {a.status === 'odbijena' && (
                  <div className="ac-note ac-note--bad"><strong>Razlog odbijanja</strong><p>{a.rejectionReason ?? 'Organizator nije naveo razlog.'}</p></div>
                )}
                {a.status === 'potrebna_dopuna' && (
                  <div className="ac-note ac-note--warn">
                    <strong>Potrebna dopuna</strong><p>{a.revisionNote}</p>
                    <Link className="ac-btn ac-btn--small" to="/umjetnik/portfolio">Uredi portfolio</Link>
                  </div>
                )}
                {a.status === 'prihvacena' && opp && (
                  <div className="ac-note ac-note--good">
                    <strong>Čestitamo, prihvaćen/a si!</strong>
                    <p>Događanje: {formatDate(opp.eventDate)}, {opp.address ?? opp.city}</p>
                    <a className="ac-btn ac-btn--small" href={googleCalendarUrl(opp)} target="_blank" rel="noreferrer">Dodaj u Google Calendar</a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
