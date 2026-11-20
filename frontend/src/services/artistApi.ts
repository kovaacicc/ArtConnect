import { api, ApiError } from './api'
import type { ArtistProfile, Artwork, ArtworkFile, ArtworkInput, Exhibition, ProfileUpdate } from '../types/artist'

// Backend može vratiti običan niz ili paginirani objekt { results: [...] }.
type Listed<T> = T[] | { results: T[] }
const unwrap = <T,>(d: Listed<T>): T[] => (Array.isArray(d) ? d : d.results)

export const errMsg = (e: unknown) =>
  e instanceof ApiError
    ? [e.message, ...Object.values(e.fieldErrors)].filter(Boolean).join(' ')
    : 'Došlo je do greške.'

export const artistApi = {
  // Profil i portfolio
  getProfile: () => api.get<ArtistProfile>('/api/portfolio/me/'),
  saveProfile: (p: ProfileUpdate) => api.patch<ArtistProfile>('/api/portfolio/me/', p),

  // Radovi
  getArtworks: async () => unwrap(await api.get<Listed<Artwork>>('/api/portfolio/artworks/')),
  createArtwork: (a: ArtworkInput) => api.post<Artwork>('/api/portfolio/artworks/', a),
  updateArtwork: (id: number, a: Partial<ArtworkInput>) => api.patch<Artwork>(`/api/portfolio/artworks/${id}/`, a),
  deleteArtwork: (id: number) => api.delete<void>(`/api/portfolio/artworks/${id}/`),
  addArtworkFile: (artworkId: number, url: string, file_type = 'image') =>
    api.post<ArtworkFile>(`/api/portfolio/artworks/${artworkId}/files/`, { url, file_type }),
  deleteArtworkFile: (artworkId: number, fileId: number) =>
    api.delete<void>(`/api/portfolio/artworks/${artworkId}/files/${fileId}/`),

  // Prethodne izložbe
  getExhibitions: async () => unwrap(await api.get<Listed<Exhibition>>('/api/portfolio/exhibitions/')),
  createExhibition: (e: { title: string; year: number | null; description: string }) =>
    api.post<Exhibition>('/api/portfolio/exhibitions/', e),
  deleteExhibition: (id: number) => api.delete<void>(`/api/portfolio/exhibitions/${id}/`),
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' })

export const daysLeft = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)