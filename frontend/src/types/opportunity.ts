export type OpportunityType = 'exhibition' | 'competition' | 'workshop' | 'other'
export type OpportunityStatus = 'preparation' | 'open' | 'closed' | 'selection' | 'finished'

export type Opportunity = {
    id: number
    type: OpportunityType
    title: string
    description: string
    field: number
    field_name: string
    organizer_name: string

    deadline: string | null
    address: string
    latitude: string | null
    longitude: string | null
    starts_at: string | null
    ends_at: string | null
    age_criteria: string
    reward: string
    status: OpportunityStatus
    created_at: string 
}

export type OpportunityInput = {
  type?: OpportunityType
  title?: string
  description?: string
  field?: number

  deadline?: string | null
  address?: string
  latitude?: string | null
  longitude?: string | null
  starts_at?: string | null
  ends_at?: string | null
  age_criteria?: string
  reward?: string
}

export type ArtField = { id: number; name: string }

export type CurrentUser = {
  id: number
  email: string
  display_name: string
  role: 'artist' | 'organizer' | 'admin' | null
  registration_complete: boolean
  organizer_profile: { name: string; organization_type: string; description: string; approved: boolean } | null
}

export const TYPE_LABELS: Record<OpportunityType, string> = {
  exhibition: 'Izložba',
  competition: 'Natječaj',
  workshop: 'Radionica',
  other: 'Drugo',
}

export const STATUS_LABELS: Record<OpportunityStatus, string> = {
  preparation: 'Priprema',
  open: 'Otvoreno za prijave',
  closed: 'Prijave zatvorene',
  selection: 'U procesu odabira',
  finished: 'Završeno',
}

export const TRANSITIONS: Record<OpportunityStatus, { to: OpportunityStatus; label: string }[]> = {
  preparation: [{ to: 'open', label: 'Objavi' }],
  open: [
    { to: 'closed', label: 'Zatvori prijave' },
    { to: 'selection', label: 'Započni odabir' },
  ],
  closed: [
    { to: 'open', label: 'Ponovno otvori prijave' },
    { to: 'selection', label: 'Započni odabir' },
  ],
  selection: [{ to: 'finished', label: 'Završi' }],
  finished: [],
}

export const EDITABLE_AFTER_PUBLISH: (keyof OpportunityInput)[] = [
  'address', 'latitude', 'longitude', 'deadline', 'starts_at', 'ends_at',
]