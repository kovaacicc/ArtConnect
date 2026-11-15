import { useEffect, useState, type FormEvent } from 'react'
import Logo from '../components/Logo'
import { ApiError, type FieldErrors } from '../services/api'
import { getArtFields, register, type ArtField, type User } from '../services/auth'

type Props = {
  user: User
  onDone: (user: User) => void
  onSwitchAccount: () => void
}

type Role = 'artist' | 'organizer'

const ROLES: { id: Role; title: string; text: string }[] = [
  { id: 'artist', title: 'Umjetnik', text: 'Gradim portfolio i prijavljujem se na prilike.' },
  { id: 'organizer', title: 'Organizator', text: 'Objavljujem prilike i biram među prijavama.' },
]

function FieldError({ text }: { text?: string }) {
  return text ? <span className="field-error">{text}</span> : null
}

export default function Register({ user, onDone, onSwitchAccount }: Props) {
  const [role, setRole] = useState<Role>('artist')
  const [artFields, setArtFields] = useState<ArtField[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getArtFields().then(setArtFields).catch(() => setError('Područja djelovanja se nisu učitala. Osvježite stranicu.'))
  }, [])

  // Google daje puno ime, a backend traži ime i prezime posebno.
  const [firstName, ...rest] = user.display_name.split(' ')
  const lastName = rest.join(' ')
  const initials = user.display_name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const canFinish = !sending && (role === 'organizer' || selected.length > 0)

  function toggleField(id: number) {
    setSelected(selected.includes(id) ? selected.filter((f) => f !== id) : [...selected, id])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const text = (name: string) => String(form.get(name) ?? '').trim()

    setSending(true)
    setError('')
    setFieldErrors({})
    try {
      const saved =
        role === 'artist'
          ? await register({
              role,
              first_name: text('firstName'),
              last_name: text('lastName'),
              art_fields: selected,
              website_url: text('website'),
              social_url: text('social'),
            })
          : await register({
              role,
              name: text('organizationName'),
              organization_type: text('organizationType'),
              description: text('description'),
            })
      onDone(saved)
    } catch (e) {
      if (e instanceof ApiError) {
        setFieldErrors(e.fieldErrors)
        setError(e.message)
      } else {
        setError('Došlo je do greške. Pokušajte ponovno.')
      }
      setSending(false)
    }
  }

  return (
    <main className="register">
      <div className="brand">
        <Logo size={30} />
        ArtConnect
      </div>

      <h1 className="register-title">Registriraj se</h1>
      <p className="register-intro">Google je potvrdio vaš identitet. Trebamo još nekoliko osnovnih podataka.</p>

      <div className="google-account">
        <span className="initials" aria-hidden="true">{initials}</span>
        <span className="google-account-text">
          <small>Google račun</small>
          {user.email}
        </span>
        <button type="button" className="link" onClick={onSwitchAccount}>Promijeni</button>
      </div>

      <form onSubmit={handleSubmit}>
        <p className="label" id="role-label">Registriram se kao</p>
        <div className="roles" role="group" aria-labelledby="role-label">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className="role"
              aria-pressed={role === r.id}
              onClick={() => setRole(r.id)}
            >
              <strong>{r.title}</strong>
              <span>{r.text}</span>
            </button>
          ))}
        </div>

        {role === 'artist' ? (
          <>
            <div className="name-row">
              <label className="field">
                Ime
                <input name="firstName" required defaultValue={firstName} />
                <FieldError text={fieldErrors.first_name} />
              </label>
              <label className="field">
                Prezime
                <input name="lastName" required defaultValue={lastName} />
                <FieldError text={fieldErrors.last_name} />
              </label>
            </div>

            <p className="label" id="fields-label">Područje djelovanja</p>
            <div className="chips" role="group" aria-labelledby="fields-label">
              {artFields.map((field) => (
                <button
                  key={field.id}
                  type="button"
                  className="field-chip"
                  aria-pressed={selected.includes(field.id)}
                  onClick={() => toggleField(field.id)}
                >
                  {field.name}
                </button>
              ))}
            </div>
            <FieldError text={fieldErrors.art_fields} />

            <label className="field">
              <span>Web-stranica <em>(neobavezno)</em></span>
              <input name="website" type="url" placeholder="https://" />
              <FieldError text={fieldErrors.website_url} />
            </label>
            <label className="field">
              <span>Društvena mreža <em>(neobavezno)</em></span>
              <input name="social" type="url" placeholder="https://" />
              <FieldError text={fieldErrors.social_url} />
            </label>
          </>
        ) : (
          <>
            <label className="field">
              Naziv organizatora
              <input name="organizationName" required placeholder="Naziv galerije, udruge ili ustanove" />
              <FieldError text={fieldErrors.name} />
            </label>
            <label className="field">
              Vrsta organizacije
              <select name="organizationType">
                <option>Galerija</option>
                <option>Udruga</option>
                <option>Ustanova u kulturi</option>
                <option>Drugo</option>
              </select>
            </label>
            <label className="field">
              <span>Kratak opis <em>(neobavezno)</em></span>
              <textarea name="description" rows={4} />
            </label>
          </>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary register-submit" disabled={!canFinish}>
          {sending ? 'Spremanje…' : 'Završi registraciju'}
        </button>
      </form>
    </main>
  )
}
