'use client'

import { useRef, useState } from 'react'
import { useCanvasStore } from '@/lib/store'
import ChartTile from './ChartTile'

const MIN_ZOOM = 0.3
const MAX_ZOOM = 2
const STEP = 0.1
const GRID = 40

export default function Canvas() {
  const { state: { charts, annotations, revision } } = useCanvasStore()
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  function clamp(v: number) { return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(v * 10) / 10)) }

  function onWheel(e: React.WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    setZoom((z) => clamp(z - e.deltaY * 0.001))
  }

  const gridSize = GRID * zoom
  const pct = Math.round(zoom * 100)

  return (
    <section
      aria-label="Analytics canvas"
      data-revision={revision}
      ref={containerRef}
      onWheel={onWheel}
      className="relative min-h-full overflow-hidden"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    >
      {/* Zoom controls */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-lg border border-white/8 bg-black/60 px-2 py-1 text-xs text-white/40 backdrop-blur">
        <button onClick={() => setZoom((z) => clamp(z - STEP))} className="px-1 hover:text-white/80 transition-colors" aria-label="Zoom out">−</button>
        <span className="w-9 text-center tabular-nums">{pct}%</span>
        <button onClick={() => setZoom((z) => clamp(z + STEP))} className="px-1 hover:text-white/80 transition-colors" aria-label="Zoom in">+</button>
        <button onClick={() => setZoom(1)} className="ml-1 px-1 hover:text-white/80 transition-colors" aria-label="Reset zoom">↺</button>
      </div>

      {/* Scaled content */}
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: `${100 / zoom}%` }}
        className="p-4"
      >
        {charts.length ? (
          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
            {charts.map((tile) => (
              <ChartTile key={tile.id} tile={tile} annotations={annotations.filter((a) => a.chartId === tile.id)} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[#00d4ff]/20 bg-[#00d4ff]/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5" aria-hidden="true">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
              </svg>
            </div>
            <p className="text-sm text-white/40">Ask Vox to visualize your data</p>
            <p className="text-xs text-white/20">Try: "Show a bar chart of revenue by month"</p>
          </div>
        )}
      </div>
    </section>
  )
}
