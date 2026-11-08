import Anthropic from '@anthropic-ai/sdk'
import { nanoid } from 'nanoid'
import type { CanvasState, AgentEvent } from './types'
import { connectDataSourceAction } from '@/actions/connect-data-source'
import { runQueryAction } from '@/actions/run-query'
import { addChartAction } from '@/actions/add-chart'
import { removeChartAction } from '@/actions/remove-chart'
import { updateChartPositionAction } from '@/actions/update-chart-position'
import { filterDatasetAction } from '@/actions/filter-dataset'
import { annotatePointAction } from '@/actions/annotate-point'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL,
})

const ACTIONS = [
  connectDataSourceAction,
  runQueryAction,
  addChartAction,
  removeChartAction,
  updateChartPositionAction,
  filterDatasetAction,
  annotatePointAction,
]

function actionToTool(action: (typeof ACTIONS)[number]): Anthropic.Tool {
  return {
    name: action.name,
    description: action.description,
    input_schema: {
      type: 'object' as const,
      properties: Object.fromEntries(
        Object.entries(action.inputSchema.shape ?? {}).map(([k]) => [k, { type: 'string' }])
      ),
    },
  }
}

export async function* runAgent(
  message: string,
  canvasState: CanvasState
): AsyncGenerator<AgentEvent> {
  // Mutable local copy so actions can see sources added in this same run
  let agentState: CanvasState = {
    ...canvasState,
    dataSources: [...canvasState.dataSources],
    charts: [...canvasState.charts],
    annotations: [...canvasState.annotations],
    filters: [...canvasState.filters],
  }

  const systemPrompt = `You are Vox, a voice-first analytics assistant. You help users visualize data by connecting data sources and creating charts.

Current canvas state:
- Data sources: ${agentState.dataSources.map((s) => `${s.id} (${s.label}, ${s.kind})`).join(', ') || 'none'}
- Charts: ${agentState.charts.map((c) => `${c.id} (${c.chartType})`).join(', ') || 'none'}

Call the available actions to fulfill the user's request. Always call addChart after runQuery to show results.`

  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: message },
  ]

  const tools = ACTIONS.map(actionToTool)

  for (let i = 0; i < 10; i++) {
    yield { type: 'thinking', text: `Thinking… (step ${i + 1})` }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    })

    for (const block of response.content) {
      if (block.type === 'text' && block.text) {
        yield { type: 'result', text: block.text }
      }
    }

    const toolUseBlocks = response.content.filter((b) => b.type === 'tool_use')
    if (toolUseBlocks.length === 0) break

    const toolResults: Anthropic.ToolResultBlockParam[] = []
    for (const block of toolUseBlocks) {
      if (block.type !== 'tool_use') continue
      const action = ACTIONS.find((a) => a.name === block.name)
      if (!action) {
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify({ error: 'Unknown action' }) })
        continue
      }

      yield { type: 'action', name: block.name, args: block.input }

      try {
        const result = await action.run(block.input as never, { state: agentState })

        // Apply state mutations and yield patches
        if (!('error' in result)) {
          if (block.name === 'connectDataSource' && 'source' in result) {
            agentState = { ...agentState, dataSources: [...agentState.dataSources, result.source] }
            yield { type: 'patch', patch: { dataSources: agentState.dataSources } }
          } else if (block.name === 'addChart' && 'tile' in result) {
            agentState = { ...agentState, charts: [...agentState.charts, result.tile] }
            yield { type: 'patch', patch: { charts: agentState.charts } }
          } else if (block.name === 'removeChart') {
            const { chartId } = block.input as { chartId: string }
            agentState = { ...agentState, charts: agentState.charts.filter((c) => c.id !== chartId) }
            yield { type: 'patch', patch: { charts: agentState.charts } }
          } else if (block.name === 'annotatePoint') {
            const { chartId, pointKey, text } = block.input as { chartId: string; pointKey: string; text: string }
            const annotation = { id: nanoid(), chartId, pointKey, text }
            agentState = { ...agentState, annotations: [...agentState.annotations, annotation] }
            yield { type: 'patch', patch: { annotations: agentState.annotations } }
          } else if (block.name === 'filterDataset') {
            const { sourceId, column, op, value } = block.input as { sourceId: string; column: string; op: 'eq'|'gt'|'lt'|'contains'; value: string }
            const filter = { id: nanoid(), sourceId, column, op, value }
            agentState = { ...agentState, filters: [...agentState.filters, filter] }
            yield { type: 'patch', patch: { filters: agentState.filters } }
          } else if (block.name === 'updateChartPosition') {
            const { chartId, x, y } = block.input as { chartId: string; x: number; y: number }
            agentState = { ...agentState, charts: agentState.charts.map((c) => c.id === chartId ? { ...c, position: { x, y } } : c) }
            yield { type: 'patch', patch: { charts: agentState.charts } }
          }
        }

        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) })
      } catch (err) {
        const errMsg = (err as Error).message
        yield { type: 'error', text: errMsg }
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify({ error: errMsg }) })
      }
    }

    messages.push({ role: 'assistant', content: response.content })
    messages.push({ role: 'user', content: toolResults })

    if (response.stop_reason === 'end_turn') break
  }
}
