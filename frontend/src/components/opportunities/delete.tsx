import { useEffect, useState, type FormEvent } from 'react'
import { ApiError } from '../../services/api'
import { opportunitiesApi } from '../../services/opportunitiesApi'
import type { Opportunity } from '../../types/opportunity'

type Props = {
  opportunity: Opportunity
  onClose: () => void
  onDeleted: () => void
}

export default function DeleteDialog({ opportunity, onClose, onDeleted }: Props) {
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const published = opportunity.status !== 'preparation'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
    async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (published && !reason.trim()) {
      setError('Upišite obrazloženje brisanja.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await opportunitiesApi.remove(opportunity.id, published ? reason.trim() : undefined)
      onDeleted()
    } catch (e) {
      setError(e instanceof ApiError ? e.fieldErrors.reason || e.message : 'Došlo je do greške.')
      setBusy(false)
    }
  }
    return (
    <div className="ac-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <header className="ac-modal__head">
          <h2 id="delete-title">Obrisati priliku?</h2>
          <button type="button" className="ac-icon-btn" onClick={onClose} aria-label="Zatvori">✕</button>
        </header>

        <form className="ac-form" onSubmit={handleSubmit} noValidate>
          <p>
            <strong>{opportunity.title}</strong>
          </p>
          {published ? (
            <>
              <p className="ac-muted">
                Prilika je objavljena i umjetnici je vide. Nakon brisanja više neće biti vidljiva, a obrazloženje se
                sprema.
              </p>
              <label>
                Obrazloženje
                <textarea
                  className="ac-input"
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  aria-invalid={Boolean(error)}
                  autoFocus
                />
              </label>
            </>
          ) : (
            <p className="ac-muted">Ovo je nacrt koji nitko osim vas nije vidio. Brisanje je trajno.</p>
          )}

          {error && <p className="ac-note ac-note--bad" role="alert">{error}</p>}

          <div className="ac-row">
            <button type="submit" className="ac-btn ac-btn--primary org-btn-danger" disabled={busy}>
              {busy ? 'Brišem…' : 'Obriši'}
            </button>
            <button type="button" className="ac-btn ac-btn--ghost" onClick={onClose} disabled={busy}>
              Odustani
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}