import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Hardcoded data - avoids Sanity client issues
// TODO: Re-enable Sanity fetching once client is debugged

export const metadata: Metadata = {
  title: 'Post Not Found',
  description: 'This post could not be found.',
}

export default function PostPage() {
  notFound()
}
