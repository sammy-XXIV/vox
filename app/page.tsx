import Link from 'next/link'
import { MeshOrbs, HeroReveal, RevealOnScroll, Waveform } from '@/components/LandingMotion'
import AnimatedMockup from '@/components/AnimatedMockup'

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
        <AnimatedMockup />
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
