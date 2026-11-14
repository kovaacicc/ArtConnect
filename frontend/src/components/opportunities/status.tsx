import { STATUS_LABELS, type OpportunityStatus } from '../../types/opportunity'

export default function StatusBadge({ status }: { status: OpportunityStatus }) {
  return <span className={`opp-status opp-status-${status}`}>{STATUS_LABELS[status]}</span>
}