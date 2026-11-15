import { useEffect, useState } from 'react'
import ThemeToggle from './components/ThemeToggle'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { ApiError, setUnauthorizedHandler } from './services/api'
import { getMe, loginWithGoogle, logout, type User } from './services/auth'

export default function App() {
  // undefined = još provjeravamo sesiju, null = nitko nije prijavljen
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [offline, setOffline] = useState(false)

  function loadUser() {
    setOffline(false)
    getMe()
      .then(setUser)
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) setUser(null)
        else setOffline(true)
      })
  }

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
    loadUser()
  }, [])

  async function handleLogout() {
    await logout().catch(() => {})
    setUser(null)
  }

  async function switchAccount() {
    await logout().catch(() => {})
    loginWithGoogle(true)
  }

  let screen
  if (offline) {
    screen = (
      <main className="loading">
        <p>Poslužitelj nije dostupan.</p>
        <button type="button" className="link" onClick={loadUser}>Pokušaj ponovno</button>
      </main>
    )
  } else if (user === undefined) {
    screen = <main className="loading" aria-busy="true" />
  } else if (user === null) {
    screen = <Login />
  } else if (!user.registration_complete) {
    screen = <Register user={user} onDone={setUser} onSwitchAccount={switchAccount} />
  } else {
    screen = <Home user={user} onLogout={handleLogout} />
  }

  return (
    <>
      <ThemeToggle />
      {screen}
    </>
  )
}
