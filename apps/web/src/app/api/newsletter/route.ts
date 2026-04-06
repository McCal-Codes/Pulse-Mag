import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // TODO: Integrate with your email service provider
    // Options:
    // 1. Mailchimp API
    // 2. ConvertKit API
    // 3. Buttondown.email API
    // 4. Resend API (for transactional + newsletters)
    // 5. Sanity - store emails as a document type

    // For now, just log the subscription (replace with actual integration)
    console.log('Newsletter subscription:', email)

    // Example: Store in Sanity (uncomment when ready)
    // import { sanityClient } from '@/lib/sanity.client'
    // await sanityClient.create({
    //   _type: 'newsletterSubscriber',
    //   email,
    //   subscribedAt: new Date().toISOString(),
    //   source: 'news-page'
    // })

    return NextResponse.json(
      { message: 'Successfully subscribed to The Pulse Beat' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}
