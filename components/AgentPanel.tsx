'use client'

import { useEffect, useRef } from 'react'
import type { AgentEvent } from '@/lib/types'

export default function AgentPanel({ events }: { events: AgentEvent[] }) {
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }) }, [events])
  return (
    <aside
      aria-label="Agent activity"
      className="h-full w-64 shrink-0 overflow-y-auto border-r border-white/5 p-3"
      style={{ background: 'rgba(9,13,26,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <h2 className="mb-4 px-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">Agent activity</h2>
      {!events.length && (
        <p className="rounded-lg border border-white/5 bg-white/3 px-3 py-4 text-xs text-slate-500">
          Speak a question — activity streams here.
        </p>
      )}
      <div role="log" aria-live="polite" className="space-y-2 break-words text-xs">
        {events.map((event, index) => (
          <div
            key={index}
            className={
              event.type === 'thinking'
                ? 'rounded-lg border border-slate-700/40 bg-slate-800/40 px-2.5 py-2 italic text-slate-400'
                : event.type === 'action'
                  ? 'rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-2 font-mono text-indigo-400'
                  : event.type === 'error'
                    ? 'rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-red-400'
                    : 'rounded-lg border border-violet-500/15 bg-violet-500/8 px-2.5 py-2 text-slate-200'
            }
          >
            {event.type === 'action' ? `▶ ${event.name}(${JSON.stringify(event.args)})` : event.text}
          </div>
        ))}
      </div>
      <div ref={end} />
    </aside>
  )
}
