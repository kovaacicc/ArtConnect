import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { opportunitiesApi } from '../../services/opportunitiesApi';
import { artistApi, daysLeft, errMsg } from '../../services/artistApi';
import { getMe, greetingName, type User } from '../../services/auth';
import type { ArtistProfile, Artwork, Opportunity } from '../../types/artist';
import { ErrorBox, Loading, NotImplemented } from '../../components/artist/ui';

export default function ArtistDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [works, setWorks] = useState<Artwork[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMe(), artistApi.getProfile(), artistApi.getArtworks(), opportunitiesApi.list()])
      .then(([u, p, w, o]) => { setUser(u); setProfile(p); setWorks(w); setOpps(o as unknown as Opportunity[]); })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const open = opps.filter((o) => o.status === 'open');
  const closingSoon = [...open]
    .sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999'))
    .slice(0, 3);

  return (
    <div className="ac-dashboard">
      <header className="ac-hero">
        <h1>Bok, {user ? greetingName(user) : 'umjetniče'}.</h1>
        <div className="ac-row">
          <Link to="/umjetnik/prilike" className="ac-btn ac-btn--primary">Pronađi prilike</Link>
          <Link to="/umjetnik/profil" className="ac-btn ac-btn--ghost">Uredi portfolio</Link>
        </div>
      </header>

      {error && <ErrorBox message={error} />}

      <div className="ac-stats-grid" aria-label="Sažetak">
        <div className="ac-stat-card"><b>{open.length}</b><span>otvorenih prilika</span></div>
        <div className="ac-stat-card"><b>{works.length}</b><span>radova u portfoliju</span></div>
        <div className="ac-stat-card"><b>{profile?.participations.length ?? 0}</b><span>sudjelovanja</span></div>
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
                      <span>{o.organizer_name}</span>
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
            <h3>Moje prijave</h3>
            <NotImplemented />
          </div>
        </div>
      </div>
    </div>
  );
}
