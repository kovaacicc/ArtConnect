import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../pages/artist/artist.css';

const NAV = [
  { to: '/umjetnik', label: 'Pregled', end: true },
  { to: '/umjetnik/prilike', label: 'Prilike' },
  { to: '/umjetnik/portfolio', label: 'Portfolio' },
  { to: '/umjetnik/prijave', label: 'Moje prijave' },
  { to: '/umjetnik/profil', label: 'Profil' },
];

export function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 56 28 10c2-4 8-3 8 2" fill="none" stroke="var(--ac-blue)" strokeWidth="11" strokeLinecap="round" />
      <path d="M30 12c3-5 9-3 10 1l16 43" fill="none" stroke="var(--ac-orange)" strokeWidth="11" strokeLinecap="round" />
      <circle cx="22" cy="46" r="6" fill="var(--ac-text)" />
    </svg>
  );
}

export default function ArtistLayout() {
  const [light, setLight] = useState(document.documentElement.dataset.theme === 'light');

  const toggleTheme = () => {
    const next = light ? 'dark' : 'light';
    // Isti mehanizam kao u index.html: samo 'light' se postavlja kao data-theme.
    if (next === 'light') document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
    setLight(!light);
  };

  return (
    <div className="ac ac-shell">
      <aside className="ac-side">
        <div className="ac-brand"><Logo /><span>ArtConnect</span></div>
        <nav className="ac-nav" aria-label="Glavna navigacija">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button className="ac-icon-btn ac-theme" onClick={toggleTheme} aria-label="Promijeni temu">
          {light ? '☾' : '☀'}
        </button>
      </aside>
      <main className="ac-main"><Outlet /></main>
    </div>
  );
}
