'use client'

import { useCanvasStore } from '@/lib/store'
import ChartTile from './ChartTile'

export default function Canvas() {
  const { state: { charts, annotations, revision } } = useCanvasStore()
  return <section aria-label="Analytics canvas" data-revision={revision} className="min-h-full bg-zinc-950 p-4">
    {charts.length ? <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">{charts.map((tile) => <ChartTile key={tile.id} tile={tile} annotations={annotations.filter((annotation) => annotation.chartId === tile.id)} />)}</div> : <div className="flex min-h-[60vh] items-center justify-center text-center text-zinc-500">Ask Vox to visualize your data</div>}
  </section>
}
