import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { artistApi, formatDate, googleCalendarUrl } from '../../services/artistApi';
import { APPLICATION_STATUS_LABEL, type Application, type ApplicationStatus, type Artwork, type Opportunity } from '../../types/artist';
import { ApplicationBadge, Empty, Loading } from '../../components/artist/ui';

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [works, setWorks] = useState<Artwork[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | ''>('');
  const [loading, setLoading] = useState(true);

  // Stanje koje pamti koje su kartice proširene
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([artistApi.getApplications(), artistApi.getOpportunities(), artistApi.getArtworks()])
      .then(([a, o, w]) => { setApps(a); setOpps(o); setWorks(w); })
      .finally(() => setLoading(false));
  }, []);

  const shown = apps.filter((a) => (filter ? a.status === filter : true));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
            const isExpanded = expandedIds.includes(a.id);

            return (
              <li key={a.id} className="ac-card ac-card--collapsible">
                
                {/* GORNJI DIO (Bez plave linije, samo naslov, bedž i strelica) */}
                <div className="ac-card__header-click" onClick={() => toggleExpand(a.id)}>
                  <div className="ac-card__top">
                    <h3>{a.opportunityTitle}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <ApplicationBadge status={a.status} />
                      {isExpanded ? <ChevronUp size={20} color="var(--ac-muted)" /> : <ChevronDown size={20} color="var(--ac-muted)" />}
                    </div>
                  </div>
                </div>

                {/* DONJI DIO (Vidljiv samo ako je prošireno) */}
                {isExpanded && (
                  <div className="ac-card__details">
                    <p className="ac-muted">Predano {formatDate(a.submittedAt)} · {a.artworkIds.length} {a.artworkIds.length === 1 ? 'rad' : 'radova'}</p>
                    
                    <p className="ac-muted ac-small">
                      Priloženo: {a.artworkIds.map((id) => works.find((w) => w.id === id)?.title).filter(Boolean).join(', ') || '—'}
                    </p>

                    {a.message && (
                      <div className="ac-note" style={{ background: 'var(--ac-bg)', marginTop: '0.5rem' }}>
                        <strong>Tvoja poruka:</strong>
                        <p className="ac-small">{a.message}</p>
                      </div>
                    )}

                    {a.status === 'odbijena' && (
                      <div className="ac-note ac-note--bad"><strong>Razlog odbijanja</strong><p>{a.rejectionReason ?? 'Organizator nije naveo razlog.'}</p></div>
                    )}
                    {a.status === 'potrebna_dopuna' && (
                      <div className="ac-note ac-note--warn">
                        <strong>Potrebna dopuna</strong><p>{a.revisionNote}</p>
                        <Link className="ac-btn ac-btn--small" to="/umjetnik/profil">Uredi portfolio</Link>
                      </div>
                    )}
                    {a.status === 'prihvacena' && opp && (
                      <div className="ac-note ac-note--good">
                        <strong>Čestitamo, prihvaćen/a si!</strong>
                        <p>Događanje: {formatDate(opp.eventDate)}, {opp.address ?? opp.city}</p>
                        <a className="ac-btn ac-btn--small" href={googleCalendarUrl(opp)} target="_blank" rel="noreferrer">Dodaj u Google Calendar</a>
                      </div>
                    )}
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