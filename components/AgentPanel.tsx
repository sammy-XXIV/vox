'use client'

import { useEffect, useRef, useState } from 'react'
import type { AgentEvent } from '@/lib/types'

type DisplayEvent = Exclude<AgentEvent, { type: 'patch' }>

export default function AgentPanel({ events }: { events: DisplayEvent[] }) {
  const end = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(true)
  useEffect(() => { end.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }) }, [events])
  return (
    <aside
      aria-label="Agent activity"
      className={`h-full shrink-0 overflow-hidden border-r border-white/5 transition-all duration-200 ${open ? 'w-64' : 'w-10'}`}
      style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center justify-between px-3 py-3">
        {open && <h2 className="text-[10px] font-medium uppercase tracking-widest text-white/30">Agent activity</h2>}
        <button onClick={() => setOpen(!open)} aria-label={open ? 'Collapse agent panel' : 'Expand agent panel'} className="ml-auto flex size-6 items-center justify-center rounded text-white/30 hover:bg-white/8 hover:text-white/60 transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            {open ? <path d="M8 2L4 6l4 4" /> : <path d="M4 2l4 4-4 4" />}
          </svg>
        </button>
      </div>
      {open && <div className="overflow-y-auto px-3 pb-3" style={{ height: 'calc(100% - 40px)' }}>
      <h2 className="sr-only">Agent activity</h2>
      {!events.length && (
        <p className="rounded-lg border border-white/5 bg-white/3 px-3 py-4 text-xs text-white/30">
          Speak a question — activity streams here.
        </p>
      )}
      <div role="log" aria-live="polite" className="space-y-2 break-words text-xs">
        {events.map((event, index) => (
          <div
            key={index}
            className={
              event.type === 'thinking'
                ? 'rounded-lg border border-white/8 bg-white/4 px-2.5 py-2 italic text-white/40'
                : event.type === 'action'
                  ? 'rounded-lg border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-2.5 py-2 font-mono text-[#00d4ff]/80'
                  : event.type === 'error'
                    ? 'rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-red-400'
                    : 'rounded-lg border border-white/8 bg-white/5 px-2.5 py-2 text-white/80'
            }
          >
            {event.type === 'action' ? `▶ ${event.name}(${JSON.stringify(event.args)})` : event.text}
          </div>
        ))}
      </div>
      <div ref={end} />
      </div>}
    </aside>
  )
}
