import { useState } from 'react'
import ThemeToggle from './components/ThemeToggle'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

type Screen = 'login' | 'register' | 'home'

export default function App() {
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
