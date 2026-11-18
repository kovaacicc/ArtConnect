import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Sparkles, FileText, User, Sun, Moon, Home } from 'lucide-react';
import Logo from '../Logo'; // Mentorica kaže da je ovdje putanja do Loga
import '../../styles/artist.css'; 

const NAV = [
  { to: '/', label: 'Početna', icon: <Home size={22} />, end: true }, // Dodan gumb Početna
  { to: '/umjetnik', label: 'Pregled', icon: <LayoutDashboard size={22} />, end: true },
  { to: '/umjetnik/prilike', label: 'Prilike', icon: <Sparkles size={22} /> },
  { to: '/umjetnik/prijave', label: 'Moje prijave', icon: <FileText size={22} /> },
  { to: '/umjetnik/profil', label: 'Profil', icon: <User size={22} /> },
];

export default function ArtistLayout() {
  const [light, setLight] = useState(document.documentElement.dataset.theme === 'light');

  const toggleTheme = () => {
    const next = light ? 'dark' : 'light';
    if (next === 'light') document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
    setLight(!light);
  };

  return (
    <div className="ac ac-shell">
      <aside className="ac-side">
        <div className="ac-brand">
          <Logo size={34} /> {/* Ovdje koristimo njihov Logo */}
        </div>
        
        <nav className="ac-nav" aria-label="Glavna navigacija">
          {NAV.map((n) => (
            <NavLink 
              key={n.to} 
              to={n.to} 
              end={n.end} 
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              title={n.label}
              aria-label={n.label}
            >
              {n.icon}
            </NavLink>
          ))}
        </nav>
        
        <button className="ac-icon-btn ac-theme" onClick={toggleTheme} aria-label="Promijeni temu" title="Promijeni temu">
          {light ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </aside>
      <main className="ac-main"><Outlet /></main>
    </div>
  );
}