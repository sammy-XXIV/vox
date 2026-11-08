'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Annotation, ChartTile as ChartTileType, ColumnDef } from '@/lib/types'
import { useCanvasStore } from '@/lib/store'
import { removeChartAction } from '@/actions/remove-chart'
import { annotatePointAction } from '@/actions/annotate-point'
import BarChart from './charts/BarChart'
import LineChart from './charts/LineChart'
import ScatterChart from './charts/ScatterChart'
import PieChart from './charts/PieChart'

const ChoroplethMap = dynamic(() => import('./charts/ChoroplethMap'), { ssr: false, loading: () => <p className="p-4 text-zinc-400">Loading map…</p> })
const chartComponents = { bar: BarChart, line: LineChart, scatter: ScatterChart, pie: PieChart, choropleth: ChoroplethMap }

export default function ChartTile({ tile, annotations }: { tile: ChartTileType; annotations: Annotation[] }) {
  const { state } = useCanvasStore()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const source = state.dataSources.find((item) => item.id === tile.sourceId)
  // SQL results can include aliases and aggregates absent from the source schema.
  const schema: ColumnDef[] = tile.data.length ? Object.keys(tile.data[0]).map((name) => ({ name, type: source?.schema.find((column) => column.name === name)?.type ?? (tile.data.some((row) => typeof row[name] === 'number') ? 'number' : 'string') })) : source?.schema ?? []
  const Chart = chartComponents[tile.chartType]
  async function annotate(pointKey: string) {
    const text = window.prompt('Annotation text')
    if (!text?.trim()) return
    setError('')
    try {
      const result = await annotatePointAction.run({ chartId: tile.id, pointKey, text: text.trim(), revision: useCanvasStore.getState().state.revision })
      if ('error' in result) setError(result.error)
    } catch { setError('Could not save annotation.') }
  }
  return <article className="min-w-0 overflow-hidden rounded-xl border border-white/8" style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)' }}>
    <header className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
      <h2 className="truncate text-sm font-medium text-white/80">{tile.title || tile.chartType}</h2>
      <div className="flex items-center gap-3"><button type="button" onClick={() => void annotate('50:50')} className="text-xs text-white/30 hover:text-[#00d4ff] transition-colors">Annotate</button><button type="button" aria-label={`Remove ${tile.title || tile.chartType}`} disabled={busy} className="rounded px-2 text-slate-500 hover:bg-white/5 hover:text-red-400 transition-colors disabled:opacity-40" onClick={async () => {
        setBusy(true); setError('')
        try { const result = await removeChartAction.run({ chartId: tile.id, revision: useCanvasStore.getState().state.revision }); if ('error' in result) setError(result.error) } catch { setError('Could not remove chart.') } finally { setBusy(false) }
      }}>×</button></div>
    </header>
    <div className="relative h-72 min-w-0" onClick={(event) => {
      if (event.target instanceof Element && event.target.closest('.leaflet-control')) return
      const rect = event.currentTarget.getBoundingClientRect()
      void annotate(`${((event.clientX - rect.left) / rect.width * 100).toFixed(2)}:${((event.clientY - rect.top) / rect.height * 100).toFixed(2)}`)
    }}>
      {tile.data.length ? <Chart data={tile.data} schema={schema} /> : <p className="flex h-full items-center justify-center text-sm text-zinc-500">No data to display</p>}
      {annotations.filter((annotation) => annotation.chartId === tile.id).map((annotation, index) => {
        const coordinates = annotation.pointKey.split(':').map(Number)
        const positioned = coordinates.length === 2 && coordinates.every((value) => Number.isFinite(value) && value >= 0 && value <= 100)
        return <button type="button" key={annotation.id} title={annotation.text} aria-label={`Annotation: ${annotation.text}`} onClick={(event) => { event.stopPropagation(); window.alert(annotation.text) }} style={{ left: `${positioned ? coordinates[0] : 8 + index % 10 * 8}%`, top: `${positioned ? coordinates[1] : 12}%` }} className="absolute z-[500] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#00d4ff] shadow focus-visible:outline-2 focus-visible:outline-[#00d4ff]" />
      })}
    </div>
    {error && <p role="alert" className="px-4 pb-3 text-sm text-red-400">{error}</p>}
  </article>
}
