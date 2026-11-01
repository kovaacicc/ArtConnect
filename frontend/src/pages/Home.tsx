import Logo from '../components/Logo'

type Props = {
  name: string
  onLogout: () => void
}

export default function Home({ name, onLogout }: Props) {
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
        <h1>Dobar dan, {name}.</h1>
      </main>
    </div>
  )
}
