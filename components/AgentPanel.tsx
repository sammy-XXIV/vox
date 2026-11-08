'use client'

import { useEffect, useRef } from 'react'
import type { AgentEvent } from '@/lib/types'

export default function AgentPanel({ events }: { events: AgentEvent[] }) {
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }) }, [events])
  return <aside aria-label="Agent activity" className="h-full w-72 shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-900 p-3">
    <h2 className="mb-5 px-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Agent activity</h2>
    {!events.length && <p className="px-1 text-sm text-zinc-500">Your conversation with Vox appears here.</p>}
    <div role="log" aria-live="polite" className="space-y-3 break-words text-sm">{events.map((event, index) => <div key={index} className={event.type === 'thinking' ? 'italic text-zinc-400' : event.type === 'action' ? 'whitespace-pre-wrap font-mono text-indigo-400' : event.type === 'error' ? 'text-red-400' : 'whitespace-pre-wrap text-zinc-100'}>{event.type === 'action' ? `▶ ${event.name}(${JSON.stringify(event.args)})` : event.text}</div>)}</div>
    <div ref={end} />
  </aside>
}
