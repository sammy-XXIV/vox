import { z } from 'zod'
import { nanoid } from 'nanoid'
import { parseCSV } from '@/lib/data/csv'
import { fetchAPI } from '@/lib/data/rest-api'
import { useCanvasStore } from '@/lib/store'
import type { ColumnDef, DataSource } from '@/lib/types'

const schema = z.object({
  kind: z.enum(['csv', 'postgres', 'rest']),
  label: z.string().min(1),
  content: z.string().optional(),
  connectionString: z.string().optional(),
  url: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
})

export type ConnectDataSourceInput = z.infer<typeof schema>

export const connectDataSourceAction = {
  name: 'connectDataSource',
  description: 'Connect a data source (CSV, PostgreSQL, or REST API)',
  inputSchema: schema,
  async run(
    input: ConnectDataSourceInput
  ): Promise<{ sourceId: string; schema: ColumnDef[] } | { error: string }> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.message }

    const { kind, label, content, connectionString, url, headers } = parsed.data
    let result: { schema: ColumnDef[]; rows: import('@/lib/types').Row[] } | { error: string }

    if (kind === 'csv') {
      if (!content) return { error: 'CSV content required' }
      result = parseCSV(content)
    } else if (kind === 'postgres') {
      if (!connectionString) return { error: 'Connection string required' }
      const { connectPostgres } = await import('@/actions/connect-postgres')
      result = await connectPostgres(connectionString)
    } else {
      if (!url) return { error: 'URL required' }
      result = await fetchAPI(url, headers ?? {})
    }

    if ('error' in result) return result

    const sourceId = nanoid()
    const source: DataSource = {
      id: sourceId,
      kind,
      label,
      schema: result.schema,
      rows: result.rows,
      connectionString,
      url,
      headers,
    }

    const { state, apply } = useCanvasStore.getState()
    apply({ dataSources: [...state.dataSources, source] })

    return { sourceId, schema: result.schema }
  },
}
