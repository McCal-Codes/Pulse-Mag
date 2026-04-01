import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Disable draft preview mode and return to the homepage.
 *
 * Call from any page: /api/disable-preview
 */
export async function GET() {
  // In Next.js 15, draftMode() is async
  const draft = await draftMode()
  draft.disable()

  redirect('/')
}
