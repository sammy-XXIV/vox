declare module 'papaparse' {
  type ParseConfig = {
    header?: boolean
    dynamicTyping?: boolean
    skipEmptyLines?: boolean | 'greedy'
  }
  type ParseResult<T> = {
    data: T[]
    errors: { type: string; code: string; message: string; row?: number }[]
    meta: { fields?: string[] }
  }
  const Papa: { parse<T>(input: string, config: ParseConfig): ParseResult<T> }
  export default Papa
}
