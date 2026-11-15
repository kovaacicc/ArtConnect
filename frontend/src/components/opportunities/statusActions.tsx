import { useState } from 'react'
import { ApiError } from '../../services/api'
import { opportunitiesApi } from '../../services/opportunitiesApi'
import { TRANSITIONS, type Opportunity, type OpportunityStatus } from '../../types/opportunity'

type Props = {
  opportunity: Opportunity
  approved: boolean
  onChanged: (updated: Opportunity) => void
}

const FIELD_LABELS: Record<string, string> = { description: 'Opis', deadline: 'Rok za prijavu' }

export default function StatusActions({ opportunity, approved, onChanged }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const transitions = TRANSITIONS[opportunity.status]
  if (transitions.length === 0) return null

  async function change(to: OpportunityStatus) {
    setBusy(true)
    setError('')
    try {
      onChanged(await opportunitiesApi.changeStatus(opportunity.id, to))
    } catch (e) {
      if (e instanceof ApiError) {
        const messages = Object.entries(e.fieldErrors).map(([name, message]) =>
          name === 'status' ? message : `${FIELD_LABELS[name] ?? name}: ${message}`,
        )
        setError(messages.join(' ') || e.message)
      } else {
        setError('Došlo je do greške.')
      }
    } finally {
      setBusy(false)
    }
  }
    const waitingForApproval = !approved && transitions.some((t) => t.to === 'open')

  return (
    <div className="org-status-actions">
      <div className="ac-row">
        {transitions.map(({ to, label }) => (
          <button
            key={to}
            type="button"
            className={to === 'open' ? 'ac-btn ac-btn--primary' : 'ac-btn ac-btn--ghost'}
            disabled={busy || (to === 'open' && !approved)}
            onClick={() => change(to)}
          >
            {label}
          </button>
        ))}
      </div>
      {waitingForApproval && (
        <p className="ac-note ac-note--warn">
          Vaš račun čeka odobrenje administratora, pa još ne možete objaviti priliku.
        </p>
      )}
      {error && <p className="ac-note ac-note--bad" role="alert">{error}</p>}
    </div>
  )
}