import { useState, type FormEvent } from 'react'
import Logo from '../components/Logo'

type Props = {
  onDone: (name: string) => void
  onBack: () => void
}

type Role = 'artist' | 'organizer'

const ROLES: { id: Role; title: string; text: string }[] = [
  { id: 'artist', title: 'Umjetnik', text: 'Gradim portfolio i prijavljujem se na prilike.' },
  { id: 'organizer', title: 'Organizator', text: 'Objavljujem prilike i biram među prijavama.' },
]

const FIELDS = ['Slikarstvo', 'Fotografija', 'Kiparstvo', 'Digitalna umjetnost', 'Glazba']

// Privremeno: ove podatke će poslati Google kad backend bude spojen.
const GOOGLE_ACCOUNT = { email: 'ana.horvat@gmail.com', firstName: 'Ana', lastName: 'Horvat', initials: 'AH' }

export default function Register({ onDone, onBack }: Props) {
  const [role, setRole] = useState<Role>('artist')
  const [fields, setFields] = useState<string[]>([])
  const canFinish = role === 'organizer' || fields.length > 0

  function toggleField(field: string) {
    setFields(fields.includes(field) ? fields.filter((f) => f !== field) : [...fields, field])
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onDone(String(role === 'artist' ? form.get('firstName') : form.get('organizationName')))
  }

  return (
    <main className="register">
      <button type="button" className="brand" aria-label="Natrag na prijavu" onClick={onBack}>
        <Logo size={30} />
        ArtConnect
      </button>

      <h1 className="register-title">Registriraj se</h1>
      <p className="register-intro">Google je potvrdio vaš identitet. Trebamo još nekoliko osnovnih podataka.</p>

      <div className="google-account">
        <span className="initials" aria-hidden="true">{GOOGLE_ACCOUNT.initials}</span>
        <span className="google-account-text">
          <small>Google račun</small>
          {GOOGLE_ACCOUNT.email}
        </span>
        <button type="button" className="link" onClick={onBack}>Promijeni</button>
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
                <input name="firstName" required defaultValue={GOOGLE_ACCOUNT.firstName} />
              </label>
              <label className="field">
                Prezime
                <input name="lastName" required defaultValue={GOOGLE_ACCOUNT.lastName} />
              </label>
            </div>

            <p className="label" id="fields-label">Područje djelovanja</p>
            <div className="chips" role="group" aria-labelledby="fields-label">
              {FIELDS.map((field) => (
                <button
                  key={field}
                  type="button"
                  className="field-chip"
                  aria-pressed={fields.includes(field)}
                  onClick={() => toggleField(field)}
                >
                  {field}
                </button>
              ))}
            </div>

            <label className="field">
              <span>Web-stranica <em>(neobavezno)</em></span>
              <input name="website" type="url" placeholder="https://" />
            </label>
            <label className="field">
              <span>Društvena mreža <em>(neobavezno)</em></span>
              <input name="social" type="url" placeholder="https://" />
            </label>
          </>
        ) : (
          <>
            <label className="field">
              Naziv organizatora
              <input name="organizationName" required placeholder="Naziv galerije, udruge ili ustanove" />
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

        <button type="submit" className="btn btn-primary register-submit" disabled={!canFinish}>
          Završi registraciju
        </button>
      </form>

      <p className="register-login">
        Već imate račun? <button type="button" className="link" onClick={onBack}>Prijavite se</button>
      </p>
    </main>
  )
}
