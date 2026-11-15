import { api } from './api'

export type Role = 'artist' | 'organizer' | 'admin'

export type ArtField = { id: number; name: string }

export type User = {
  id: number
  email: string
  display_name: string
  role: Role
  registration_complete: boolean
  artist_profile: { first_name: string; last_name: string } | null
  organizer_profile: { name: string; approved: boolean } | null
}

export type RegisterData =
  | {
      role: 'artist'
      first_name: string
      last_name: string
      art_fields: number[]
      website_url: string
      social_url: string
    }
  | {
      role: 'organizer'
      name: string
      organization_type: string
      description: string
    }

// Prijavu radi backend (django-allauth): preglednik ode na Google i vrati se na "/" s prijavljenom sesijom.
export function loginWithGoogle(chooseAccount = false) {
  const choose = chooseAccount ? '&auth_params=prompt%3Dselect_account' : ''
  window.location.href = `/oauth/google/login/?process=login${choose}`
}

export const getMe = () => api.get<User>('/api/users/me/')
export const register = (data: RegisterData) => api.post<User>('/api/users/auth/register/', data)
export const logout = () => api.post<void>('/api/users/auth/logout/')
export const getArtFields = () => api.get<ArtField[]>('/api/portfolio/art-fields/')

/** Ime za pozdrav: ime umjetnika, naziv organizatora ili ime s Googlea. */
export function greetingName(user: User) {
  return user.artist_profile?.first_name || user.organizer_profile?.name || user.display_name || user.email
}
