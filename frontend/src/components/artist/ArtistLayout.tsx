import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles, FileText, User, Sun, Moon, Home, LogOut } from 'lucide-react';
import Logo from '../Logo'; 
import '../../styles/artist.css'; 
import { logout } from '../../services/auth'; 

// Početna je dodana na kraj liste
const NAV = [
  { to: '/umjetnik', label: 'Pregled', icon: <LayoutDashboard size={20} />, end: true },
  { to: '/umjetnik/prilike', label: 'Prilike', icon: <Sparkles size={20} /> },
  { to: '/umjetnik/prijave', label: 'Moje prijave', icon: <FileText size={20} /> },
  { to: '/umjetnik/profil', label: 'Profil', icon: <User size={20} /> },
  { to: '/', label: 'Početna', icon: <Home size={20} />, end: true },
];

export default function ArtistLayout() {
  const [light, setLight] = useState(document.documentElement.dataset.theme === 'light');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const next = light ? 'dark' : 'light';
    if (next === 'light') document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
    setLight(!light);
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    navigate('/');
  };

  return (
    <div className="ac ac-shell">
      <aside className="ac-side">
        <div className="ac-brand">
          <Logo size={34} /> 
          <span>ArtConnect</span>
        </div>
        
        {/* Svi linkovi su u jednom <nav> bloku */}
        <nav className="ac-nav" aria-label="Glavna navigacija">
          {NAV.map((n) => (
            <NavLink 
              key={n.to} 
              to={n.to} 
              end={n.end} 
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              {n.icon}
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Gumb za temu je odvojen i na dnu */}
        <button className="ac-icon-btn ac-theme" onClick={toggleTheme} aria-label="Promijeni temu">
          {light ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </aside>

      <main className="ac-main">
        <div className="ac-top-bar">
          <button type="button" className="ac-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Odjava
          </button>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
}