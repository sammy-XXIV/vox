import { z } from 'zod'
import { useCanvasStore } from '@/lib/store'
import { createPool, runSQL } from '@/lib/data/postgres'
import type { ColumnDef, Row } from '@/lib/types'

const schema = z.object({
  sourceId: z.string(),
  query: z.string(),
})

export type RunQueryInput = z.infer<typeof schema>

// Simple expression parser: "column op value" e.g. "age > 30", "name = 'Alice'", "city contains 'York'"
function filterRows(rows: Row[], expr: string): Row[] {
  if (!expr.trim()) return rows
  const match = expr.match(/^(\w+)\s*(=|!=|>|<|contains)\s*['"]?(.+?)['"]?$/)
  if (!match) return rows
  const [, col, op, val] = match
  const numVal = parseFloat(val)
  return rows.filter((row) => {
    const cell = row[col]
    if (cell === null || cell === undefined) return false
    switch (op) {
      case '=': return String(cell) === val
      case '!=': return String(cell) !== val
      case '>': return typeof cell === 'number' && cell > numVal
      case '<': return typeof cell === 'number' && cell < numVal
      case 'contains': return String(cell).toLowerCase().includes(val.toLowerCase())
      default: return true
    }
  })
}

export const runQueryAction = {
  name: 'runQuery',
  description: 'Query a connected data source. For CSV/REST use a filter expression like "age > 30". For Postgres use SQL.',
  inputSchema: schema,
  async run(input: RunQueryInput): Promise<{ rows: Row[]; schema: ColumnDef[] } | { error: string }> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.message }

    const { sourceId, query } = parsed.data
    const { state } = useCanvasStore.getState()
    const source = state.dataSources.find((s) => s.id === sourceId)
    if (!source) return { error: `Unknown sourceId: ${sourceId}` }

    if (source.kind === 'postgres') {
      if (!source.connectionString) return { error: 'No connection string stored' }
      const pool = createPool(source.connectionString)
      return runSQL(pool, query, [])
    }

    // CSV / REST: in-memory filter
    const filtered = filterRows(source.rows, query)
    return { rows: filtered, schema: source.schema }
  },
}
