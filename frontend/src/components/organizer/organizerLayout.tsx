import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ChartColumn, CirclePlus, FolderOpen, House, LayoutDashboard,  Moon, Sparkles, Sun } from 'lucide-react'
import Logo from '../Logo'
import { logout } from '../../services/auth'
import '../../styles/artist.css'
import '../../opportunities.css'

const NAV = [
  { to: '/organizator', label: 'Pregled', icon: <LayoutDashboard size={20} />, end: true },
  { to: '/organizator/moje', label: 'Moje prilike', icon: <FolderOpen size={20} /> },
  { to: '/organizator/nova', label: 'Nova prilika', icon: <CirclePlus size={20} /> },
  { to: '/organizator/prilike', label: 'Sve prilike', icon: <Sparkles size={20} /> },
  { to: '/organizator/statistika', label: 'Statistika', icon: <ChartColumn size={20} /> },
]

export default function OrganizerLayout() {
  const [light, setLight] = useState(document.documentElement.dataset.theme === 'light')

  const navigate = useNavigate()

  async function handleLogout() {
    await logout().catch(() => {})
    navigate('/', { replace: true })
  }

  function toggleTheme() {
    const next = light ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // tema se tada samo ne pamti
    }
    setLight(!light)
  }

  return (
    <div className="ac ac-shell">
      <aside className="ac-side">
        <div className="ac-brand">
          <Logo size={34} />
          <span>ArtConnect</span>
        </div>

        <nav className="ac-nav" aria-label="Glavna navigacija">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {n.icon}
              <span>{n.label}</span>
            </NavLink>
      
          ))}
            <NavLink to="/" end>
              <House size={20} />
              <span>Početna</span>
          </NavLink>
        </nav>

        <button className="ac-icon-btn ac-theme" onClick={toggleTheme} aria-label="Promijeni temu">
          {light ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </aside>
        <main className="ac-main">
        <div className="ac-topbar">
          <button type="button" className="logout" onClick={handleLogout}>Odjava</button>
        </div>
        <Outlet />
      </main>
    </div>
  )
}