import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Home from '@/app/page'

vi.mock('@/components/Canvas', () => ({ default: () => <div>Canvas</div> }))
vi.mock('@/components/DataSourcePanel', () => ({ default: () => <div>Sources</div> }))
vi.mock('@/components/VoiceInput', () => ({ default: ({ onSubmit }: { onSubmit: (text: string) => void }) => <button onClick={() => onSubmit('Show sales')}>Ask</button> }))
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

it('reads SSE across chunk boundaries and flushes the final unterminated line', async () => {
  const encoder = new TextEncoder()
  const chunks = [': heartbeat\r\ndata: {"type":"thinking","text":"Think', 'ing"}\r\n\r\ndata: {"type":"result","text":"Ready"}']
  const fetchMock = vi.fn().mockResolvedValue(new Response(new ReadableStream({ start(controller) { for (const chunk of chunks) controller.enqueue(encoder.encode(chunk)); controller.close() } })))
  vi.stubGlobal('fetch', fetchMock)
  render(<Home />)
  fireEvent.click(screen.getByRole('button', { name: 'Ask' }))
  expect(await screen.findByText('Thinking')).toBeTruthy()
  expect(await screen.findByText('Ready')).toBeTruthy()
  const request = JSON.parse(fetchMock.mock.calls[0][1].body)
  expect(request.message).toBe('Show sales')
  expect(request.state.revision).toBeTypeOf('number')
})
