import type { Metadata } from 'next'
import { Space_Grotesk, Bebas_Neue } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas', display: 'swap' })

export const metadata: Metadata = {
  title: 'Vox',
  description: 'Voice-first analytics canvas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${spaceGrotesk.variable} ${bebasNeue.variable} antialiased`}><body className="min-h-screen bg-[#0a0a0a] font-sans text-white">{children}</body></html>
}
