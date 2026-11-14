import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ChartColumn, CirclePlus, FolderOpen, Moon, Sparkles, Sun } from 'lucide-react'
import Logo from '../Logo'
import '../../pages/artist/artist.css'
import '../../opportunities.css'

const NAV = [
  { to: '/organizator', label: 'Moje prilike', icon: <FolderOpen size={20} />, end: true },
  { to: '/organizator/nova', label: 'Nova prilika', icon: <CirclePlus size={20} /> },
  { to: '/organizator/prilike', label: 'Sve prilike', icon: <Sparkles size={20} /> },
  { to: '/organizator/statistika', label: 'Statistika', icon: <ChartColumn size={20} /> },
]

export default function OrganizerLayout() {
  const [light, setLight] = useState(document.documentElement.dataset.theme === 'light')

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
        </nav>

        <button className="ac-icon-btn ac-theme" onClick={toggleTheme} aria-label="Promijeni temu">
          {light ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </aside>
      <main className="ac-main">
        <Outlet />
      </main>
    </div>
  )
}