const STEPS = [
  { label: '01 / Your question', text: 'Show monthly revenue by region.' },
  { label: '02 / Vox queries', text: 'Grouping revenue by month and region…' },
  { label: '03 / Your answer', text: 'Revenue by region, ready to explore.' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const BAR_HEIGHTS = [42, 58, 48, 76, 64, 92]
const SLICES = [
  { pct: 0.38, color: '#00d4ff', label: 'North' },
  { pct: 0.30, color: '#b0b0b0', label: 'Central' },
  { pct: 0.32, color: '#666', label: 'South' },
]

export default function AnimatedMockup() {
  const circumference = 2 * Math.PI * 13

  return (
    <figure
      className="overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.4)]"
      aria-label="Illustrative demo: ask a question, Vox queries the data, then displays charts."
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 sm:px-5">
        <span className="text-sm font-medium text-white/80">A question becomes a clearer picture.</span>
        <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/60">Example data</span>
      </figcaption>

      <div className="flex flex-col md:min-h-80 md:flex-row">
        <ol className="grid gap-3 border-b border-white/10 p-4 sm:grid-cols-3 md:w-64 md:shrink-0 md:grid-cols-1 md:content-start md:border-b-0 md:border-r md:p-5">
          {STEPS.map((item, i) => (
            <li key={item.label} className={`demo-step demo-step-${i} rounded-lg border border-white/10 bg-white/[0.03] p-3`}>
              <p className="mb-2 text-xs font-medium text-[#00d4ff]">{item.label}</p>
              <p className="text-sm leading-relaxed text-white/80">{item.text}</p>
            </li>
          ))}
        </ol>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="demo-charts grid gap-4 sm:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-4" role="img" aria-label="Illustrative monthly revenue chart, increasing from January to June.">
              <p className="mb-5 text-sm font-medium text-white/80">Monthly revenue</p>
              <div aria-hidden="true" className="flex h-28 items-end gap-2 sm:gap-3">
                {BAR_HEIGHTS.map((height, i) => (
                  <div key={MONTHS[i]} className="demo-bar flex-1 rounded-t-sm bg-gradient-to-t from-[#00d4ff]/30 to-[#00d4ff]" style={{ height: `${height}%`, animationDelay: `${2.1 + i * 0.08}s` }} />
                ))}
              </div>
              <div aria-hidden="true" className="mt-2 flex gap-2 text-center text-xs text-white/60 sm:gap-3">
                {MONTHS.map(month => <span key={month} className="flex-1">{month}</span>)}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-4 text-sm font-medium text-white/80">Revenue by region</p>
              <div className="flex items-center justify-center gap-4">
                <svg width="80" height="80" viewBox="0 0 32 32" className="shrink-0 -rotate-90" aria-hidden="true">
                  {SLICES.map((slice, i) => {
                    const start = SLICES.slice(0, i).reduce((sum, previous) => sum + previous.pct, 0)
                    return <circle key={slice.label} r="13" cx="16" cy="16" fill="none" stroke={slice.color} strokeWidth="6" strokeDasharray={`${circumference * slice.pct} ${circumference * (1 - slice.pct)}`} strokeDashoffset={-circumference * start} />
                  })}
                </svg>
                <ul className="space-y-2 text-xs text-white/80">
                  {SLICES.map(slice => (
                    <li key={slice.label} className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: slice.color }} />
                      {slice.label} {Math.round(slice.pct * 100)}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center gap-3 rounded-xl border border-[#00d4ff]/25 bg-[#00d4ff]/5 px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-[#00d4ff]" aria-hidden="true">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
            </svg>
            <p className="text-sm leading-relaxed text-white/80">“Show monthly revenue by region.”</p>
          </div>
        </div>
      </div>
    </figure>
  )
}
