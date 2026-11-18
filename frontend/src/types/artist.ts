export const ART_FIELDS = [
  'Slikarstvo',
  'Fotografija',
  'Skulptura',
  'Ilustracija',
  'Digitalna umjetnost',
] as const;
export type ArtField = (typeof ART_FIELDS)[number];

export type OpportunityType = 'exhibition' | 'competition' | 'workshop' | 'other'
export type OpportunityStatus = 'preparation' | 'open' | 'closed' | 'selection' | 'finished'

export type ApplicationStatus = 'predana' | 'u_pregledu' | 'potrebna_dopuna' | 'prihvacena' | 'odbijena';

export const OPPORTUNITY_STATUS_LABEL: Record<OpportunityStatus, string> = {
  preparation: 'Priprema',
  open: 'Otvoreno za prijave',
  closed: 'Prijave zatvorene',
  selection: 'U procesu odabira',
  finished: 'Završeno',
};

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  predana: 'Predana',
  u_pregledu: 'U pregledu',
  potrebna_dopuna: 'Potrebna dopuna',
  prihvacena: 'Prihvaćena',
  odbijena: 'Odbijena',
};

export interface Artwork {
  id: string;
  title: string;
  year: number;
  technique: string;
  dimensions: string;
  description: string;
  imageUrl?: string;
  isPublic: boolean;
}

export interface Exhibition {
  id: string;
  title: string;
  year: number;
  place: string;
}

export interface ArtistProfile {
  username: string;
  name: string;
  email: string;
  field: ArtField;
  bio: string;
  statement: string;
  website: string;
  social: string;
  avatarUrl?: string;
  exhibitions: Exhibition[];
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

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  submittedAt: string;
  status: ApplicationStatus;
  artworkIds: string[];
  message: string;
  materialsUrl?: string;
  rejectionReason?: string;
  revisionNote?: string;
}