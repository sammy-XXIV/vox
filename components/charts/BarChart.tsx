'use client'

import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import type { Row, ColumnDef } from '@/lib/types'

export default function BarChart({ data, schema }: { data: Row[]; schema: ColumnDef[] }) {
  if (schema.length < 2) return <p className="p-4 text-sm text-zinc-500">A bar chart needs two columns.</p>
  return <ResponsiveContainer width="100%" height="100%"><RechartsBarChart data={data} margin={{ top: 16, right: 16, bottom: 16, left: 0 }}><XAxis dataKey={schema[0].name} stroke="#a1a1aa" tick={{ fontSize: 12 }} /><YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ background: '#18181b', borderColor: '#3f3f46', color: '#f4f4f5' }} /><Bar dataKey={schema[1].name} fill="#6366f1" radius={[4, 4, 0, 0]} /></RechartsBarChart></ResponsiveContainer>
}
