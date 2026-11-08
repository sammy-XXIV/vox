import { Pool } from 'pg'
import type { ColumnDef, Row } from '../types'

// pg OID → our type
const OID_NUMBER = new Set([20, 21, 23, 700, 701, 1700])
const OID_DATE = new Set([1082, 1114, 1184])

function pgTypeToColType(oid: number): ColumnDef['type'] {
  if (OID_NUMBER.has(oid)) return 'number'
  if (OID_DATE.has(oid)) return 'date'
  return 'string'
}

export function createPool(connectionString: string): Pool {
  return new Pool({ connectionString, connectionTimeoutMillis: 5000 })
}

export async function runSQL(
  pool: Pool,
  sql: string,
  params: unknown[] = []
): Promise<{ schema: ColumnDef[]; rows: Row[] } | { error: string }> {
  try {
    const result = await pool.query(sql, params)
    const schema: ColumnDef[] = result.fields.map((f) => ({
      name: f.name,
      type: pgTypeToColType(f.dataTypeID),
    }))
    return { schema, rows: result.rows }
  } catch (err) {
    return { error: (err as Error).message }
  }
}
