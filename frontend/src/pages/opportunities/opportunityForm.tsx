import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fromDateTimeLocal, nowDateTimeLocal, toDateTimeLocal, todayIso } from '../../components/opportunities/format'
import { ApiError, type FieldErrors } from '../../services/api'
import { geocodeAddress, mapsAvailable } from '../../services/googleMaps'
import { opportunitiesApi } from '../../services/opportunitiesApi'
import {
  EDITABLE_AFTER_PUBLISH,
  TYPE_LABELS,
  type ArtField,
  type Opportunity,
  type OpportunityInput,
  type OpportunityType,
} from '../../types/opportunity'

type Values = {
  type: OpportunityType
  title: string
  description: string
  field: string
  deadline: string
  address: string
  starts_at: string
  ends_at: string
  age_criteria: string
  reward: string
}

const EMPTY: Values = {
  type: 'competition',
  title: '',
  description: '',
  field: '',
  deadline: '',
  address: '',
  starts_at: '',
  ends_at: '',
  age_criteria: '',
  reward: '',
}

function toValues(o: Opportunity): Values {
  return {
    type: o.type,
    title: o.title,
    description: o.description,
    field: String(o.field),
    deadline: o.deadline ?? '',
    address: o.address,
    starts_at: toDateTimeLocal(o.starts_at),
    ends_at: toDateTimeLocal(o.ends_at),
    age_criteria: o.age_criteria,
    reward: o.reward,
  }
}

function toInput(v: Values): OpportunityInput {
  const input: OpportunityInput = {
    type: v.type,
    title: v.title.trim(),
    description: v.description.trim(),
    field: Number(v.field),
    address: v.address.trim(),
    starts_at: fromDateTimeLocal(v.starts_at),
    ends_at: fromDateTimeLocal(v.ends_at),
    age_criteria: v.age_criteria.trim(),
    reward: v.reward.trim(),
  }
  if (v.deadline) input.deadline = v.deadline
  return input
}

