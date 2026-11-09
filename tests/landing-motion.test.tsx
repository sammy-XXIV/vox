import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { HeroReveal, RevealOnScroll } from '@/components/LandingMotion'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('keeps the heading and revealed content visible with reduced motion', () => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  render(<>
    <HeroReveal line1="TALK TO YOUR" line2="DATA." />
    <RevealOnScroll><p>Explore your data</p></RevealOnScroll>
  </>)
  expect(screen.getByRole('heading')).toBeVisible()
  expect(screen.getByText('Explore your data')).toBeVisible()
})

it('renders readable content before JavaScript runs', () => {
  const container = document.createElement('div')
  container.innerHTML = renderToStaticMarkup(<>
    <HeroReveal line1="TALK TO YOUR" line2="DATA." />
    <RevealOnScroll><p>Explore your data</p></RevealOnScroll>
  </>)
  document.body.appendChild(container)
  try {
    expect(container.querySelector('h1')).toBeVisible()
    expect(container.querySelector('p')).toBeVisible()
  } finally {
    container.remove()
  }
})
