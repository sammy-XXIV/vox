import { z } from 'zod'
import { nanoid } from 'nanoid'
import { useCanvasStore } from '@/lib/store'
import type { CanvasState, Filter } from '@/lib/types'

const schema = z.object({
  sourceId: z.string(),
  column: z.string(),
  op: z.enum(['eq', 'gt', 'lt', 'contains']),
  value: z.string(),
  revision: z.number().optional(),
})

export const filterDatasetAction = {
  name: 'filterDataset',
  description: 'Apply a filter to a data source on the canvas',
  inputSchema: schema,
  async run(input: z.infer<typeof schema>, ctx?: { state: CanvasState }): Promise<{ ok: true } | { error: string }> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.message }
    const { sourceId, column, op, value, revision } = parsed.data
    const store = useCanvasStore.getState()
    const state = ctx?.state ?? store.state
    if (revision !== undefined && state.revision !== revision) return { error: '409 revision_conflict' }
    const filter: Filter = { id: nanoid(), sourceId, column, op, value }
    if (!ctx) store.apply({ filters: [...state.filters, filter] })
    return { ok: true }
  },
}
