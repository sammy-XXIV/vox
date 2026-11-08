'use server'

import { createPool, runSQL } from '@/lib/data/postgres'
import type { ColumnDef, Row } from '@/lib/types'

export async function connectPostgres(connectionString: string): Promise<{ schema: ColumnDef[]; rows: Row[] } | { error: string }> {
  if (!connectionString.trim()) return { error: 'Connection string required' }
  const pool = createPool(connectionString)
  try {
    const result = await runSQL(pool, 'SELECT * FROM information_schema.tables LIMIT 0', [])
    return 'error' in result ? result : { schema: [], rows: [] }
  } finally { await pool.end() }
}
