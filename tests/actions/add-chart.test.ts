import { describe, test, expect, beforeEach } from 'vitest'
import { connectDataSourceAction } from '../../actions/connect-data-source'
import { addChartAction } from '../../actions/add-chart'
import { useCanvasStore } from '../../lib/store'

beforeEach(() => {
  useCanvasStore.setState({
    state: { id: 'default', dataSources: [], charts: [], annotations: [], filters: [], revision: 0 },
    apply: useCanvasStore.getState().apply,
  })
})

describe('addChartAction', () => {
  test('adds bar chart and returns chartId', async () => {
    const conn = await connectDataSourceAction.run({
      kind: 'csv', label: 'D', content: 'cat,val\nA,10\nB,20',
    })
    if ('error' in conn) throw new Error(conn.error)
    const result = await addChartAction.run({
      sourceId: conn.sourceId, chartType: 'bar', query: '',
    })
    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.chartId).toBeTruthy()
    expect(useCanvasStore.getState().state.charts).toHaveLength(1)
  })

  test('rejects unknown chartType', async () => {
    const result = await addChartAction.run({
      sourceId: 'any', chartType: 'radar' as never, query: '',
    })
    expect('error' in result).toBe(true)
  })

  test('returns error for unknown sourceId', async () => {
    const result = await addChartAction.run({
      sourceId: 'unknown', chartType: 'bar', query: '',
    })
    expect('error' in result).toBe(true)
  })
})
