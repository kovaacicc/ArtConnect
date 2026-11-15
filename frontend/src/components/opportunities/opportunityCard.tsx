import { Link } from 'react-router-dom'
import { TYPE_LABELS, type Opportunity } from '../../types/opportunity'
import { formatDate } from './format'
import StatusBadge from './status'

type Props = { opportunity: Opportunity; showOrganizer?: boolean }

export default function OpportunityCard({ opportunity: o, showOrganizer = true }: Props) {
  return (
    <Link to={`/organizator/prilike/${o.id}`} className="ac-card ac-card--link org-card">
      <div className="org-card-top">
        <StatusBadge status={o.status} />
      </div>
      <h3>{o.title}</h3>
      <p className="ac-muted">{TYPE_LABELS[o.type]} · {o.field_name}</p>
      {showOrganizer && <p className="ac-muted">{o.organizer_name}</p>}
      <dl className="ac-meta">
        <div>
          <dt>Rok</dt>
          <dd>{formatDate(o.deadline)}</dd>
        </div>
        {o.address && (
          <div>
            <dt>Mjesto</dt>
            <dd>{o.address}</dd>
          </div>
        )}
      </dl>
    </Link>
  )
}