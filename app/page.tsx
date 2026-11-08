'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AgentPanel from '@/components/AgentPanel'
import Canvas from '@/components/Canvas'
import DataSourcePanel from '@/components/DataSourcePanel'
import VoiceInput from '@/components/VoiceInput'
import { useCanvasStore } from '@/lib/store'
import type { AgentEvent } from '@/lib/types'

function parseEvent(line: string): AgentEvent | null {
  const value = line.trim()
  if (!value || value.startsWith(':') || /^(event|id|retry):/.test(value)) return null
  const payload = value.startsWith('data:') ? value.slice(5).trim() : value
  if (!payload || payload === '[DONE]') return null
  const event: unknown = JSON.parse(payload)
  if (typeof event !== 'object' || event === null || !('type' in event)) throw new Error('Invalid agent event.')
  if (event.type === 'action' && 'name' in event && typeof event.name === 'string' && 'args' in event) return { type: 'action', name: event.name, args: event.args }
  if (['thinking', 'result', 'error'].includes(String(event.type)) && 'text' in event && typeof event.text === 'string') return { type: event.type as 'thinking' | 'result' | 'error', text: event.text }
  throw new Error('Invalid agent event.')
}

export default function Home() {
  const { state: canvasState } = useCanvasStore()
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [busy, setBusy] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)
  useEffect(() => () => activeRequest.current?.abort(), [])

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
      const append = (line: string) => { const event = parseEvent(line); if (event) setEvents((previous) => [...previous, event]) }
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
  }, [canvasState])

  return <div className="flex h-dvh flex-col overflow-hidden bg-zinc-950 text-zinc-100">
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 px-6"><h1 className="text-2xl font-semibold tracking-tight">Vox<span className="text-indigo-500">.</span></h1><span className="text-xs text-zinc-500">Voice-first analytics canvas</span></header>
    <div className="flex min-h-0 flex-1 overflow-x-auto pb-32">
      <AgentPanel events={events} />
      <main className="min-w-[320px] flex-1 overflow-y-auto"><Canvas /></main>
      <DataSourcePanel />
    </div>
    <div className="fixed bottom-5 left-1/2 z-[1000] w-full max-w-2xl -translate-x-1/2 px-4"><VoiceInput onSubmit={submit} disabled={busy} /></div>
  </div>
}
