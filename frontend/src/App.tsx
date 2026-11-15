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
import { setUnauthorizedHandler } from './services/api'

type Screen = 'login' | 'register' | 'home'

function Start() {
  const [screen, setScreen] = useState<Screen>('login')
  const [name, setName] = useState('')

  function enter(userName: string) {
    setName(userName)
    setScreen('home')
  }

  return (
    <>
      <ThemeToggle />
      {screen === 'login' && (
        // Privremeno: stvarna Google prijava dolazi s backendom.
        <Login onLogin={() => enter('Ana')} onRegister={() => setScreen('register')} />
      )}
      {screen === 'register' && <Register onDone={enter} onBack={() => setScreen('login')} />}
      {screen === 'home' && <Home name={name} onLogout={() => setScreen('login')} />}
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
        <Route path="/organizator" element={<OrganizerLayout />}>
          <Route index element={<OrganizerHome />} />
          <Route path="moje" element={<MyOpportunities />} />
          <Route path="nova" element={<OpportunityForm />} />
          <Route path="prilike" element={<OpportunityList />} />
          <Route path="prilike/:id" element={<OpportunityDetail />} />
          <Route path="prilike/:id/uredi" element={<OpportunityForm />} />
          <Route path="statistika" element={<OrganizerStats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}