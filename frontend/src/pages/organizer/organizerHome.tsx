import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../services/api'
import { opportunitiesApi } from '../../services/opportunitiesApi'
import type { CurrentUser, Opportunity } from '../../types/opportunity'

export default function OrganizerHome() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [mine, setMine] = useState<Opportunity[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([opportunitiesApi.me(), opportunitiesApi.mine()])
      .then(([me, opportunities]) => {
        setUser(me)
        setMine(opportunities)
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Došlo je do greške.'))
  }, [])
    if (error) return <p className="ac-note ac-note--bad" role="alert">{error}</p>
  if (!user) return <p className="ac-muted" role="status">Učitavanje…</p>

  const profile = user.organizer_profile
  const drafts = mine.filter((o) => o.status === 'preparation').length
  const open = mine.filter((o) => o.status === 'open').length
  const inSelection = mine.filter((o) => o.status === 'selection').length

    return (
    <>
      <header className="ac-hero">
        <h1>
          Bok, {profile?.name ?? user.display_name}.<br />
        </h1>
        <div className="ac-row">
          <Link to="/organizator/nova" className="ac-btn ac-btn--primary">Nova prilika</Link>
          <Link to="/organizator/moje" className="ac-btn ac-btn--ghost">Moje prilike</Link>
        </div>
      </header>

      {profile && !profile.approved && (
        <section className="ac-alert" role="status">
          <strong>Račun čeka odobrenje administratora.</strong> Dotad možete pripremati prilike kao nacrte, ali ih ne
          možete objaviti.
        </section>
      )}

      <section className="ac-stats" aria-label="Sažetak">
        <div><b>{open}</b><span>otvorenih za prijave</span></div>
        <div><b>{inSelection}</b><span>u procesu odabira</span></div>
        <div><b>{drafts}</b><span>nacrta</span></div>
      </section>

      <h2>O organizatoru</h2>
      <div className="ac-card">
        <dl className="ac-meta ac-meta--stack">
          <div><dt>Naziv</dt><dd>{profile?.name ?? '—'}</dd></div>
          <div><dt>Vrsta organizacije</dt><dd>{profile?.organization_type || '—'}</dd></div>
          <div><dt>E-mail</dt><dd>{user.email}</dd></div>
          <div><dt>Status računa</dt><dd>{profile?.approved ? 'Odobren' : 'Čeka odobrenje'}</dd></div>
        </dl>
        {profile?.description && <p className="ac-prose">{profile.description}</p>}
      </div>
    </>
  )
}