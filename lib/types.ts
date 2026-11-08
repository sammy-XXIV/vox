export type ColumnDef = {
  name: string
  type: 'string' | 'number' | 'date'
}

export type Row = Record<string, string | number | null>

export type DataSource = {
  id: string
  kind: 'csv' | 'postgres' | 'rest'
  label: string
  schema: ColumnDef[]
  rows: Row[]
  connectionString?: string
  url?: string
  headers?: Record<string, string>
}

export type ChartTile = {
  id: string
  sourceId: string
  chartType: 'bar' | 'line' | 'scatter' | 'pie' | 'choropleth'
  query: string
  data: Row[]
  title?: string
  position: { x: number; y: number }
  size: { w: number; h: number }
}

export type Annotation = {
  id: string
  chartId: string
  pointKey: string
  text: string
}

export type Filter = {
  id: string
  sourceId: string
  column: string
  op: 'eq' | 'gt' | 'lt' | 'contains'
  value: string
}

export type CanvasState = {
  id: string
  dataSources: DataSource[]
  charts: ChartTile[]
  annotations: Annotation[]
  filters: Filter[]
  revision: number
}

export type AgentEvent =
  | { type: 'thinking'; text: string }
  | { type: 'action'; name: string; args: unknown }
  | { type: 'patch'; patch: Partial<CanvasState> }
  | { type: 'result'; text: string }
  | { type: 'error'; text: string }
