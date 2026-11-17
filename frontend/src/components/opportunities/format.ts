export function formatDate(value: string | null): string {
  if (!value) return '—'
  const [y, m, d] = value.split('-').map(Number)
  return `${d}. ${m}. ${y}.`
}

export function formatDateTime(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  const time = date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}. u ${time}`
}

export function formatEventTime(startsAt: string | null, endsAt: string | null): string {
  if (!startsAt && !endsAt) return '—'
  if (startsAt && endsAt) return `${formatDateTime(startsAt)} – ${formatDateTime(endsAt)}`
  return startsAt ? `od ${formatDateTime(startsAt)}` : `do ${formatDateTime(endsAt)}`
}

export function toDateTimeLocal(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

export function fromDateTimeLocal(value: string): string | null {
  return value ? new Date(value).toISOString() : null
}

export function todayIso(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

