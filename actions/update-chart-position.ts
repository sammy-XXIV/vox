import { z } from 'zod'
import { useCanvasStore } from '@/lib/store'

const schema = z.object({
  chartId: z.string(),
  x: z.number(),
  y: z.number(),
  revision: z.number(),
})

export const updateChartPositionAction = {
  name: 'updateChartPosition',
  description: 'Update the canvas position of a chart',
  inputSchema: schema,
  async run(input: z.infer<typeof schema>): Promise<{ ok: true } | { error: string }> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.message }
    const { chartId, x, y, revision } = parsed.data
    const { state, apply } = useCanvasStore.getState()
    if (state.revision !== revision) return { error: '409 revision_conflict' }
    apply({
      charts: state.charts.map((c) =>
        c.id === chartId ? { ...c, position: { x, y } } : c
      ),
    })
    return { ok: true }
  },
}
