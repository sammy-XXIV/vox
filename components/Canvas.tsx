'use client'

import { useCanvasStore } from '@/lib/store'
import ChartTile from './ChartTile'

export default function Canvas() {
  const { state: { charts, annotations, revision } } = useCanvasStore()
  return (
    <section aria-label="Analytics canvas" data-revision={revision} className="min-h-full p-4">
      {charts.length ? (
        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
          {charts.map((tile) => (
            <ChartTile key={tile.id} tile={tile} annotations={annotations.filter((a) => a.chartId === tile.id)} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" aria-hidden="true">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">Ask Vox to visualize your data</p>
          <p className="text-xs text-slate-600">Try: "Show a bar chart of revenue by month"</p>
        </div>
      )}
    </section>
  )
}
