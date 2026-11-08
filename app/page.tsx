import Link from 'next/link'
import { MeshOrbs, HeroReveal, RevealOnScroll, Waveform } from '@/components/LandingMotion'

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
      </svg>
    ),
    title: 'Voice-first input',
    description: 'Speak naturally. Vox transcribes, parses intent, and routes to the right action — no form filling, no SQL.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Agent-native actions',
    description: 'Every action — connect data, query, chart, filter, annotate — is shared between the UI and the AI agent loop.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: 'Live canvas',
    description: 'Bar, line, scatter, pie, choropleth — drag, filter, annotate. What the agent renders, you can reshape.',
  },
]

const sources = ['CSV upload', 'PostgreSQL', 'REST API']

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#090d1a] text-slate-100">
      <MeshOrbs />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-2xl tracking-widest">
          VOX<span className="text-indigo-400">.</span>
        </span>
        <Link
          href="/canvas"
          className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-5 py-2 text-sm font-medium text-indigo-300 backdrop-blur-sm transition-all duration-200 hover:border-indigo-400/70 hover:bg-indigo-500/20 hover:text-indigo-200 focus-visible:outline-2 focus-visible:outline-indigo-400"
        >
          Open Canvas →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-24 text-center sm:px-10 sm:pt-32">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-violet-400" />
          Builder.io Agent-Native Hackathon
        </div>

        <HeroReveal line1="TALK TO YOUR" line2="DATA." />

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Voice in. AI queries. Live charts. One canvas shared between you and your agent — built on Agent-Native shared actions.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/canvas"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3 text-sm font-medium text-white shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-200 hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
            </svg>
            Open Canvas
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Waveform active />
            <span>Drop a CSV. Speak a question.</span>
          </div>
        </div>
      </section>

      {/* App mockup */}
      <RevealOnScroll className="relative z-10 mx-auto mb-24 max-w-5xl px-4 sm:px-6" delay={0.1}>
      <section>
        <div
          className="overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm"
          style={{ background: 'rgba(15, 23, 42, 0.7)', boxShadow: '0 0 80px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.5)' }}
        >
          {/* Fake titlebar */}
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <span className="size-3 rounded-full bg-red-500/70" />
            <span className="size-3 rounded-full bg-yellow-500/70" />
            <span className="size-3 rounded-full bg-green-500/70" />
            <span className="ml-auto text-xs text-slate-500">vox.app/canvas</span>
          </div>
          {/* Fake app UI */}
          <div className="flex h-64 sm:h-96">
            {/* Agent panel */}
            <div className="hidden w-56 shrink-0 border-r border-white/5 p-4 sm:block">
              <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-slate-500">Agent activity</p>
              <div className="space-y-3">
                {[
                  { type: 'thinking', text: 'Parsing "show monthly revenue by region"…' },
                  { type: 'action', text: '▶ runQuery({ query: "month, region" })' },
                  { type: 'result', text: 'Added bar chart: Revenue by Region' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-2 text-xs ${
                      item.type === 'thinking'
                        ? 'border-slate-700/50 bg-slate-800/40 italic text-slate-400'
                        : item.type === 'action'
                          ? 'border-indigo-500/20 bg-indigo-500/10 font-mono text-indigo-400'
                          : 'border-violet-500/20 bg-violet-500/10 text-slate-200'
                    }`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            {/* Canvas */}
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex gap-3 overflow-hidden">
                {/* Bar chart mock */}
                <div className="flex-1 overflow-hidden rounded-xl border border-indigo-500/10 bg-slate-900/60 p-3">
                  <p className="mb-2 text-xs font-medium text-slate-300">Revenue by Region</p>
                  <div className="flex h-28 items-end gap-2">
                    {[65, 85, 50, 90, 70, 60].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: 'linear-gradient(to top, #4f46e5, #818cf8)' }} />
                    ))}
                  </div>
                </div>
                {/* Pie chart mock */}
                <div className="hidden flex-1 items-center justify-center rounded-xl border border-violet-500/10 bg-slate-900/60 p-3 sm:flex">
                  <p className="text-xs font-medium text-slate-300">Category Split</p>
                  <svg width="80" height="80" viewBox="0 0 32 32" className="ml-3">
                    <circle r="16" cx="16" cy="16" fill="transparent" stroke="#4f46e5" strokeWidth="10" strokeDasharray="30 70" strokeDashoffset="0" />
                    <circle r="16" cx="16" cy="16" fill="transparent" stroke="#7c3aed" strokeWidth="10" strokeDasharray="25 75" strokeDashoffset="-30" />
                    <circle r="16" cx="16" cy="16" fill="transparent" stroke="#818cf8" strokeWidth="10" strokeDasharray="20 80" strokeDashoffset="-55" />
                  </svg>
                </div>
              </div>
              {/* Voice bar */}
              <div className="mt-auto flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3">
                <div className="size-8 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true">
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                  </svg>
                </div>
                <span className="text-xs text-indigo-300">show monthly revenue by region →</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </RevealOnScroll>

      {/* Feature grid */}
      <RevealOnScroll className="relative z-10 mx-auto mb-24 max-w-5xl px-6 sm:px-10" delay={0}>
      <section>
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Every action shared between you and your agent
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 p-6 backdrop-blur-sm transition-all duration-200 hover:border-indigo-500/30"
              style={{ background: 'rgba(15, 23, 42, 0.6)' }}
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
      </RevealOnScroll>

      {/* Sources strip */}
      <section className="relative z-10 mx-auto mb-24 max-w-5xl px-6 text-center sm:px-10">
        <p className="mb-6 text-sm font-medium uppercase tracking-widest text-slate-500">Connect any source</p>
        <div className="flex flex-wrap justify-center gap-3">
          {sources.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-300 backdrop-blur-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 mx-auto mb-20 max-w-2xl px-6 text-center sm:px-10">
        <div
          className="rounded-3xl border border-indigo-500/20 p-10 backdrop-blur-sm"
          style={{ background: 'rgba(99,102,241,0.08)', boxShadow: '0 0 60px rgba(99,102,241,0.1)' }}
        >
          <h2 className="mb-4 font-display text-5xl tracking-widest">READY TO LISTEN?</h2>
          <p className="mb-8 text-slate-400">Drop a CSV, speak a question, watch the canvas fill.</p>
          <Link
            href="/canvas"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 font-medium text-white shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-200 hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            Open Canvas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center text-xs text-slate-600">
        Built for Builder.io Agent-Native Hackathon · Vox
      </footer>
    </div>
  )
}
