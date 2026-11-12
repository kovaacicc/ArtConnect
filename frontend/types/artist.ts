export const ART_FIELDS = [
  'Slikarstvo',
  'Fotografija',
  'Skulptura',
  'Ilustracija',
  'Digitalna umjetnost',
] as const;
export type ArtField = (typeof ART_FIELDS)[number];

export type OpportunityStatus = 'priprema' | 'otvoreno' | 'zatvoreno' | 'odabir' | 'zavrseno';
export type ApplicationStatus = 'predana' | 'u_pregledu' | 'potrebna_dopuna' | 'prihvacena' | 'odbijena';

export const OPPORTUNITY_STATUS_LABEL: Record<OpportunityStatus, string> = {
  priprema: 'Priprema',
  otvoreno: 'Otvoreno za prijave',
  zatvoreno: 'Prijave zatvorene',
  odabir: 'U procesu odabira',
  zavrseno: 'Završeno',
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
  name: string;
  email: string;
  field: ArtField;
  bio: string;
  statement: string;
  website: string;
  social: string;
  exhibitions: Exhibition[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  organizer: string;
  field: ArtField;
  deadline: string; // ISO datum (YYYY-MM-DD)
  eventDate: string; // ISO datum
  city: string;
  address?: string; // ako postoji, prikazuje se karta
  ageCriteria?: string;
  reward?: string;
  status: OpportunityStatus;
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
