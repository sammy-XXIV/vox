import { create } from 'zustand'
import type { CanvasState } from './types'

type CanvasStore = {
  state: CanvasState
  apply: (patch: Partial<CanvasState>) => void
}

const initialState: CanvasState = {
  id: 'default',
  dataSources: [],
  charts: [],
  annotations: [],
  filters: [],
  revision: 0,
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  state: initialState,
  apply: (patch) =>
    set((s) => ({
      state: { ...s.state, ...patch, revision: s.state.revision + 1 },
    })),
}))
