import { useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'dark' | 'light'

function savedTheme(): Theme {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(savedTheme)
  const isDark = theme === 'dark'
  const label = isDark ? 'Uključi svijetli način' : 'Uključi tamni način'

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next: Theme = isDark ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {
        // Tema se tada jednostavno ne pamti.
      }
      flushSync(() => setTheme(next))
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduceMotion) return apply()

    // Nova tema se širi iz gumba u krug dok ne prekrije cijeli ekran.
    const button = event.currentTarget.getBoundingClientRect()
    const x = button.left + button.width / 2
    const y = button.top + button.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const transition = document.startViewTransition(apply)
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }

  return (
    <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={toggle}>
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  )
}
