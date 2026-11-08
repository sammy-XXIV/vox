import { describe, test, expect } from 'vitest'
import { parseCSV } from '../../lib/data/csv'

describe('parseCSV', () => {
  test('parses valid CSV with schema inference', () => {
    const result = parseCSV('name,age\nAlice,30\nBob,25')
    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.schema).toEqual([
      { name: 'name', type: 'string' },
      { name: 'age', type: 'number' },
    ])
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0]).toMatchObject({ name: 'Alice', age: 30 })
  })

  test('returns error on empty string', () => {
    const result = parseCSV('')
    expect('error' in result).toBe(true)
  })

  test('returns error on whitespace-only string', () => {
    const result = parseCSV('   ')
    expect('error' in result).toBe(true)
  })

  test('infers number type for numeric columns', () => {
    const result = parseCSV('x,y\n1.5,2.0\n3.0,4.5')
    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.schema[0].type).toBe('number')
    expect(result.schema[1].type).toBe('number')
  })
})
