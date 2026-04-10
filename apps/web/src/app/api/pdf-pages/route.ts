import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { sanityClient } from '@/lib/sanity.client'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const issueId = searchParams.get('issueId')

  if (!issueId) {
    return NextResponse.json({ error: 'Issue ID required' }, { status: 400 })
  }

  try {
    if (!sanityClient) {
      return NextResponse.json({ error: 'Sanity client not available' }, { status: 500 })
    }

    // Check Cloudinary credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return NextResponse.json(
        { error: 'Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY to env.' },
        { status: 500 }
      )
    }

    // Fetch issue from Sanity to get PDF URL
    const issue = await sanityClient.fetch(
      `*[_type == "issue" && _id == $issueId][0]{ pdfFile { asset->{url} } }`,
      { issueId }
    )

    if (!issue?.pdfFile?.asset?.url) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    const pdfUrl = issue.pdfFile.asset.url

    // Upload PDF to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(pdfUrl, {
      resource_type: 'image',
      format: 'pdf',
      folder: 'pulse-magazines',
      public_id: `issue-${issueId.replace(/[^a-zA-Z0-9]/g, '-')}`,
      overwrite: true,
    })

    // Get page count from upload result or default
    const pageCount = uploadResult.pages || 30
    const images: string[] = []

    // Generate image URLs for each page using Cloudinary transformations
    for (let i = 1; i <= Math.min(pageCount, 50); i++) {
      const imageUrl = cloudinary.url(uploadResult.public_id, {
        resource_type: 'image',
        format: 'jpg',
        width: 800,
        quality: 'auto:good',
        crop: 'limit',
        page: i,
      })
      images.push(imageUrl)
    }

    return NextResponse.json({ images, pageCount })
  } catch (error) {
    console.error('PDF extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract PDF pages', details: String(error) },
      { status: 500 }
    )
  }
}
