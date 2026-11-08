import type { ColumnDef, Row } from '../types'

function inferType(values: unknown[]): ColumnDef['type'] {
  const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '')
  if (nonNull.length === 0) return 'string'
  if (nonNull.every((v) => typeof v === 'number')) return 'number'
  if (nonNull.every((v) => typeof v === 'string' && !isNaN(Date.parse(v)))) return 'date'
  return 'string'
}

export async function fetchAPI(
  url: string,
  headers: Record<string, string> = {}
): Promise<{ schema: ColumnDef[]; rows: Row[] } | { error: string }> {
  let res: Response
  try {
    res = await fetch(url, { headers })
  } catch (err) {
    return { error: (err as Error).message }
  }

  if (!res.ok) return { error: `HTTP ${res.status}` }

  let body: unknown
  try {
    body = await res.json()
  } catch {
    return { error: 'Response is not valid JSON' }
  }

  const arr: Row[] = Array.isArray(body)
    ? (body as Row[])
    : Array.isArray((body as { data?: unknown }).data)
    ? ((body as { data: Row[] }).data)
    : null as unknown as Row[]

  if (!Array.isArray(arr)) return { error: 'Response is not an array' }
  if (arr.length === 0) return { schema: [], rows: [] }

  const keys = Object.keys(arr[0])
  const schema: ColumnDef[] = keys.map((name) => ({
    name,
    type: inferType(arr.map((r) => r[name])),
  }))

  return { schema, rows: arr }
}
