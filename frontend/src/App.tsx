import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import ThemeToggle from './components/ThemeToggle'
import OrganizerLayout from './components/organizer/organizerLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MyOpportunities from './pages/opportunities/myOpportunities'
import OpportunityDetail from './pages/opportunities/opportunityDetails'
import OpportunityForm from './pages/opportunities/opportunityForm'
import OpportunityList from './pages/opportunities/opportunityList'
import OrganizerHome from './pages/organizer/organizerHome'
import OrganizerStats from './pages/organizer/organizerStats'
import { ApiError, setUnauthorizedHandler } from './services/api'
import { getMe, loginWithGoogle, logout, type User } from './services/auth'

import ArtistLayout from './components/artist/ArtistLayout';
import ArtistDashboard from './pages/artist/ArtistDashboard';
import Opportunities from './pages/artist/Opportunities';
import ArtistOpportunityDetail from './pages/artist/OpportunityDetail';
import Applications from './pages/artist/Applications';
import ArtistProfile from './pages/artist/ArtistProfile';


function Start() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [offline, setOffline] = useState(false)
  const [offlineMsg, setOfflineMsg] = useState('')

  function loadUser() {
    setOffline(false)
    getMe()
      .then(setUser)
      .catch((error) => {
        console.error('getMe nije uspio:', error)
        if (error instanceof ApiError && error.status === 401) setUser(null)
        else {
          setOfflineMsg(error instanceof ApiError ? `${error.status}: ${error.message}` : String(error))
          setOffline(true)
        }
      })
  }

  useEffect(() => {
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
        <p style={{ opacity: 0.7, fontSize: 14 }}>{offlineMsg}</p>
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


function UnauthorizedRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    setUnauthorizedHandler(() => navigate('/', { replace: true }))
  }, [navigate])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <UnauthorizedRedirect />
      <Routes>
        <Route path="/" element={<Start />} />
        
        {}
        <Route path="/organizator" element={<OrganizerLayout />}>
          <Route index element={<OrganizerHome />} />
          <Route path="moje" element={<MyOpportunities />} />
          <Route path="nova" element={<OpportunityForm />} />
          <Route path="prilike" element={<OpportunityList />} />
          <Route path="prilike/:id" element={<OpportunityDetail />} />
          <Route path="prilike/:id/uredi" element={<OpportunityForm />} />
          <Route path="statistika" element={<OrganizerStats />} />
        </Route>

        {}
        <Route path="/umjetnik" element={<ArtistLayout />}>
          <Route index element={<ArtistDashboard />} />
          <Route path="prilike" element={<Opportunities />} />
          <Route path="prilike/:id" element={<ArtistOpportunityDetail />} />
          <Route path="prijave" element={<Applications />} />
          <Route path="profil" element={<ArtistProfile />} />
        </Route>
        {}
        
      </Routes>
    </BrowserRouter>
  )
}