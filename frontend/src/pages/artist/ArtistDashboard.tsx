import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artistApi, daysLeft, formatDate, googleCalendarUrl } from '../../services/artistApi';
import type { Application, ArtistProfile, Opportunity } from '../../types/artist';
import { ApplicationBadge, Empty, Loading } from '../../components/artist/ui';

export default function ArtistDashboard() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([artistApi.getProfile(), artistApi.getOpportunities(), artistApi.getApplications()])
      .then(([p, o, a]) => { setProfile(p); setOpps(o); setApps(a); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) return <Loading />;

  const open = opps.filter((o) => o.status === 'otvoreno');
  const closingSoon = [...open].sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 3);
  const accepted = apps.filter((a) => a.status === 'prihvacena');
  const needsAction = apps.filter((a) => a.status === 'potrebna_dopuna');
  const oppById = (id: string) => opps.find((o) => o.id === id);

  return (
    <>
      <header className="ac-hero">
        <h1>Bok, {profile.name.split(' ')[0]}.<br /><span className="ac-accent">Što danas izlažemo?</span></h1>
        <div className="ac-row">
          <Link to="/umjetnik/prilike" className="ac-btn ac-btn--primary">Pronađi prilike</Link>
          <Link to="/umjetnik/portfolio" className="ac-btn ac-btn--ghost">Uredi portfolio</Link>
        </div>
      </header>

      {needsAction.length > 0 && (
        <section className="ac-alert" role="status">
          <strong>Organizator traži dopunu prijave:</strong>{' '}
          {needsAction.map((a) => a.opportunityTitle).join(', ')}.{' '}
          <Link to="/umjetnik/prijave">Pogledaj što treba dodati</Link>
        </section>
      )}

      <section className="ac-stats" aria-label="Sažetak">
        <div><b>{open.length}</b><span>otvorenih prilika</span></div>
        <div><b>{apps.filter((a) => ['predana', 'u_pregledu', 'potrebna_dopuna'].includes(a.status)).length}</b><span>prijava u tijeku</span></div>
        <div><b>{accepted.length}</b><span>prihvaćenih</span></div>
      </section>

      <div className="ac-cols">
        <section>
          <h2>Uskoro ističe rok</h2>
          {closingSoon.length === 0 ? <Empty title="Trenutno nema otvorenih prilika" /> : (
            <ul className="ac-list">
              {closingSoon.map((o) => (
                <li key={o.id}>
                  <Link to={`/umjetnik/prilike/${o.id}`} className="ac-list__main">
                    <strong>{o.title}</strong>
                    <span className="ac-muted">{o.organizer} · {o.city}</span>
                  </Link>
                  <span className="ac-deadline">{daysLeft(o.deadline) <= 0 ? 'Danas' : `još ${daysLeft(o.deadline)} d`}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2>Moja događanja</h2>
          {accepted.length === 0 ? (
            <Empty title="Još nema prihvaćenih prijava" text="Kad te organizator prihvati, događanje ćeš moći dodati u kalendar." />
          ) : (
            <ul className="ac-list">
              {accepted.map((a) => {
                const o = oppById(a.opportunityId);
                return (
                  <li key={a.id}>
                    <div className="ac-list__main">
                      <strong>{a.opportunityTitle}</strong>
                      <span className="ac-muted">{o ? formatDate(o.eventDate) : ''}</span>
                    </div>
                    {o && <a className="ac-btn ac-btn--small" href={googleCalendarUrl(o)} target="_blank" rel="noreferrer">Dodaj u kalendar</a>}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section>
        <h2>Zadnje prijave</h2>
        <ul className="ac-list">
          {apps.slice(0, 4).map((a) => (
            <li key={a.id}>
              <div className="ac-list__main">
                <strong>{a.opportunityTitle}</strong>
                <span className="ac-muted">Predano {formatDate(a.submittedAt)}</span>
              </div>
              <ApplicationBadge status={a.status} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
