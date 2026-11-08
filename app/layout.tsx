import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })

export const metadata: Metadata = {
  title: 'Vox',
  description: 'Voice-first analytics canvas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${spaceGrotesk.variable} antialiased`}><body className="min-h-screen bg-zinc-950 font-sans text-zinc-100">{children}</body></html>
}
