import type { ArtField } from '../services/auth'

export type OpportunityType = 'exhibition' | 'competition' | 'workshop' | 'other'
export type OpportunityStatus = 'preparation' | 'open' | 'closed' | 'selection' | 'finished'

export const OPPORTUNITY_STATUS_LABEL: Record<OpportunityStatus, string> = {
  preparation: 'Priprema',
  open: 'Otvoreno za prijave',
  closed: 'Prijave zatvorene',
  selection: 'U procesu odabira',
  finished: 'Završeno',
};

// Statusi prijava (backend još nema endpoint za prijave umjetnika; za sada se ne koriste).
export type ApplicationStatus = 'predana' | 'u_pregledu' | 'potrebna_dopuna' | 'prihvacena' | 'odbijena';
export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  predana: 'Predana',
  u_pregledu: 'U pregledu',
  potrebna_dopuna: 'Potrebna dopuna',
  prihvacena: 'Prihvaćena',
  odbijena: 'Odbijena',
};

export interface ArtworkFile { id: number; url: string; file_type: string }

export interface Artwork {
  id: number;
  title: string;
  year_created: number | null;
  technique: string;
  dimensions: string;
  description: string;
  is_public: boolean;
  files: ArtworkFile[];
}
export type ArtworkInput = Omit<Artwork, 'id' | 'files'>;

export interface Exhibition { id: number; title: string; year: number | null; description: string }

export interface Participation {
  opportunity_id: number;
  title: string;
  type: OpportunityType;
  starts_at: string | null;
}

export interface ArtistProfile {
  first_name: string;
  last_name: string;
  biography: string;
  work_description: string;
  website_url: string;
  social_url: string;
  portfolio_public: boolean;
  art_fields: ArtField[];
  participations: Participation[];
}

export interface ProfileUpdate {
  first_name: string;
  last_name: string;
  biography: string;
  work_description: string;
  website_url: string;
  social_url: string;
  art_fields: number[]; // PATCH prima id-eve područja
}

export interface Opportunity {
  id: number;
  type: OpportunityType;
  title: string;
  description: string;
  field: number;
  field_name: string;
  organizer_name: string;
  deadline: string | null;
  address: string;
  latitude: string | null;
  longitude: string | null;
  starts_at: string | null;
  ends_at: string | null;
  age_criteria: string;
  reward: string;
  status: OpportunityStatus;
  created_at: string;
}
