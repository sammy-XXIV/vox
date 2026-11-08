# Vox — Voice-First Analytics Canvas

> Speak your query. Watch the data appear.

Vox is a voice-first analytics canvas where you talk to an AI agent and charts materialize in real time. Built for the **Builder.io Agent-Native Hackathon**.

---

## What it does

- **Voice input** — press the mic, say "show me revenue by month as a bar chart"
- **AI agent** — connects data sources, runs queries, picks chart types autonomously
- **Live canvas** — charts stream onto a zoomable canvas as the agent acts
- **Brush zoom** — drag to zoom into any time range on bar/line charts with >10 data points
- **Agent panel** — real-time trace of every action the agent takes

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 App Router + Turbopack |
| Styling | Tailwind v4 |
| State | Zustand |
| Charts | Recharts |
| Agent | Anthropic Claude (SSE streaming) |
| Voice | Web Speech API |

## Architecture

```
Voice → SSE agent loop → actions (ctx-threaded) → patch events → Zustand → Canvas
```

Actions run server-side with canvas state threaded via `ctx`. Agent yields `patch` events; client applies them to Zustand store so canvas updates in real time.

## Setup

```bash
pnpm install
```

Create `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_BASE_URL=https://api.anthropic.com/v1
```

```bash
pnpm dev
# open http://localhost:3000
```

## Actions

| Action | What it does |
|---|---|
| `connectDataSource` | Register CSV, Postgres, or REST endpoint |
| `runQuery` | Execute SQL or filter against a source |
| `addChart` | Create bar/line/scatter/pie tile on canvas |
| `removeChart` | Remove a tile |
| `updateChartPosition` | Move a tile |
| `filterDataset` | Apply column filter to source |
| `annotatePoint` | Add annotation to a data point |

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sammy-XXIV/vox)

Set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in Vercel environment variables.
