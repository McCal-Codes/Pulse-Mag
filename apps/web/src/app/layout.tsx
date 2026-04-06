import type { Metadata } from 'next'
import { Playfair_Display, Libre_Baskerville } from 'next/font/google'
import '../styles/globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '700'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Pulse Magazine',
    template: '%s | Pulse Magazine',
  },
  description: 'Independent journalism at the pulse of culture.',
  openGraph: {
    siteName: 'Pulse Magazine',
    type: 'website',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-paper text-ink font-body antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
