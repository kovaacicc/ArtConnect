import { STATUS_LABELS, type OpportunityStatus } from '../../types/opportunity'

export default function StatusBadge({ status }: { status: OpportunityStatus }) {
    return <span className={`ac-badge ac-badge--opp-${status}`}>{STATUS_LABELS[status]}</span>
}