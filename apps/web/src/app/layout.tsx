import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '../styles/globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GF Magazine',
    template: '%s | GF Magazine',
  },
  description: 'A modern literary and editorial publication.',
  openGraph: {
    siteName: 'GF Magazine',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
