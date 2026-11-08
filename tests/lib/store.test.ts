import { describe, test, expect, beforeEach } from 'vitest'
import { useCanvasStore } from '../../lib/store'

describe('useCanvasStore', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      state: { id: 'default', dataSources: [], charts: [], annotations: [], filters: [], revision: 0 },
      apply: useCanvasStore.getState().apply,
    })
  })

  test('apply increments revision', () => {
    const before = useCanvasStore.getState().state.revision
    useCanvasStore.getState().apply({ charts: [] })
    expect(useCanvasStore.getState().state.revision).toBe(before + 1)
  })

  test('apply merges patch into state', () => {
    useCanvasStore.getState().apply({ id: 'test-canvas' })
    expect(useCanvasStore.getState().state.id).toBe('test-canvas')
  })
})
