// Script to import issues to Sanity
// Usage: cd apps/studio && node import-issues.js

const { createClient } = require('@sanity/client')

// Hardcoded config from .env.local (since Node doesn't auto-load .env files)
const PROJECT_ID = '4iudbup2'
const DATASET = 'production'
const TOKEN = 'REMOVED_SANITY_TOKEN'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

// Issues matching the PDFs in the pdfs/ folder
const issuesToImport = [
  {
    _id: 'issue-image-doc',
    _type: 'issue',
    title: 'Image Test Issue',
    slug: { _type: 'slug', current: 'image-test-issue' },
    season: 'Spring 2026',
    status: 'current',
    issueNumber: 1,
    summary: 'Test issue with high-resolution images. Perfect for testing the flipbook image rendering and PDF text extraction.',
    windowText: 'Testing image-heavy PDF upload',
    statusNote: '6 pages with images - testing flipbook viewer',
    publishedAt: '2026-04-01T00:00:00.000Z',
  },
  {
    _id: 'issue-sample-report',
    _type: 'issue',
    title: 'Sample Report Issue',
    slug: { _type: 'slug', current: 'sample-report-issue' },
    season: 'Summer 2026',
    status: 'upcoming',
    issueNumber: 2,
    summary: 'Multi-page report with text, images, and tables. Testing complex layout rendering and pagination in the flipbook.',
    windowText: '10-page report format test',
    statusNote: 'Tables and mixed content testing',
    publishedAt: '2026-07-01T00:00:00.000Z',
  },
  {
    _id: 'issue-large-doc',
    _type: 'issue',
    title: 'Large Document Test',
    slug: { _type: 'slug', current: 'large-document-test' },
    season: 'Autumn 2026',
    status: 'upcoming',
    issueNumber: 3,
    summary: 'Large 100-page document for testing PDF loading times, memory handling, and flipbook performance with substantial content.',
    windowText: '100-page stress test',
    statusNote: 'Large file handling test (36MB)',
    publishedAt: '2026-10-01T00:00:00.000Z',
  },
]

async function importIssues() {
  console.log('Importing issues to Sanity...\n')

  for (const issue of issuesToImport) {
    try {
      // Check if document already exists
      const existing = await client.fetch(`*[_id == "${issue._id}"][0]`)
      
      if (existing) {
        console.log(`⚠️  Issue "${issue.title}" already exists (skipping)`)
        continue
      }

      // Create the document
      const result = await client.create(issue)
      console.log(`✅ Created: "${issue.title}" (${result._id})`)
    } catch (err) {
      console.error(`❌ Failed to create "${issue.title}":`, err.message)
    }
  }

  console.log('\n✨ Import complete!')
  console.log('\nNext steps:')
  console.log('1. Open Sanity Studio: http://localhost:3333')
  console.log('2. Go to Magazine Content → Issues')
  console.log('3. Open each issue and upload the PDF file')
  console.log('4. Click Publish on each issue')
}

importIssues()
