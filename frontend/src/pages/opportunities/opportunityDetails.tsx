import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { formatDate, formatEventTime } from '../../components/opportunities/format'
import OpportunityMap from '../../components/opportunities/opportunityMap'
import StatusBadge from '../../components/opportunities/status'
import { ApiError } from '../../services/api'
import { opportunitiesApi } from '../../services/opportunitiesApi'
import { TYPE_LABELS, type Opportunity } from '../../types/opportunity'

export default function OpportunityDetail() {
  const id = Number(useParams().id)
  const notice = (useLocation().state as { notice?: string } | null)?.notice
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    opportunitiesApi
      .get(id)
      .then(setOpportunity)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Došlo je do greške.'))
    opportunitiesApi
      .mine()
      .then((mine) => setIsOwner(mine.some((o) => o.id === id)))
      .catch(() => setIsOwner(false))
  }, [id])

  if (error) return <p className="ac-note ac-note--bad" role="alert">{error}</p>
  if (!opportunity) return <p className="ac-muted" role="status">Učitavanje…</p>

  const o = opportunity
    return (
    <>
      <Link to={isOwner ? '/organizator/moje' : '/organizator/prilike'} className="ac-back">← Natrag</Link>
      {notice && <p className="ac-note ac-note--good" role="status">{notice}</p>}

      <header className="ac-page-head">
        <div className="org-card-top">
          <StatusBadge status={o.status} />
        </div>
        <h1>{o.title}</h1>
        <p className="ac-muted">{TYPE_LABELS[o.type]} · {o.field_name} · {o.organizer_name}</p>
      </header>

      {isOwner && o.status !== 'finished' && (
        <div className="ac-row org-owner-actions">
          <Link to={`/organizator/prilike/${o.id}/uredi`} className="ac-btn ac-btn--ghost">Uredi</Link>
        </div>
      )}

      <div className="ac-cols ac-cols--detail">
        <section>
          {o.description && <p className="ac-prose">{o.description}</p>}
          <dl className="ac-meta ac-meta--stack">
            <div><dt>Rok za prijavu</dt><dd>{formatDate(o.deadline)}</dd></div>
            <div><dt>Vrijeme održavanja</dt><dd>{formatEventTime(o.starts_at, o.ends_at)}</dd></div>
            <div><dt>Mjesto</dt><dd>{o.address || '—'}</dd></div>
            {o.age_criteria && <div><dt>Kriterij</dt><dd>{o.age_criteria}</dd></div>}
            {o.reward && <div><dt>Nagrada / naknada</dt><dd>{o.reward}</dd></div>}
          </dl>
        </section>
        <section>
          <OpportunityMap latitude={o.latitude} longitude={o.longitude} title={o.title} />
        </section>
      </div>
    </>
  )
}