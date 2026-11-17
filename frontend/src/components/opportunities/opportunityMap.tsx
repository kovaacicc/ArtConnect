import { useEffect, useRef, useState } from 'react'
import { drawMap, mapsAvailable } from '../../services/googleMaps'

type Props = { latitude: string | null; longitude: string | null; title: string }

export default function OpportunityMap({ latitude, longitude, title }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const hasCoordinates = latitude !== null && longitude !== null

  useEffect(() => {
    if (!hasCoordinates || !ref.current || !mapsAvailable()) return
    drawMap(ref.current, Number(latitude), Number(longitude), title).catch(() => setFailed(true))
  }, [hasCoordinates, latitude, longitude, title])

  if (!hasCoordinates) return null
  if (!mapsAvailable() || failed) return <p className="ac-muted">Karta trenutno nije dostupna.</p>

  return <div ref={ref} className="ac-map" role="region" aria-label="Karta s lokacijom" />
}