import { api } from './api'
import type {
  ArtField,
  CurrentUser,
  Opportunity,
  OpportunityInput,
  OpportunityStatus,
} from '../types/opportunity'


const BASE = '/api/opportunities'

export const opportunitiesApi = {
  list: () => api.get<Opportunity[]>(`${BASE}/`),
  mine: () => api.get<Opportunity[]>(`${BASE}/mine/`),
  get: (id: number) => api.get<Opportunity>(`${BASE}/${id}/`),
  create: (data: OpportunityInput) => api.post<Opportunity>(`${BASE}/`, data),
  update: (id: number, data: OpportunityInput) => api.patch<Opportunity>(`${BASE}/${id}/`, data),
  remove: (id: number, reason?: string) =>
    api.delete<void>(`${BASE}/${id}/`, reason !== undefined ? { reason } : undefined),
  changeStatus: (id: number, status: OpportunityStatus) =>
    api.post<Opportunity>(`${BASE}/${id}/status/`, { status }),

  artFields: () => api.get<ArtField[]>('/api/portfolio/art-fields/'),
  me: () => api.get<CurrentUser>('/api/users/me/'),
}