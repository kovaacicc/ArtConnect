export type FieldErrors = Record<string, string>

export class ApiError extends Error {
  status: number
  fieldErrors: FieldErrors

  constructor(status: number, message: string, fieldErrors: FieldErrors = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

let onUnauthorized: () => void = () => {}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

async function ensureCsrfToken(): Promise<string> {
  let token = getCookie('csrftoken')
  if (!token) {
    await fetch('/api/users/auth/csrf/', { credentials: 'include' })
    token = getCookie('csrftoken')
  }
  return token ?? ''
}

function parseErrors(body: unknown): { message: string; fieldErrors: FieldErrors } {
  const fieldErrors: FieldErrors = {}
  let message = ''
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
      const text = Array.isArray(value) ? value.join(' ') : String(value)
      if (key === 'detail' || key === 'non_field_errors') message = text
      else fieldErrors[key] = text
    }
  } else if (Array.isArray(body)) {
    message = body.join(' ')
  }
  return { message, fieldErrors }
}

const DEFAULT_MESSAGES: Record<number, string> = {
  400: 'Provjerite označena polja.',
  401: 'Niste prijavljeni.',
  403: 'Nemate ovlasti za ovu radnju.',
  404: 'Prilika ne postoji ili nije vaša.',
}

export async function apiRequest<T>(method: string, url: string, data?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (data !== undefined) headers['Content-Type'] = 'application/json'
  if (method !== 'GET') headers['X-CSRFToken'] = await ensureCsrfToken()

      let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Poslužitelj nije dostupan. Pokušajte ponovno.')
  }

    if (response.status === 204) return undefined as T

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) onUnauthorized()
    const { message, fieldErrors } = parseErrors(body)
    throw new ApiError(
      response.status,
      message || DEFAULT_MESSAGES[response.status] || 'Došlo je do greške.',
      fieldErrors,
    )
  }
  return body as T
}

export const api = {
  get: <T>(url: string) => apiRequest<T>('GET', url),
  post: <T>(url: string, data?: unknown) => apiRequest<T>('POST', url, data ?? {}),
  patch: <T>(url: string, data: unknown) => apiRequest<T>('PATCH', url, data),
  delete: <T>(url: string, data?: unknown) => apiRequest<T>('DELETE', url, data),
}