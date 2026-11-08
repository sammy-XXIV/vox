'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

type Recognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}
type VoiceWindow = Window & {
  SpeechRecognition?: new () => Recognition
  webkitSpeechRecognition?: new () => Recognition
}
const subscribe = () => () => {}
function isSupported() {
  const browser = window as VoiceWindow
  return Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition)
}

export function useVoice() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const recognition = useRef<Recognition | null>(null)
  const supported = useSyncExternalStore(subscribe, isSupported, () => false)

  useEffect(() => () => {
    if (recognition.current) {
      recognition.current.onend = null
      recognition.current.onresult = null
      recognition.current.onerror = null
      recognition.current.abort()
    }
  }, [])

  const start = useCallback(() => {
    if (typeof window === 'undefined' || recognition.current) return
    const browser = window as VoiceWindow
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition
    if (!Constructor) return
    const instance = new Constructor()
    instance.continuous = false
    instance.interimResults = true
    instance.lang = navigator.language || 'en-US'
    instance.onresult = (event) => {
      setTranscript(Array.from(event.results, (result) => result[0]?.transcript ?? '').join(' '))
    }
    instance.onend = () => {
      recognition.current = null
      setListening(false)
    }
    instance.onerror = () => {
      setTranscript('')
      instance.abort()
      recognition.current = null
      setListening(false)
    }
    recognition.current = instance
    setTranscript('')
    try {
      instance.start()
      setListening(true)
    } catch {
      recognition.current = null
      setListening(false)
    }
  }, [])
  const stop = useCallback(() => recognition.current?.stop(), [])
  return { transcript, listening, start, stop, supported }
}
