import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Hardcoded data - avoids Sanity client issues
// TODO: Re-enable Sanity fetching once client is debugged

export const metadata: Metadata = {
  title: 'Author Not Found',
  description: 'This author could not be found.',
}

export default function AuthorPage() {
  notFound()
}
