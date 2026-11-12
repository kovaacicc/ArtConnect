/**
 * Sloj za komunikaciju s backendom (Django).
 * Trenutno radi nad mock podacima u memoriji kako bi se frontend mogao razvijati
 * neovisno o backendu. Kad endpointi budu spremni, zamijeni tijela funkcija s
 * fetch pozivima (potpisi funkcija ostaju isti).
 */
import type { Application, ArtistProfile, Artwork, Opportunity } from '../types/artist';

const delay = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), ms));
const uid = () => Math.random().toString(36).slice(2, 10);

let profile: ArtistProfile = {
  name: 'Ana Horvat',
  email: 'ana.horvat@gmail.com',
  field: 'Slikarstvo',
  bio: 'Studentica Akademije likovnih umjetnosti u Zagrebu. Radim s uljem i mješovitim tehnikama, najčešće na temu urbanih krajolika.',
  statement: 'Zanimaju me tihi trenuci u gradu koje ljudi obično prolaze ne gledajući.',
  website: 'https://anahorvat.art',
  social: 'https://instagram.com/anahorvat.art',
  exhibitions: [
    { id: 'e1', title: 'Mlada scena', year: 2025, place: 'Galerija Greta, Zagreb' },
    { id: 'e2', title: 'Pogled iz prozora', year: 2024, place: 'Kulturni centar Travno' },
  ],
};

let artworks: Artwork[] = [
  { id: 'a1', title: 'Tramvaj u sumrak', year: 2025, technique: 'Ulje na platnu', dimensions: '80 × 60 cm', description: 'Večernji prizor s Ozaljske ulice.', isPublic: true },
  { id: 'a2', title: 'Krovovi', year: 2025, technique: 'Akril na papiru', dimensions: '50 × 70 cm', description: 'Serija o pogledima s tavana.', isPublic: true },
  { id: 'a3', title: 'Bez naslova #4', year: 2024, technique: 'Mješovita tehnika', dimensions: '100 × 100 cm', description: 'Rad u nastajanju.', isPublic: false },
];

const opportunities: Opportunity[] = [
  { id: 'o1', title: 'Otvoreni natječaj: Grad u pokretu', description: 'Skupna izložba radova mladih umjetnika na temu urbanog života. Odabrani radovi izlažu se u sklopu festivala u Zagrebu.', organizer: 'Galerija Greta', field: 'Slikarstvo', deadline: '2026-12-05', eventDate: '2027-02-12', city: 'Zagreb', address: 'Ilica 25, Zagreb', ageCriteria: 'do 30 godina', reward: 'Honorar 300 €', status: 'otvoreno' },
  { id: 'o2', title: 'Foto radionica: Svjetlo i sjena', description: 'Trodnevna radionica s gostujućim fotografom. Prijavite se portfoliom od najmanje tri rada.', organizer: 'Klub mladih fotografa', field: 'Fotografija', deadline: '2026-11-20', eventDate: '2026-12-10', city: 'Split', address: 'Riva 1, Split', ageCriteria: '18 – 35', status: 'otvoreno' },
  { id: 'o3', title: 'Ilustracija za dječji časopis', description: 'Tražimo ilustratore za nove brojeve časopisa. Plaćeni angažman.', organizer: 'Izdavačka kuća Mali svijet', field: 'Ilustracija', deadline: '2027-01-15', eventDate: '2027-03-01', city: 'Online', reward: '150 € po ilustraciji', status: 'otvoreno' },
  { id: 'o4', title: 'Skulpture u parku', description: 'Privremena izložba skulptura na otvorenom.', organizer: 'Grad Rijeka', field: 'Skulptura', deadline: '2026-10-01', eventDate: '2026-11-28', city: 'Rijeka', address: 'Trg 128. brigade, Rijeka', status: 'odabir' },
  { id: 'o5', title: 'Digitalna umjetnost 2027', description: 'Natječaj za radove u digitalnom mediju. Priprema u tijeku.', organizer: 'Muzej suvremene umjetnosti', field: 'Digitalna umjetnost', deadline: '2027-03-30', eventDate: '2027-05-20', city: 'Zagreb', address: 'Avenija Dubrovnik 17, Zagreb', status: 'priprema' },
];

let applications: Application[] = [
  { id: 'p1', opportunityId: 'o4', opportunityTitle: 'Skulpture u parku', submittedAt: '2026-09-20', status: 'prihvacena', artworkIds: ['a1'], message: 'Rad bi se uklopio u temu.' },
  { id: 'p2', opportunityId: 'o2', opportunityTitle: 'Foto radionica: Svjetlo i sjena', submittedAt: '2026-11-02', status: 'potrebna_dopuna', artworkIds: ['a2'], message: '', revisionNote: 'Dodajte još dva rada u portfolio.' },
  { id: 'p3', opportunityId: 'o1', opportunityTitle: 'Otvoreni natječaj: Grad u pokretu', submittedAt: '2026-11-05', status: 'u_pregledu', artworkIds: ['a1', 'a2'], message: 'Rado bih sudjelovala.' },
  { id: 'p4', opportunityId: 'o3', opportunityTitle: 'Ilustracija za dječji časopis', submittedAt: '2026-08-14', status: 'odbijena', artworkIds: ['a2'], message: '', rejectionReason: 'Stil radova ne odgovara temi časopisa.' },
];

export const artistApi = {
  getProfile: () => delay(profile),
  saveProfile: async (p: ArtistProfile) => { profile = p; return delay(profile); },

  getArtworks: () => delay(artworks),
  saveArtwork: async (a: Omit<Artwork, 'id'> & { id?: string }) => {
    if (a.id) artworks = artworks.map((x) => (x.id === a.id ? (a as Artwork) : x));
    else artworks = [{ ...a, id: uid() }, ...artworks];
    return delay(artworks);
  },
  deleteArtwork: async (id: string) => { artworks = artworks.filter((a) => a.id !== id); return delay(artworks); },

  getOpportunities: () => delay(opportunities),
  getOpportunity: (id: string) => delay(opportunities.find((o) => o.id === id) ?? null),

  getApplications: () => delay(applications),
  createApplication: async (data: { opportunityId: string; artworkIds: string[]; message: string; materialsUrl?: string }) => {
    const opp = opportunities.find((o) => o.id === data.opportunityId)!;
    const app: Application = {
      id: uid(), opportunityTitle: opp.title, submittedAt: new Date().toISOString().slice(0, 10),
      status: 'predana', ...data,
    };
    applications = [app, ...applications];
    return delay(app);
  },
};

/** Poveznica "Dodaj u Google Calendar" (bez OAuth-a, koristi Google Calendar template URL). */
export function googleCalendarUrl(o: Opportunity): string {
  const d = o.eventDate.replace(/-/g, '');
  const next = new Date(o.eventDate); next.setDate(next.getDate() + 1);
  const end = next.toISOString().slice(0, 10).replace(/-/g, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE', text: o.title, dates: `${d}/${end}`,
    details: `${o.organizer} – ${o.description}`, location: o.address ?? o.city,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' });

export const daysLeft = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
