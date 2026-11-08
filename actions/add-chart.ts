import { z } from 'zod'
import { nanoid } from 'nanoid'
import { runQueryAction } from './run-query'
import type { CanvasState, ChartTile } from '@/lib/types'

const CHART_TYPES = ['bar', 'line', 'scatter', 'pie', 'choropleth'] as const

const schema = z.object({
  sourceId: z.string(),
  chartType: z.enum(CHART_TYPES),
  query: z.string(),
  title: z.string().optional(),
})

export type AddChartInput = z.infer<typeof schema>

export const addChartAction = {
  name: 'addChart',
  description: 'Add a chart to the canvas. chartType: bar | line | scatter | pie | choropleth',
  inputSchema: schema,
  async run(input: AddChartInput, ctx?: { state: CanvasState }): Promise<{ chartId: string; tile: ChartTile } | { error: string }> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.message }

    const { sourceId, chartType, query, title } = parsed.data
    const dataResult = await runQueryAction.run({ sourceId, query }, ctx)
    if ('error' in dataResult) return dataResult

    const chartId = nanoid()
    const tile: ChartTile = {
      id: chartId,
      sourceId,
      chartType,
      query,
      data: dataResult.rows,
      title,
      position: { x: 0, y: 0 },
      size: { w: 400, h: 300 },
    }

    return { chartId, tile }
  },
}
