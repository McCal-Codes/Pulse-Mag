import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

/**
 * Enable draft preview mode.
 *
 * Call from Sanity Studio with:
 *   /api/preview?secret=<SANITY_PREVIEW_SECRET>&slug=<post-slug>
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  // In Next.js 15, draftMode() is async
  const draft = await draftMode()
  draft.enable()

  redirect(slug ? `/post/${slug}` : '/')
}
