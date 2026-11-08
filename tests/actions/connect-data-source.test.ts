import { describe, test, expect, beforeEach } from 'vitest'
import { connectDataSourceAction } from '../../actions/connect-data-source'
import { useCanvasStore } from '../../lib/store'

beforeEach(() => {
  useCanvasStore.setState({
    state: { id: 'default', dataSources: [], charts: [], annotations: [], filters: [], revision: 0 },
    apply: useCanvasStore.getState().apply,
  })
})

describe('connectDataSourceAction', () => {
  test('connects CSV and returns sourceId + schema', async () => {
    const result = await connectDataSourceAction.run({
      kind: 'csv',
      label: 'Sales',
      content: 'product,revenue\nA,100\nB,200',
    })
    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.sourceId).toBeTruthy()
    expect(result.schema.map((c) => c.name)).toContain('product')
  })

  test('returns error for empty CSV content', async () => {
    const result = await connectDataSourceAction.run({ kind: 'csv', label: 'Bad', content: '' })
    expect('error' in result).toBe(true)
  })

  test('adds source to store', async () => {
    await connectDataSourceAction.run({ kind: 'csv', label: 'T', content: 'x\n1\n2' })
    expect(useCanvasStore.getState().state.dataSources).toHaveLength(1)
  })

  test('returns error when postgres has no connectionString', async () => {
    const result = await connectDataSourceAction.run({ kind: 'postgres', label: 'DB' })
    expect('error' in result).toBe(true)
  })
})
