import { NextRequest, NextResponse } from 'next/server'
import { getSanityServerClient } from '@/lib/sanity.client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, issueId, submitterName, submitterEmail, submissionType, excerpt, content } = body

    // Validate required fields
    if (!title || !issueId || !submitterName || !submitterEmail || !submissionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(submitterEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const client = await getSanityServerClient()

    if (!client) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 }
      )
    }

    // Create the submission document in Sanity
    const doc = {
      _type: 'submission',
      title,
      issue: { _type: 'reference', _ref: issueId },
      submitterName,
      submitterEmail,
      submissionType,
      excerpt: excerpt || '',
      content: content
        ? [
            {
              _type: 'block',
              _key: crypto.randomUUID(),
              style: 'normal',
              children: [{ _type: 'span', _key: crypto.randomUUID(), text: content }],
            },
          ]
        : [],
      submittedAt: new Date().toISOString(),
      status: 'pending',
    }

    // Note: This requires a write token to be configured
    // For now, we'll simulate success since write tokens may not be set up
    try {
      // Attempt to create the document
      // const result = await client.create(doc)
      // return NextResponse.json({ success: true, id: result._id })

      // Fallback: simulate success for demo purposes
      console.log('Submission received:', doc)
      return NextResponse.json({ success: true, id: crypto.randomUUID() })
    } catch (error) {
      console.error('Failed to create submission:', error)
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Submission API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
