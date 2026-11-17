import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import OpportunityCard from '../../components/opportunities/opportunityCard'
import { ApiError } from '../../services/api'
import { opportunitiesApi } from '../../services/opportunitiesApi'
import type { Opportunity } from '../../types/opportunity'

export default function MyOpportunities() {
  const [items, setItems] = useState<Opportunity[] | null>(null)
  const [error, setError] = useState('')
  const notice = (useLocation().state as { notice?: string } | null)?.notice

  useEffect(() => {
    opportunitiesApi
      .mine()
      .then(setItems)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Došlo je do greške.'))
  }, [])

  const drafts = items?.filter((o) => o.status === 'preparation') ?? []
  const published = items?.filter((o) => o.status !== 'preparation') ?? []
    return (
    <>
      <header className="ac-page-head ac-page-head--row">
        <div>
          <h1>Moje prilike</h1>
          <p className="ac-muted">Nacrti i objavljene prilike koje ste stvorili.</p>
        </div>
        <Link to="/organizator/nova" className="ac-btn ac-btn--primary">Nova prilika</Link>
      </header>

      {notice && <p className="ac-note ac-note--good" role="status">{notice}</p>}
      {error && <p className="ac-note ac-note--bad" role="alert">{error}</p>}
      {!items && !error && <p className="ac-muted" role="status">Učitavanje…</p>}

      {items?.length === 0 && (
        <div className="ac-empty">
          <h3>Još niste stvorili nijednu priliku</h3>
          <p className="ac-muted">Nova prilika se sprema kao nacrt, a objavljujete je kad bude spremna.</p>
          <Link to="/organizator/nova" className="ac-btn ac-btn--primary">Nova prilika</Link>
        </div>
      )}

      {drafts.length > 0 && (
        <section>
          <h2>Nacrti</h2>
          <div className="ac-grid">
            {drafts.map((o) => <OpportunityCard key={o.id} opportunity={o} showOrganizer={false} />)}
          </div>
        </section>
      )}

      {published.length > 0 && (
        <section>
          <h2>Objavljene</h2>
          <div className="ac-grid">
            {published.map((o) => <OpportunityCard key={o.id} opportunity={o} showOrganizer={false} />)}
          </div>
        </section>
      )}
    </>
  )
}