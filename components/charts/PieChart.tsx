'use client'

import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import type { Row, ColumnDef } from '@/lib/types'

const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']
export default function PieChart({ data, schema }: { data: Row[]; schema: ColumnDef[] }) {
  const name = schema.find((column) => column.type === 'string')
  const value = schema.find((column) => column.type === 'number')
  if (!name || !value) return <p className="p-4 text-sm text-zinc-500">A pie chart needs a string and a numeric column.</p>
  return <ResponsiveContainer width="100%" height="100%"><RechartsPieChart><Pie data={data} nameKey={name.name} dataKey={value.name} outerRadius="75%" stroke="#18181b">{data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', borderColor: '#3f3f46', color: '#f4f4f5' }} /><Legend wrapperStyle={{ fontSize: 12 }} /></RechartsPieChart></ResponsiveContainer>
}
