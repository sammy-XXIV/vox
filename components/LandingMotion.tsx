'use client'

import { useEffect, useRef } from 'react'

/* Animated gradient orbs behind content */
export function MeshOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          animation: 'orb1 12s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full opacity-8"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.25) 0%, transparent 70%)',
          animation: 'orb2 15s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-6"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          animation: 'orb3 10s ease-in-out infinite alternate',
        }}
      />
    </div>
  )
}

/* Stagger-reveal wrapper — fires GSAP when element enters viewport */
export function RevealOnScroll({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = ref.current
    if (!el) return

    // Respect reduced motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let disposed = false
    let revert: (() => void) | undefined

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap: g }, { ScrollTrigger: ST }]) => {
      if (disposed) return
      g.registerPlugin(ST)
      const media = g.matchMedia()
      revert = () => media.revert()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        g.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })
    }).catch(() => { /* Content remains visible if optional motion cannot load. */ })

    return () => { disposed = true; revert?.() }
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* Hero heading — word-by-word stagger on mount */
export function HeroReveal({ line1, line2 }: { line1: string; line2: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let disposed = false
    let revert: (() => void) | undefined
    import('gsap').then(({ gsap }) => {
      if (disposed) return
      const words = el.querySelectorAll<HTMLSpanElement>('.word')
      const media = gsap.matchMedia()
      revert = () => media.revert()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          words,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: 'power3.out',
          }
        )
      })
    }).catch(() => { /* The heading is readable without the animation module. */ })
    return () => { disposed = true; revert?.() }
  }, [])

  const words1 = line1.split(' ')
  const words2 = line2.split(' ')

  return (
    <h1
      ref={ref}
      className="mb-6 font-display text-[clamp(3.25rem,11vw,7.5rem)] leading-[0.98] tracking-wide"
    >
      {words1.map((w, i) => (
        <span key={i} className="word mr-[0.2em] inline-block" style={{ transformOrigin: 'bottom' }}>
          {w}
        </span>
      ))}
      <br />
      {words2.map((w, i) => (
        <span
          key={i}
          className="word mr-[0.2em] inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 100%)',
            transformOrigin: 'bottom',
          }}
        >
          {w}
        </span>
      ))}
    </h1>
  )
}

/* Waveform bars — animated mic visualizer */
export function Waveform({ active = false }: { active?: boolean }) {
  const bars = [3, 5, 8, 12, 9, 6, 11, 7, 4, 10, 8, 5]
  return (
    <div aria-hidden="true" className="flex items-center gap-[3px]" style={{ height: 24 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-[#00d4ff]"
          style={{
            height: active ? `${h * 2}px` : '4px',
            transition: `height ${0.15 + i * 0.02}s ease`,
            animation: active ? `wave ${0.6 + (i % 3) * 0.2}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  )
}
