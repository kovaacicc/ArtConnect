import { useEffect, useState } from 'react'
import OpportunityCard from '../../components/opportunities/opportunityCard'
import { ApiError } from '../../services/api'
import { opportunitiesApi } from '../../services/opportunitiesApi'
import type { Opportunity } from '../../types/opportunity'


export default function OpportunityList() {
  const [items, setItems] = useState<Opportunity[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    opportunitiesApi
      .list()
      .then(setItems)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Došlo je do greške.'))
  }, [])
return (
    <>
      <header className="ac-page-head">
        <h1>Sve prilike</h1>
        <p className="ac-muted">Objavljene prilike svih organizatora.</p>
      </header>
      {error && <p className="ac-note ac-note--bad" role="alert">{error}</p>}
      {!items && !error && <p className="ac-muted" role="status">Učitavanje…</p>}
      {items?.length === 0 && (
        <div className="ac-empty">
          <h3>Trenutno nema objavljenih prilika</h3>
        </div>
      )}
      {items && items.length > 0 && (
        <div className="ac-grid">
          {items.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}
        </div>
      )}
    </>
  )
}