// Apstraktni oblici stoje na mjestu pravih radova umjetnika.
export default function ArtCollage() {
  return (
    <div className="collage" aria-hidden="true">
      <div className="card card-left">
        <svg viewBox="0 0 190 320" preserveAspectRatio="xMidYMid slice">
          <rect width="190" height="320" fill="#FF5A36" />
          <rect x="26" y="40" width="60" height="240" fill="#F5F5F5" />
          <rect x="104" y="120" width="60" height="160" fill="#111" />
        </svg>
      </div>
      <div className="card card-right">
        <svg viewBox="0 0 180 300" preserveAspectRatio="xMidYMid slice">
          <rect width="180" height="300" fill="#DCDCD8" />
          <circle cx="74" cy="104" r="56" fill="#2F4BFF" />
          <circle cx="112" cy="190" r="56" fill="#2F4BFF" fillOpacity="0.45" />
        </svg>
      </div>
      <div className="card card-center">
        <svg viewBox="0 0 250 450" preserveAspectRatio="xMidYMid slice">
          <rect width="250" height="450" fill="#2F4BFF" />
          <circle cx="150" cy="150" r="88" fill="#F5F5F5" />
          <rect y="260" width="130" height="190" fill="#111" />
          <path d="M130 280 A150 150 0 0 1 250 420 L250 450 L130 450 Z" fill="#FF5A36" />
        </svg>
        <div className="card-caption">
          Skupna izložba
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 10h14M11 4l6 6-6 6" />
          </svg>
        </div>
      </div>
      <div className="chip chip-field">Slikarstvo</div>
      <div className="chip chip-status">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8.5l3.2 3.2L13 5" />
        </svg>
        Prihvaćena
      </div>
      <div className="avatar-ring">
        <svg viewBox="0 0 64 64">
          <rect width="64" height="64" fill="#111" />
          <circle cx="32" cy="32" r="18" fill="#F5F5F5" />
          <rect x="32" y="32" width="18" height="18" fill="#FF5A36" />
        </svg>
      </div>
    </div>
  )
}
