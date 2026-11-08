import { z } from 'zod'
import { useCanvasStore } from '@/lib/store'
import type { CanvasState } from '@/lib/types'

const schema = z.object({
  chartId: z.string(),
  revision: z.number().optional(),
})

export const removeChartAction = {
  name: 'removeChart',
  description: 'Remove a chart from the canvas by its chartId',
  inputSchema: schema,
  async run(input: z.infer<typeof schema>, ctx?: { state: CanvasState }): Promise<{ ok: true } | { error: string }> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.message }
    const { chartId, revision } = parsed.data
    const store = useCanvasStore.getState()
    const state = ctx?.state ?? store.state
    if (revision !== undefined && state.revision !== revision) return { error: '409 revision_conflict' }
    if (!ctx) store.apply({ charts: state.charts.filter((c) => c.id !== chartId) })
    return { ok: true }
  },
}
