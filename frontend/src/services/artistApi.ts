import type { Application, ArtistProfile, Artwork, Opportunity } from '../types/artist';

const delay = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), ms));
const uid = () => Math.random().toString(36).slice(2, 10);

let profile: ArtistProfile = {
  username: 'ana.horvat',
  name: 'Ana Horvat',
  email: 'ana.horvat@gmail.com',
  field: 'Slikarstvo',
  bio: 'Studentica Akademije likovnih umjetnosti u Zagrebu. Radim s uljem i mješovitim tehnikama, najčešće na temu urbanih krajolika.',
  statement: 'Zanimaju me tihi trenuci u gradu koje ljudi obično prolaze ne gledajući.',
  website: 'https://anahorvat.art',
  social: 'https://instagram.com/anahorvat.art',
  avatarUrl: '',
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

let applications: Application[] = [
  { id: 'p1', opportunityId: '1', opportunityTitle: 'Grad u pokretu', submittedAt: '2026-09-20', status: 'prihvacena', artworkIds: ['a1'], message: 'Rad bi se uklopio u temu.' },
  { id: 'p2', opportunityId: '2', opportunityTitle: 'Svjetlo i sjena', submittedAt: '2026-11-02', status: 'potrebna_dopuna', artworkIds: ['a2'], message: '', revisionNote: 'Dodajte još dva rada u portfolio.' },
  { id: 'p3', opportunityId: '3', opportunityTitle: 'Ilustracija za dječji časopis', submittedAt: '2026-11-05', status: 'u_pregledu', artworkIds: ['a1', 'a2'], message: 'Rado bih sudjelovala.' },
  { id: 'p4', opportunityId: '4', opportunityTitle: 'Digitalna umjetnost', submittedAt: '2026-08-14', status: 'odbijena', artworkIds: ['a2'], message: '', rejectionReason: 'Stil radova ne odgovara temi.' },
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

  getApplications: () => delay(applications),
  createApplication: async (data: { opportunityId: string; artworkIds: string[]; message: string; materialsUrl?: string }) => {
    const app: Application = {
      id: uid(), 
      opportunityTitle: 'Nova prijava', // U pravoj aplikaciji ovo bi došlo s backenda
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'predana', 
      ...data,
    };
    applications = [app, ...applications];
    return delay(app);
  },
};

export function googleCalendarUrl(o: Opportunity): string {
  if (!o.starts_at) return '#';
  const d = o.starts_at.replace(/-/g, '');
  const next = new Date(o.starts_at); 
  next.setDate(next.getDate() + 1);
  const end = next.toISOString().slice(0, 10).replace(/-/g, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE', text: o.title, dates: `${d}/${end}`,
    details: `${o.organizer_name} – ${o.description}`, location: o.address,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' });

export const daysLeft = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);