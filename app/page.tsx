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
    description: 'Ask a question in your own words. Use your voice or type what you want to explore.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Follow the answer',
    description: 'See what Vox is doing as it queries your data and builds your charts, one step at a time.',
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
    description: 'Keep exploring after the first answer. Move charts, filter the data, and annotate what matters.',
  },
]

const sources = ['CSV upload', 'PostgreSQL', 'REST API']

export default function Landing() {
  return (
    <main className="landing-page relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white">
      <MeshOrbs />

      {/* Nav */}
      <nav aria-label="Main navigation" className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-10">
        <span className="font-display text-2xl tracking-widest">
          VOX<span className="text-[#00d4ff]">.</span>
        </span>
        <Link
          href="/canvas"
          className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white/80 transition-colors duration-200 hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00d4ff]"
        >
          Open Canvas →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-12 pt-12 text-center sm:px-10 sm:pb-16 sm:pt-20">
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 sm:px-4">
          <span className="size-1.5 rounded-full bg-[#00d4ff]" />
          Builder.io Agent-Native Hackathon
        </div>

        <HeroReveal line1="TALK TO YOUR" line2="DATA." />

        <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
          Ask your data a question. Watch the answer take shape.
          Upload a CSV, speak or type, and explore the charts with Vox.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/canvas"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#00d4ff] px-7 py-3 text-sm font-semibold text-[#0a0a0a] shadow-[0_0_32px_rgba(0,212,255,0.15)] transition-colors duration-200 hover:bg-[#7aeaff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00d4ff] sm:w-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
            </svg>
            Open Canvas
          </Link>
          <a href="#demo" className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-medium text-white/80 transition-colors hover:text-[#00d4ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00d4ff]">
            See how it works <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/65">
          <Waveform />
          <span>Your question. Your data. A clearer picture.</span>
        </div>
      </section>

      {/* App mockup */}
      <RevealOnScroll className="relative z-10 mx-auto mb-16 max-w-5xl px-4 sm:mb-24 sm:px-6" delay={0.1}>
      <section id="demo" aria-label="How Vox works" className="scroll-mt-6">
        <AnimatedMockup />
      </section>
      </RevealOnScroll>

      {/* Feature grid */}
      <RevealOnScroll className="relative z-10 mx-auto mb-16 max-w-5xl px-5 sm:mb-24 sm:px-10" delay={0}>
      <section>
        <h2 className="mb-8 text-balance text-center text-2xl font-semibold tracking-tight sm:mb-10 sm:text-3xl">
          From a question to something you can explore.
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 p-6 backdrop-blur-sm transition-all duration-200 hover:border-[#00d4ff]/20"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60">
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
      </RevealOnScroll>

      {/* Sources strip */}
      <section className="relative z-10 mx-auto mb-16 max-w-5xl px-5 text-center sm:mb-24 sm:px-10">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-white/65">Start with the data you have</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {sources.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/60 backdrop-blur-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 mx-auto mb-20 max-w-2xl px-6 text-center sm:px-10">
        <div
          className="rounded-3xl border border-white/15 px-5 py-8 sm:p-10"
          style={{ background: 'rgba(255,255,255,0.03)', boxShadow: '0 0 60px rgba(0,212,255,0.04)' }}
        >
          <h2 className="mb-4 text-balance font-display text-4xl tracking-wide sm:text-5xl">WHAT WILL YOU ASK FIRST?</h2>
          <p className="mb-8 leading-relaxed text-white/70">Bring your data. Start with one question.</p>
          <Link
            href="/canvas"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#00d4ff] px-8 py-3.5 font-semibold text-[#0a0a0a] transition-colors duration-200 hover:bg-[#7aeaff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00d4ff]"
          >
            Open Canvas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs leading-relaxed text-white/60">
        Built for Builder.io Agent-Native Hackathon · Vox
      </footer>
    </main>
  )
}
