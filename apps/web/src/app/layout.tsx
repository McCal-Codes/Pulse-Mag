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
    default: 'Pulse Magazine | Pittsburgh Literary & Arts Journal',
    template: '%s | Pulse Magazine',
  },
  description: 'Submit poetry, fiction, and creative work to Pulse Magazine, Point Park University\'s literary journal. Open to emerging writers and artists in Pittsburgh.',
  keywords: ['pittsburgh literary magazine', 'poetry submissions', 'fiction submissions', 'point park university', 'emerging writers', 'student submissions'],
  openGraph: {
    siteName: 'Pulse Magazine',
    type: 'website',
    locale: 'en_US',
    url: 'https://pulseliterary.com',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pulsemagazine',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://pulseliterary.com',
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
