'use client'

import { useEffect, useRef, useState } from 'react'
import { useVoice } from '@/lib/voice'

export default function VoiceInput({ onSubmit, disabled = false }: { onSubmit: (text: string) => void; disabled?: boolean }) {
  const { transcript, listening, start, stop, supported } = useVoice()
  const [text, setText] = useState('')
  const wasListening = useRef(false)
  useEffect(() => {
    if (wasListening.current && !listening && transcript.trim() && !disabled) onSubmit(transcript.trim())
    wasListening.current = listening
  }, [listening, transcript, disabled, onSubmit])

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl">
      {supported ? (
        <div className="flex items-center gap-3">
          <button type="button" disabled={disabled} onClick={listening ? stop : start} aria-label={listening ? 'Stop listening' : 'Start listening'} aria-pressed={listening} className={`flex size-12 shrink-0 items-center justify-center rounded-full text-white transition focus-visible:outline-2 focus-visible:outline-indigo-400 disabled:opacity-40 ${listening ? 'animate-pulse bg-red-500' : 'bg-indigo-500 hover:bg-indigo-400'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></svg>
          </button>
          <p aria-live="polite" className="min-w-0 break-words text-sm text-zinc-300">{transcript || (listening ? 'Listening…' : disabled ? 'Vox is working…' : 'Ask Vox to visualize your data')}</p>
        </div>
      ) : (
        <form className="flex items-end gap-3" onSubmit={(event) => { event.preventDefault(); if (text.trim() && !disabled) { onSubmit(text.trim()); setText('') } }}>
          <label className="sr-only" htmlFor="voice-fallback">Message to Vox</label>
          <textarea id="voice-fallback" rows={2} value={text} onChange={(event) => setText(event.target.value)} disabled={disabled} placeholder="Ask Vox to visualize your data" className="min-w-0 flex-1 resize-none rounded-lg bg-zinc-950 p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
          <button disabled={disabled || !text.trim()} className="rounded-lg bg-indigo-500 px-4 py-3 text-sm font-medium hover:bg-indigo-400 disabled:opacity-40">Submit</button>
        </form>
      )}
    </div>
  )
}
