'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AgentPanel from '@/components/AgentPanel'
import Canvas from '@/components/Canvas'
import DataSourcePanel from '@/components/DataSourcePanel'
import VoiceInput from '@/components/VoiceInput'
import { useCanvasStore } from '@/lib/store'
import type { AgentEvent } from '@/lib/types'
import Link from 'next/link'

function parseEvent(line: string): AgentEvent | null {
  const value = line.trim()
  if (!value || value.startsWith(':') || /^(event|id|retry):/.test(value)) return null
  const payload = value.startsWith('data:') ? value.slice(5).trim() : value
  if (!payload || payload === '[DONE]') return null
  const event: unknown = JSON.parse(payload)
  if (typeof event !== 'object' || event === null || !('type' in event)) throw new Error('Invalid agent event.')
  if (event.type === 'patch' && 'patch' in event) return { type: 'patch', patch: event.patch as never }
  if (event.type === 'action' && 'name' in event && typeof event.name === 'string' && 'args' in event) return { type: 'action', name: event.name, args: event.args }
  if (['thinking', 'result', 'error'].includes(String(event.type)) && 'text' in event && typeof event.text === 'string') return { type: event.type as 'thinking' | 'result' | 'error', text: event.text }
  throw new Error('Invalid agent event.')
}

export default function CanvasPage() {
  const { state: canvasState } = useCanvasStore()
  const [events, setEvents] = useState<Exclude<AgentEvent, { type: 'patch' }>[]>([])
  const [busy, setBusy] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)
  useEffect(() => () => activeRequest.current?.abort(), [])

  const { apply } = useCanvasStore()
  const submit = useCallback(async (message: string) => {
    if (!message.trim() || activeRequest.current) return
    const controller = new AbortController()
    activeRequest.current = controller
    setBusy(true)
    try {
      const response = await fetch('/api/agent', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, body: JSON.stringify({ message: message.trim(), state: canvasState }), signal: controller.signal })
      if (!response.ok) throw new Error(`Agent request failed (${response.status}).`)
      if (!response.body) throw new Error('Agent response did not contain a stream.')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      const append = (line: string) => {
        const event = parseEvent(line)
        if (!event) return
        if (event.type === 'patch') {
          apply(event.patch)
        } else {
          setEvents((previous) => [...previous, event])
        }
      }
      try {
        while (true) {
          const { done, value } = await reader.read()
          buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
          const lines = buffer.split(/\r?\n/)
          buffer = lines.pop() ?? ''
          for (const line of lines) append(line)
          if (done) { if (buffer.trim()) append(buffer); break }
        }
      } finally { await reader.cancel().catch(() => {}); reader.releaseLock() }
    } catch (reason) {
      if (!controller.signal.aborted) setEvents((previous) => [...previous, { type: 'error', text: reason instanceof Error ? reason.message : 'Could not contact Vox.' }])
    } finally { activeRequest.current = null; if (!controller.signal.aborted) setBusy(false) }
  }, [canvasState, apply])

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-5"
        style={{ background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="font-display text-xl tracking-widest hover:opacity-80 transition-opacity">
            VOX<span className="text-[#00d4ff]">.</span>
          </Link>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/40 sm:inline">
            canvas
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className={`size-1.5 rounded-full ${busy ? 'bg-[#00d4ff] animate-pulse' : 'bg-white/20'}`} />
          {busy ? 'Agent working…' : `rev ${canvasState.revision}`}
        </div>
      </header>

      {/* Main layout */}
      <div className="flex min-h-0 flex-1 overflow-x-auto pb-24">
        <AgentPanel events={events} />
        <main className="min-w-[320px] flex-1 overflow-y-auto vox-grid-bg">
          <Canvas />
        </main>
        <DataSourcePanel />
      </div>

      {/* Voice bar — fixed bottom */}
      <div className="fixed bottom-5 left-1/2 z-[1000] w-full max-w-2xl -translate-x-1/2 px-4">
        <VoiceInput onSubmit={submit} disabled={busy} />
      </div>
    </div>
  )
}
