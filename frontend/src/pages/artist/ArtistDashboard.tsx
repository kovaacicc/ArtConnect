import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { opportunitiesApi } from '../../services/opportunitiesApi';
import { artistApi, daysLeft, formatDate, googleCalendarUrl } from '../../services/artistApi';
import type { Application, ArtistProfile, Opportunity } from '../../types/artist';
import { ApplicationBadge, Loading } from '../../components/artist/ui';

const FALLBACK_PROFILE: ArtistProfile = {
  username: 'umjetnik', name: 'Umjetnik', email: '', field: 'Slikarstvo',
  bio: '', statement: '', website: '', social: '', exhibitions: []
};

export default function ArtistDashboard() {
  const [profile, setProfile] = useState<ArtistProfile>(FALLBACK_PROFILE);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      artistApi.getProfile().catch(() => FALLBACK_PROFILE),
      opportunitiesApi.list().catch(() => []),
      artistApi.getApplications().catch(() => [])
    ])
      .then(([p, o, a]) => {
        setProfile(p || FALLBACK_PROFILE);
        setOpps((o as unknown as Opportunity[]) || []);
        setApps(a || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const open = opps.filter((o) => o.status === 'open');
  const closingSoon = [...open].sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999')).slice(0, 3);
  const accepted = apps.filter((a) => a.status === 'prihvacena');
  const needsAction = apps.filter((a) => a.status === 'potrebna_dopuna');
  const oppById = (id: string) => opps.find((o) => String(o.id) === id);

  return (
    <div className="ac-dashboard">
      <header className="ac-hero">
        <h1>Bok, {profile.name}.</h1>
        <div className="ac-row">
          <Link to="/umjetnik/prilike" className="ac-btn ac-btn--primary">Pronađi prilike</Link>
          <Link to="/umjetnik/profil" className="ac-btn ac-btn--ghost">Uredi portfolio</Link>
        </div>
      </header>

      {needsAction.length > 0 && (
        <div className="ac-alert" role="status">
          <strong>Organizator traži dopunu prijave:</strong>{' '}
          {needsAction.map((a) => a.opportunityTitle).join(', ')}.{' '}
          <Link to="/umjetnik/prijave">Pogledaj što treba dodati</Link>
        </div>
      )}

      <div className="ac-stats-grid" aria-label="Sažetak">
        <div className="ac-stat-card"><b>{open.length}</b><span>otvorenih prilika</span></div>
        <div className="ac-stat-card"><b>{apps.filter((a) => ['predana', 'u_pregledu', 'potrebna_dopuna'].includes(a.status)).length}</b><span>prijava u tijeku</span></div>
        <div className="ac-stat-card"><b>{accepted.length}</b><span>prihvaćenih</span></div>
      </div>

      <div className="ac-activities">
        <h2>Moje aktivnosti</h2>
        <div className="ac-card">
          
          <div className="ac-activity-group">
            <h3>Uskoro ističe rok</h3>
            {closingSoon.length === 0 ? (
              <p className="ac-muted ac-small">Trenutno nema otvorenih prilika.</p>
            ) : (
              <ul className="ac-list">
                {closingSoon.map((o) => (
                  <li key={o.id}>
                    <Link to={`/umjetnik/prilike/${o.id}`} className="ac-list__main">
                      <strong>{o.title}</strong>
                    </Link>
                    <span className="ac-deadline">
                      {o.deadline ? (daysLeft(o.deadline) <= 0 ? 'Danas' : `još ${daysLeft(o.deadline)} d`) : 'Bez roka'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="ac-activity-group">
            <h3>Moja događanja</h3>
            {accepted.length === 0 ? (
              <p className="ac-muted ac-small">Još nema prihvaćenih prijava.</p>
            ) : (
              <ul className="ac-list">
                {accepted.map((a) => {
                  const o = oppById(a.opportunityId);
                  return (
                    <li key={a.id}>
                      <div className="ac-list__main">
                        <strong>{a.opportunityTitle}</strong>
                      </div>
                      {o && o.starts_at && (
                        <a className="ac-btn ac-btn--small" href={googleCalendarUrl(o)} target="_blank" rel="noreferrer">Dodaj u kalendar</a>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="ac-activity-group">
            <h3>Zadnje prijave</h3>
            {apps.length === 0 ? (
              <p className="ac-muted ac-small">Nema zaprimljenih prijava.</p>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}