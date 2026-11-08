'use client'

import { useEffect, useState } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import type { Row, ColumnDef } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

export default function ChoroplethMap({ data, schema }: { data: Row[]; schema: ColumnDef[] }) {
  const [countries, setCountries] = useState<FeatureCollection | null>(null)
  const [error, setError] = useState('')
  const name = schema.find((column) => column.type === 'string')
  const numeric = schema.find((column) => column.type === 'number')
  useEffect(() => {
    const controller = new AbortController()
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson', { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error('Could not load country boundaries.'); return response.json() })
      .then((json: FeatureCollection) => { if (json.type !== 'FeatureCollection' || !Array.isArray(json.features)) throw new Error('Invalid country boundaries.'); setCountries(json) })
      .catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Could not load map.') })
    return () => controller.abort()
  }, [])
  if (!name || !numeric) return <p className="p-4 text-sm text-zinc-500">A map needs ISO country codes and a numeric column.</p>
  if (error) return <p role="alert" className="p-4 text-sm text-red-400">{error}</p>
  if (!countries) return <p role="status" className="p-4 text-sm text-zinc-400">Loading country boundaries…</p>
  const values = new Map<string, number>()
  for (const row of data) {
    const value = row[numeric.name]
    if (typeof value === 'number' && Number.isFinite(value)) values.set(String(row[name.name] ?? '').trim().toUpperCase(), value)
  }
  const numbers = [...values.values()]
  const min = numbers.length ? Math.min(...numbers) : 0
  const max = numbers.length ? Math.max(...numbers) : 0
  const color = (value: number | undefined) => {
    if (value === undefined) return '#27272a'
    const fraction = max === min ? 0.5 : (value - min) / (max - min)
    return `rgb(${[224, 231, 255].map((low, index) => Math.round(low + ([55, 48, 163][index] - low) * fraction)).join(',')})`
  }
  return <MapContainer center={[20, 0]} zoom={1} minZoom={1} scrollWheelZoom={false} className="isolate h-full w-full bg-zinc-950" attributionControl={true}>
    <GeoJSON key={JSON.stringify([...values])} data={countries} attribution="Natural Earth" style={(feature) => ({ fillColor: color(values.get(String(feature?.properties?.ISO_A2 ?? '').toUpperCase())), fillOpacity: 0.85, color: '#52525b', weight: 0.7 })} onEachFeature={(feature, layer) => {
      const code = String(feature.properties?.ISO_A2 ?? '').toUpperCase()
      const tooltip = document.createElement('span')
      tooltip.textContent = `${feature.properties?.NAME ?? code}: ${values.get(code) ?? 'No data'}`
      layer.bindTooltip(tooltip)
    }} />
  </MapContainer>
}
