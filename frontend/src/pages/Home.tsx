import Logo from '../components/Logo'
import { greetingName, type User } from '../services/auth'

type Props = {
  user: User
  onLogout: () => void
}

export default function Home({ user, onLogout }: Props) {
  const waitingForApproval = user.organizer_profile?.approved === false

  return (
    <div className="home">
      <header className="home-header">
        <div className="brand">
          <Logo size={32} />
          ArtConnect
        </div>
        <button type="button" className="logout" onClick={onLogout}>Odjava</button>
      </header>
      <main className="home-main">
        <h1>Dobar dan, {greetingName(user)}.</h1>
        {waitingForApproval && <p className="home-note">Vaš račun organizatora čeka odobrenje administratora.</p>}
      </main>
    </div>
  )
}
