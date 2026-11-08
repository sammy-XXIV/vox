'use client'

import { useRef, useState } from 'react'
import { connectDataSourceAction } from '@/actions/connect-data-source'
import { useCanvasStore } from '@/lib/store'
import type { DataSource } from '@/lib/types'

const inputClass = 'w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20 focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/30 disabled:opacity-50'
const buttonClass = 'w-full rounded-lg btn-indigo px-3 py-2.5 text-sm font-medium text-white disabled:opacity-40'

export default function DataSourcePanel() {
  const { state } = useCanvasStore()
  const [open, setOpen] = useState(true)
  const [pending, setPending] = useState<DataSource['kind'] | null>(null)
  const inFlight = useRef(false)
  const [errors, setErrors] = useState<Partial<Record<DataSource['kind'], string>>>({})
  const [connectionString, setConnectionString] = useState('')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState('{}')

  async function connect(kind: DataSource['kind'], getInput: () => Promise<Parameters<typeof connectDataSourceAction.run>[0]>) {
    if (inFlight.current) return
    inFlight.current = true
    setPending(kind)
    setErrors((previous) => ({ ...previous, [kind]: '' }))
    try {
      const result = await connectDataSourceAction.run(await getInput())
      if ('error' in result) throw new Error(result.error)
      if (kind === 'postgres') setConnectionString('')
    } catch (reason) {
      setErrors((previous) => ({ ...previous, [kind]: reason instanceof Error ? reason.message : 'Could not connect data source.' }))
    } finally { inFlight.current = false; setPending(null) }
  }
  return <aside aria-label="Data sources" className={`h-full shrink-0 overflow-hidden border-l border-white/5 transition-all duration-200 ${open ? 'w-64' : 'w-10'}`} style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)' }}>
    <div className="flex items-center justify-between px-3 py-3">
      <button onClick={() => setOpen(!open)} aria-label={open ? 'Collapse data sources' : 'Expand data sources'} className="flex size-6 items-center justify-center rounded text-white/30 hover:bg-white/8 hover:text-white/60 transition-colors">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          {open ? <path d="M4 2l4 4-4 4" /> : <path d="M8 2L4 6l4 4" />}
        </svg>
      </button>
      {open && <h2 className="text-[10px] font-medium uppercase tracking-widest text-white/30">Data sources</h2>}
    </div>
    {open && <div className="overflow-y-auto px-3 pb-3 space-y-5" style={{ height: 'calc(100% - 40px)' }}>
    <section className="space-y-2">
      <label htmlFor="csv-file" className="block text-sm font-medium">CSV file</label>
      <input id="csv-file" type="file" accept=".csv,text/csv" disabled={pending !== null} className="w-full text-xs text-zinc-400 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-100 disabled:opacity-50" onChange={(event) => {
        const file = event.target.files?.[0]
        if (file) void connect('csv', async () => ({ kind: 'csv', label: file.name, content: await file.text() }))
        event.target.value = ''
      }} />
      {pending === 'csv' && <p role="status" className="text-xs text-zinc-400">Importing CSV…</p>}
      {errors.csv && <p role="alert" className="break-words text-xs text-red-400">{errors.csv}</p>}
    </section>
    <form className="space-y-2 border-t border-zinc-800 pt-4" onSubmit={(event) => { event.preventDefault(); void connect('postgres', async () => ({ kind: 'postgres', label: 'Postgres', connectionString: connectionString.trim() })) }}>
      <label htmlFor="postgres-connection" className="block text-sm font-medium">Postgres connection string</label>
      <input id="postgres-connection" type="password" autoComplete="off" required value={connectionString} onChange={(event) => setConnectionString(event.target.value)} placeholder="postgresql://user:password@host/db" className={inputClass} disabled={pending !== null} />
      <button disabled={pending !== null || !connectionString.trim()} className={buttonClass}>{pending === 'postgres' ? 'Connecting…' : 'Connect Postgres'}</button>
      {errors.postgres && <p role="alert" className="break-words text-xs text-red-400">{errors.postgres}</p>}
    </form>
    <form className="space-y-2 border-t border-zinc-800 pt-4" onSubmit={(event) => {
      event.preventDefault()
      void connect('rest', async () => {
        const parsed: unknown = JSON.parse(headers || '{}')
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || Object.values(parsed).some((value) => typeof value !== 'string')) throw new Error('Headers must be a JSON object with string values.')
        const endpoint = new URL(url.trim())
        if (!['https:', 'http:'].includes(endpoint.protocol)) throw new Error('Use an HTTP or HTTPS URL.')
        return { kind: 'rest', label: endpoint.hostname, url: endpoint.toString(), headers: parsed as Record<string, string> }
      })
    }}>
      <label htmlFor="rest-url" className="block text-sm font-medium">REST API URL</label>
      <input id="rest-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://api.example.com/data" className={inputClass} disabled={pending !== null} />
      <label htmlFor="rest-headers" className="block text-xs text-zinc-400">Headers (JSON)</label>
      <textarea id="rest-headers" rows={3} spellCheck={false} value={headers} onChange={(event) => setHeaders(event.target.value)} className={`${inputClass} resize-y font-mono`} disabled={pending !== null} />
      <button disabled={pending !== null || !url.trim()} className={buttonClass}>{pending === 'rest' ? 'Connecting…' : 'Connect API'}</button>
      {errors.rest && <p role="alert" className="break-words text-xs text-red-400">{errors.rest}</p>}
    </form>
    <section className="space-y-3 border-t border-zinc-800 pt-4">
      <h3 className="text-sm font-medium">Connected <span className="text-zinc-500">{state.dataSources.length}</span></h3>
      {!state.dataSources.length && <p className="text-xs text-white/30">Connect a source to start exploring.</p>}
      <ul className="space-y-2">{state.dataSources.map((source) => <li key={source.id} className="rounded-lg border border-white/8 bg-white/3 p-3"><p className="truncate text-sm text-white/80" title={source.label}>{source.label}</p><p className="mt-1 text-xs text-white/30">{source.kind.toUpperCase()} · {source.schema.length} columns · {source.rows.length} rows</p></li>)}</ul>
    </section>
    </div>}
  </aside>
}
