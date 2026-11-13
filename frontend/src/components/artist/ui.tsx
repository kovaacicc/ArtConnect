import { useEffect, type ReactNode } from 'react';
import {
  APPLICATION_STATUS_LABEL, OPPORTUNITY_STATUS_LABEL,
  type ApplicationStatus, type OpportunityStatus,
} from '../../types/artist';

export function ApplicationBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`ac-badge ac-badge--${status}`}>{APPLICATION_STATUS_LABEL[status]}</span>;
}

export function OpportunityBadge({ status }: { status: OpportunityStatus }) {
  return <span className={`ac-badge ac-badge--opp-${status}`}>{OPPORTUNITY_STATUS_LABEL[status]}</span>;
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="ac-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="ac-modal__head">
          <h2>{title}</h2>
          <button className="ac-icon-btn" onClick={onClose} aria-label="Zatvori">✕</button>
        </header>
        {children}
      </div>
    </div>
  );
}

export function Empty({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="ac-empty">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function Loading() {
  return <p className="ac-muted" role="status">Učitavanje…</p>;
}
