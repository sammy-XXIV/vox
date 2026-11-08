'use client'

import { ResponsiveContainer, ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, Tooltip } from 'recharts'
import type { Row, ColumnDef } from '@/lib/types'

export default function ScatterChart({ data, schema }: { data: Row[]; schema: ColumnDef[] }) {
  const [x, y] = schema.filter((column) => column.type === 'number')
  if (!x || !y) return <p className="p-4 text-sm text-zinc-500">A scatter chart needs two numeric columns.</p>
  return <ResponsiveContainer width="100%" height="100%"><RechartsScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 0 }}><XAxis type="number" dataKey={x.name} name={x.name} stroke="#a1a1aa" tick={{ fontSize: 12 }} /><YAxis type="number" dataKey={y.name} name={y.name} stroke="#a1a1aa" tick={{ fontSize: 12 }} /><Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#18181b', borderColor: '#3f3f46', color: '#f4f4f5' }} /><Scatter data={data} fill="#6366f1" /></RechartsScatterChart></ResponsiveContainer>
}
