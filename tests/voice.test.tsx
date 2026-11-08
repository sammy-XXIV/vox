import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import VoiceInput from '@/components/VoiceInput'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

it('submits typed text when speech recognition is unavailable', () => {
  vi.stubGlobal('SpeechRecognition', undefined)
  vi.stubGlobal('webkitSpeechRecognition', undefined)
  const submit = vi.fn()
  render(<VoiceInput onSubmit={submit} />)
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Show sales  ' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).toHaveBeenCalledExactlyOnceWith('Show sales')
})

it('shows interim speech and submits once after recognition ends', () => {
  const instances: RecognitionMock[] = []
  class RecognitionMock {
    continuous = true
    interimResults = false
    lang = ''
    onresult: ((event: { results: { transcript: string }[][] }) => void) | null = null
    onend: (() => void) | null = null
    onerror: (() => void) | null = null
    constructor() { instances.push(this) }
    start() {}
    stop() { this.onend?.() }
    abort() {}
  }
  vi.stubGlobal('SpeechRecognition', RecognitionMock)
  const submit = vi.fn()
  const view = render(<VoiceInput onSubmit={submit} />)
  fireEvent.click(screen.getByRole('button', { name: 'Start listening' }))
  const instance = instances[0]
  expect(instance!.continuous).toBe(false)
  expect(instance!.interimResults).toBe(true)
  act(() => instance!.onresult?.({ results: [[{ transcript: 'Show revenue' }]] }))
  expect(screen.getByText('Show revenue')).toBeTruthy()
  expect(submit).not.toHaveBeenCalled()
  act(() => instance!.onend?.())
  expect(submit).toHaveBeenCalledExactlyOnceWith('Show revenue')
  view.rerender(<VoiceInput onSubmit={(text) => submit(text)} />)
  expect(submit).toHaveBeenCalledTimes(1)
})
