const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

export type Coordinates = { latitude: string; longitude: string }

type LatLng = { lat: () => number; lng: () => number }
type GeocoderResult = { geometry: { location: LatLng } }
type MapsNamespace = {
  importLibrary: (name: string) => Promise<any> //eslint-disable-line @typescript-eslint/no-explicit-any
}

declare global {
  interface Window {
    google?: { maps: MapsNamespace }
    __artconnectMapsReady?: () => void
  }
}

let loading: Promise<MapsNamespace> | null = null

export function mapsAvailable(): boolean {
  return Boolean(API_KEY)
}

function loadMaps(): Promise<MapsNamespace> {
  if (!API_KEY) return Promise.reject(new Error('Nedostaje VITE_GOOGLE_MAPS_API_KEY'))
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  if (loading) return loading

  loading = new Promise((resolve, reject) => {
    window.__artconnectMapsReady = () => resolve(window.google!.maps)
    const script = document.createElement('script')
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}` +
      '&v=weekly&loading=async&language=hr&region=HR&callback=__artconnectMapsReady'
    script.async = true
    script.onerror = () => {
      loading = null
      reject(new Error('Google Maps se nije učitao'))
    }
    document.head.appendChild(script)
  })
  return loading
}

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const maps = await loadMaps()
    const { Geocoder } = await maps.importLibrary('geocoding')
    const { results } = (await new Geocoder().geocode({ address })) as { results: GeocoderResult[] }
    if (!results.length) return null
    const location = results[0].geometry.location
    return { latitude: location.lat().toFixed(6), longitude: location.lng().toFixed(6) }
  } catch {
    return null
  }
}

export async function drawMap(element: HTMLElement, latitude: number, longitude: number, title: string) {
  const maps = await loadMaps()
  const { Map } = await maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await maps.importLibrary('marker')
  const position = { lat: latitude, lng: longitude }
  const map = new Map(element, {
    center: position,
    zoom: 15,
    mapId: 'DEMO_MAP_ID',
    streetViewControl: false,
    mapTypeControl: false,
  })
  new AdvancedMarkerElement({ map, position, title })
}