'use client'

import { useEffect, useRef, useState } from 'react'

const AGENT_STEPS = [
  { type: 'thinking', text: 'Parsing "show monthly revenue by region"…' },
  { type: 'action',   text: '▶ runQuery({ query: "month, region" })' },
  { type: 'result',   text: 'Added bar chart: Revenue by Region' },
]

const BAR_HEIGHTS = [65, 85, 50, 90, 70, 60]

/* Typewriter — renders text char by char */
function Typewriter({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const idx = useRef(0)
  useEffect(() => {
    idx.current = 0
    setDisplayed('')
    const id = setInterval(() => {
      idx.current++
      setDisplayed(text.slice(0, idx.current))
      if (idx.current >= text.length) { clearInterval(id); onDone?.() }
    }, 22)
    return () => clearInterval(id)
  }, [text, onDone])
  return <>{displayed}<span className="animate-pulse">▌</span></>
}

/* Animated bar chart */
function AnimatedBars({ go }: { go: boolean }) {
  return (
    <div className="flex h-28 items-end gap-2">
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all"
          style={{
            height: go ? `${h}%` : '0%',
            transitionDuration: `${500 + i * 80}ms`,
            transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
            transitionDelay: go ? `${i * 60}ms` : '0ms',
            background: 'linear-gradient(to top, #333, #aaa)',
          }}
        />
      ))}
    </div>
  )
}

/* Animated donut — stroke-dashoffset draw-on */
const R = 13
const CIRC = 2 * Math.PI * R
const SLICES = [
  { pct: 0.38, color: '#00d4ff' },
  { pct: 0.30, color: '#555' },
  { pct: 0.32, color: '#999' },
]

function AnimatedDonut({ go }: { go: boolean }) {
  let offset = 0
  return (
    <svg width="80" height="80" viewBox="0 0 32 32" className="ml-3 -rotate-90">
      {SLICES.map((s, i) => {
        const dash = CIRC * s.pct
        const gap  = CIRC - dash
        const o    = offset
        offset += s.pct
        return (
          <circle
            key={i}
            r={R} cx="16" cy="16"
            fill="transparent"
            stroke={s.color}
            strokeWidth="6"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-CIRC * o}
            style={{
              opacity:            go ? 1 : 0,
              strokeDasharray:    go ? `${dash} ${gap}` : `0 ${CIRC}`,
              transition: `stroke-dasharray ${600 + i * 200}ms cubic-bezier(0.34,1.2,0.64,1), opacity 300ms`,
              transitionDelay:    go ? `${i * 180}ms` : '0ms',
            }}
          />
        )
      })}
    </svg>
  )
}

export default function AnimatedMockup() {
  const [step, setStep]       = useState(-1)   // which agent step is visible
  const [typing, setTyping]   = useState(false) // typewriter running
  const [barsGo, setBarsGo]   = useState(false)
  const [donutGo, setDonutGo] = useState(false)
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* All animations fire together, then loop */
  function runSequence() {
    setStep(-1); setBarsGo(false); setDonutGo(false); setTyping(false)
    loopRef.current = setTimeout(() => {
      setStep(AGENT_STEPS.length - 1) // show all cards at once
      setTyping(true)                  // typewriter on last card only
      setBarsGo(true)
      setDonutGo(true)
    }, 300)
    loopRef.current = setTimeout(runSequence, 5000)
  }

  useEffect(() => {
    runSequence()
    return () => { if (loopRef.current) clearTimeout(loopRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onTypeDone() { setTyping(false) }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/8 backdrop-blur-sm"
      style={{ background: 'rgba(10,10,10,0.9)', boxShadow: '0 0 80px rgba(0,212,255,0.06), 0 40px 80px rgba(0,0,0,0.6)' }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="size-3 rounded-full bg-red-500/70" />
        <span className="size-3 rounded-full bg-yellow-500/70" />
        <span className="size-3 rounded-full bg-green-500/70" />
        <span className="ml-auto text-xs text-slate-500">vox.app/canvas</span>
      </div>

      <div className="flex h-64 sm:h-96">
        {/* Agent panel */}
        <div className="hidden w-56 shrink-0 border-r border-white/5 p-4 sm:block">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-white/30">Agent activity</p>
          <div className="space-y-3">
            {AGENT_STEPS.map((item, i) => (
              <div
                key={i}
                className={`rounded-lg border p-2 text-xs transition-all duration-300 ${
                  step < 0
                    ? 'invisible opacity-0'
                    : item.type === 'thinking'
                      ? 'border-white/8 bg-white/5 italic text-white/40'
                      : item.type === 'action'
                        ? 'border-[#00d4ff]/20 bg-[#00d4ff]/5 font-mono text-[#00d4ff]/80'
                        : 'border-white/8 bg-white/5 text-white/80'
                }`}
              >
                {step >= 0 && <Typewriter key={step} text={item.text} onDone={i === AGENT_STEPS.length - 1 ? onTypeDone : undefined} />}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex gap-3 overflow-hidden">
            {/* Bar chart */}
            <div className="flex-1 overflow-hidden rounded-xl border border-white/5 bg-white/3 p-3">
              <p className="mb-2 text-xs font-medium text-white/60">Revenue by Region</p>
              <AnimatedBars go={barsGo} />
            </div>
            {/* Donut */}
            <div className="hidden flex-1 items-center justify-center rounded-xl border border-white/5 bg-white/3 p-3 sm:flex">
              <p className="text-xs font-medium text-white/60">Category Split</p>
              <AnimatedDonut go={donutGo} />
            </div>
          </div>

          {/* Voice bar */}
          <div className="mt-auto flex items-center gap-3 rounded-xl border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-4 py-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00d4ff]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
              </svg>
            </div>
            <span className="text-xs text-[#00d4ff]/70">show monthly revenue by region →</span>
          </div>
        </div>
      </div>
    </div>
  )
}
