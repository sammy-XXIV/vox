import Papa from 'papaparse'
import type { ColumnDef, Row } from '../types'

function inferType(values: unknown[]): ColumnDef['type'] {
  const nonNull = values.filter((v) => v !== null && v !== '')
  if (nonNull.length === 0) return 'string'
  if (nonNull.every((v) => typeof v === 'number' && !isNaN(v as number))) return 'number'
  if (nonNull.every((v) => typeof v === 'string' && !isNaN(Date.parse(v as string)))) return 'date'
  return 'string'
}

export function parseCSV(
  input: string
): { schema: ColumnDef[]; rows: Row[] } | { error: string } {
  if (!input || !input.trim()) return { error: 'Empty CSV content' }

  const result = Papa.parse<Row>(input, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })

  if (result.errors.length > 0 && result.data.length === 0) {
    return { error: result.errors[0].message }
  }

  const headers = result.meta.fields ?? []
  if (headers.length === 0) return { error: 'No headers found' }

  const schema: ColumnDef[] = headers.map((name) => ({
    name,
    type: inferType(result.data.map((r) => r[name])),
  }))

  return { schema, rows: result.data }
}
