import { z } from 'zod'
import { useCanvasStore } from '@/lib/store'

const schema = z.object({
  chartId: z.string(),
  revision: z.number(),
})

export const removeChartAction = {
  name: 'removeChart',
  description: 'Remove a chart from the canvas by its chartId',
  inputSchema: schema,
  async run(input: z.infer<typeof schema>): Promise<{ ok: true } | { error: string }> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.message }
    const { chartId, revision } = parsed.data
    const { state, apply } = useCanvasStore.getState()
    if (state.revision !== revision) return { error: '409 revision_conflict' }
    apply({ charts: state.charts.filter((c) => c.id !== chartId) })
    return { ok: true }
  },
}
