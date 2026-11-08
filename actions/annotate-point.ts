import { nanoid } from 'nanoid'
import { z } from 'zod'
import { useCanvasStore } from '@/lib/store'
import type { CanvasState } from '@/lib/types'

const schema = z.object({
  chartId: z.string(),
  pointKey: z.string().min(1),
  text: z.string().trim().min(1),
  revision: z.number().optional(),
})

export const annotatePointAction = {
  name: 'annotatePoint',
  description: 'Annotate a point on a chart',
  inputSchema: schema,
  async run(input: z.infer<typeof schema>, ctx?: { state: CanvasState }): Promise<{ annotationId: string } | { error: string }> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.message }
    const { chartId, pointKey, text, revision } = parsed.data
    const store = useCanvasStore.getState()
    const state = ctx?.state ?? store.state
    if (revision !== undefined && state.revision !== revision) return { error: '409 revision_conflict' }
    if (!state.charts.some((chart) => chart.id === chartId)) return { error: 'Chart not found' }
    if (!text.trim() || !pointKey) return { error: 'Annotation text and point are required' }
    const annotationId = nanoid()
    // Client-side: mutate store directly
    if (!ctx) store.apply({ annotations: [...state.annotations, { id: annotationId, chartId, pointKey, text: text.trim() }] })
    return { annotationId }
  },
}