export default function OpportunityForm() {
  const params = useParams()
  const editId = params.id ? Number(params.id) : null
  const navigate = useNavigate()

  const [original, setOriginal] = useState<Opportunity | null>(null)
  const [values, setValues] = useState<Values>(EMPTY)
  const [fields, setFields] = useState<ArtField[]>([])
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    opportunitiesApi.artFields().then(setFields).catch(() => setFields([]))
    if (editId !== null) {
      opportunitiesApi
        .get(editId)
        .then((o) => {
          setOriginal(o)
          setValues(toValues(o))
        })
        .catch((e) => setLoadError(e instanceof ApiError ? e.message : 'Došlo je do greške.'))
    }
  }, [editId])

  if (loadError) return <p className="ac-note ac-note--bad" role="alert">{loadError}</p>
  if (editId !== null && !original) return <p className="ac-muted" role="status">Učitavanje…</p>
  if (original?.status === 'finished') {
    return <p className="ac-note ac-note--bad" role="alert">Završena prilika se više ne može uređivati.</p>
  }

  const published = original !== null && original.status !== 'preparation'
  const locked = (name: keyof Values) => published && !EDITABLE_AFTER_PUBLISH.includes(name)

  function set<K extends keyof Values>(name: K, value: Values[K]) {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
  }

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!values.title.trim()) e.title = 'Upišite naziv.'
    if (!values.field) e.field = 'Odaberite područje umjetnosti.'
    const deadlineChanged = values.deadline !== (original?.deadline ?? '')
    if (deadlineChanged && values.deadline && values.deadline < todayIso()) {
      e.deadline = 'Rok ne može biti u prošlosti.'
    }
    if (original?.deadline && !values.deadline) e.deadline = 'Rok se ne može ukloniti, samo promijeniti.'
    const now = nowDateTimeLocal()
    const startsChanged = values.starts_at !== toDateTimeLocal(original?.starts_at ?? null)
    const endsChanged = values.ends_at !== toDateTimeLocal(original?.ends_at ?? null)
    if (startsChanged && values.starts_at && values.starts_at < now) {
      e.starts_at = 'Početak ne može biti u prošlosti.'
    }
    if (endsChanged && values.ends_at && values.ends_at < now) {
      e.ends_at = 'Završetak ne može biti u prošlosti.'
    } else if (values.starts_at && values.ends_at && values.ends_at < values.starts_at) {
      e.ends_at = 'Završetak ne može biti prije početka.'
    }
    return e
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const clientErrors = validate()
    setErrors(clientErrors)
    setFormError('')
    if (Object.keys(clientErrors).length) return

    setBusy(true)
    let payload = toInput(values)
    let geocodeFailed = false

    const addressChanged = payload.address !== (original?.address ?? '')
    const missingCoordinates = original !== null && original.latitude === null && payload.address !== ''
    if (addressChanged || missingCoordinates) {
      payload.latitude = null
      payload.longitude = null
      if (payload.address) {
        const coords = await geocodeAddress(payload.address)
        if (coords) Object.assign(payload, coords)
        else geocodeFailed = true
      }
    }

    if (original) {
      const before = toInput(toValues(original))
      payload = Object.fromEntries(
        Object.entries(payload).filter(([name, value]) => {
          if (name === 'latitude' || name === 'longitude') return addressChanged || missingCoordinates
          if (published && !EDITABLE_AFTER_PUBLISH.includes(name as keyof OpportunityInput)) return false
          return value !== before[name as keyof OpportunityInput]
        }),
      )
    }

    try {
      let saved: Opportunity
      if (!original) saved = await opportunitiesApi.create(payload)
      else if (Object.keys(payload).length) saved = await opportunitiesApi.update(original.id, payload)
      else saved = original

      const notices = [
        original ? 'Promjene su spremljene.' : 'Prilika je spremljena kao nacrt. Objavite je kad bude spremna.',
      ]
      if (geocodeFailed) notices.push('Adresa nije pronađena na karti, pa se karta neće prikazivati.')
      navigate(`/organizator/prilike/${saved.id}`, { state: { notice: notices.join(' ') } })
    } catch (e) {
      if (e instanceof ApiError) {
        const fieldErrors = { ...e.fieldErrors }
        const coordError = fieldErrors.latitude || fieldErrors.longitude
        if (coordError) fieldErrors.address = coordError
        setErrors(fieldErrors)
        setFormError(e.message)
      } else {
        setFormError('Došlo je do greške.')
      }
      setBusy(false)
    }
  }

  function field(name: keyof Values, label: string, input: ReactNode, hint?: string) {
    return (
      <label>
        {label}
        {input}
        {hint && <span className="org-hint">{hint}</span>}
        {errors[name] && <span className="org-field-error" id={`${name}-error`}>{errors[name]}</span>}
      </label>
    )
  }

  function common(name: keyof Values) {
    return {
      name,
      className: 'ac-input',
      disabled: busy || locked(name),
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    }
  }

  return (
    <>
      <Link to={original ? `/organizator/prilike/${original.id}` : '/organizator/moje'} className="ac-back">
        ← Natrag
      </Link>
      <header className="ac-page-head">
        <h1>{original ? 'Uredi priliku' : 'Nova prilika'}</h1>
        {!original && (
          <p className="ac-muted">Prilika se sprema kao nacrt. Za objavu su potrebni opis i rok za prijavu.</p>
        )}
      </header>

      {published && (
        <p className="ac-note ac-note--warn">
          Prilika je objavljena, pa se mogu mijenjati samo mjesto, rok za prijavu i vrijeme održavanja.
        </p>
      )}

      <form className="ac-form org-form" onSubmit={handleSubmit} noValidate>
        {field('type', 'Vrsta', (
          <select {...common('type')} value={values.type} onChange={(e) => set('type', e.target.value as OpportunityType)}>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        ))}

        {field('title', 'Naziv', (
          <input {...common('title')} value={values.title} maxLength={200} onChange={(e) => set('title', e.target.value)} />
        ))}

        {field('description', 'Opis', (
          <textarea {...common('description')} rows={6} value={values.description} onChange={(e) => set('description', e.target.value)} />
        ))}

        {field('field', 'Područje umjetnosti', (
          <select {...common('field')} value={values.field} onChange={(e) => set('field', e.target.value)}>
            <option value="">Odaberite…</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        ))}

        {field('deadline', 'Rok za prijavu', (
          <input {...common('deadline')} type="date" min={todayIso()} value={values.deadline} onChange={(e) => set('deadline', e.target.value)} />
        ))}

        {field('address', 'Mjesto održavanja (neobavezno)', (
          <input {...common('address')} value={values.address} maxLength={300} placeholder="npr. Ilica 25, Zagreb" onChange={(e) => set('address', e.target.value)} />
        ), mapsAvailable() ? 'Upišite adresu i prikazat će se na karti.' : 'Karta trenutno nije dostupna.')}

        <div className="ac-cols">
          {field('starts_at', 'Početak (neobavezno)', (
            <input {...common('starts_at')} type="datetime-local" min={nowDateTimeLocal()} value={values.starts_at} onChange={(e) => set('starts_at', e.target.value)} />
          ))}
          {field('ends_at', 'Završetak (neobavezno)', (
            <input {...common('ends_at')} type="datetime-local" min={values.starts_at || nowDateTimeLocal()} value={values.ends_at} onChange={(e) => set('ends_at', e.target.value)} />
          ))}
        </div>

        {field('age_criteria', 'Dobni ili drugi kriterij (neobavezno)', (
          <input {...common('age_criteria')} value={values.age_criteria} maxLength={200} placeholder="npr. do 30 godina" onChange={(e) => set('age_criteria', e.target.value)} />
        ))}

        {field('reward', 'Nagrada ili naknada (neobavezno)', (
          <input {...common('reward')} value={values.reward} maxLength={300} onChange={(e) => set('reward', e.target.value)} />
        ))}

        {formError && <p className="ac-note ac-note--bad" role="alert">{formError}</p>}

        <div className="ac-row">
          <button type="submit" className="ac-btn ac-btn--primary" disabled={busy}>
            {busy ? 'Spremam…' : original ? 'Spremi promjene' : 'Spremi nacrt'}
          </button>
          <Link to={original ? `/organizator/prilike/${original.id}` : '/organizator/moje'} className="ac-btn ac-btn--ghost">
            Odustani
          </Link>
        </div>
      </form>
    </>
  )
}