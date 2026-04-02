import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { openIssuesQuery } from '@/lib/queries'
import { SubmitForm } from '@/components/SubmitForm'

export const metadata = {
  title: 'Submit Your Work',
  description: 'Submit your articles, poetry, photography, and artwork to Pulse Magazine.',
}

export default async function SubmitPage() {
  const sanityServerClient = await getSanityServerClient()

  if (!sanityServerClient) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-3xl font-bold text-ink mb-4">Submit Your Work</h1>
          <p className="text-gray-600">
            Configure Sanity environment variables to enable submissions.
          </p>
        </div>
      </div>
    )
  }

  const issues = await safeSanityFetch(
    sanityServerClient,
    openIssuesQuery,
    {},
    []
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-ink mb-4">Submit Your Work</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          We accept submissions for articles, essays, poetry, photography, artwork, and interviews.
          Select an open issue below and fill out the form to submit your work for consideration.
        </p>
      </div>

      <SubmitForm issues={issues} />
    </div>
  )
}
