import { describe, test, expect, beforeEach } from 'vitest'
import { connectDataSourceAction } from '../../actions/connect-data-source'
import { runQueryAction } from '../../actions/run-query'
import { useCanvasStore } from '../../lib/store'

beforeEach(() => {
  useCanvasStore.setState({
    state: { id: 'default', dataSources: [], charts: [], annotations: [], filters: [], revision: 0 },
    apply: useCanvasStore.getState().apply,
  })
})

describe('runQueryAction', () => {
  test('returns all rows when query is empty', async () => {
    const conn = await connectDataSourceAction.run({
      kind: 'csv', label: 'T', content: 'x,y\n1,a\n2,b\n3,a',
    })
    if ('error' in conn) throw new Error(conn.error)
    const result = await runQueryAction.run({ sourceId: conn.sourceId, query: '' })
    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.rows).toHaveLength(3)
  })

  test('filters rows with = expression', async () => {
    const conn = await connectDataSourceAction.run({
      kind: 'csv', label: 'T', content: 'x,y\n1,a\n2,b\n3,a',
    })
    if ('error' in conn) throw new Error(conn.error)
    const result = await runQueryAction.run({ sourceId: conn.sourceId, query: "y = 'a'" })
    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.rows).toHaveLength(2)
  })

  test('returns error for unknown sourceId', async () => {
    const result = await runQueryAction.run({ sourceId: 'nope', query: 'SELECT 1' })
    expect('error' in result).toBe(true)
  })
})
