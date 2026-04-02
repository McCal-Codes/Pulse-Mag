'use client'

import { useState } from 'react'
import Link from 'next/link'
import { urlForImage } from '@/lib/sanity.image'

interface Issue {
  _id: string
  title: string
  slug: { current: string }
  issueNumber?: number
  description?: string
  publishedAt?: string
  coverImage?: { asset?: { _ref: string } }
}

interface SubmitFormProps {
  issues: Issue[]
}

type SubmissionType = 'article' | 'poetry' | 'photography' | 'artwork' | 'interview' | 'other'

interface FormData {
  title: string
  issueId: string
  submitterName: string
  submitterEmail: string
  submissionType: SubmissionType | ''
  excerpt: string
  content: string
}

export function SubmitForm({ issues }: SubmitFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    issueId: issues[0]?._id || '',
    submitterName: '',
    submitterEmail: '',
    submissionType: '',
    excerpt: '',
    content: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setStatusMessage('Submission received! We will review it and get back to you soon.')
        setFormData({
          title: '',
          issueId: issues[0]?._id || '',
          submitterName: '',
          submitterEmail: '',
          submissionType: '',
          excerpt: '',
          content: '',
        })
      } else {
        throw new Error('Failed to submit')
      }
    } catch {
      setSubmitStatus('error')
      setStatusMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">No open issues available for submissions at this time.</p>
        <p className="text-gray-500 text-sm mt-2">Check back soon for upcoming issues.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Issues Sidebar */}
      <div className="lg:col-span-1">
        <h3 className="font-serif text-lg font-semibold mb-4 text-ink">Open Issues</h3>
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                formData.issueId === issue._id
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, issueId: issue._id }))}
            >
              {issue.coverImage && (
                <img
                  src={urlForImage(issue.coverImage)?.width(200).height(260).url() || ''}
                  alt={issue.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <h4 className="font-medium text-ink">{issue.title}</h4>
              {issue.issueNumber && (
                <p className="text-sm text-gray-500">Issue #{issue.issueNumber}</p>
              )}
              {issue.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{issue.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submission Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitStatus !== 'idle' && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="issueId" className="block text-sm font-medium text-gray-700 mb-1">
                Target Issue
              </label>
              <select
                id="issueId"
                name="issueId"
                value={formData.issueId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {issues.map((issue) => (
                  <option key={issue._id} value={issue._id}>
                    {issue.title}
                    {issue.issueNumber ? ` (Issue #${issue.issueNumber})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="submissionType" className="block text-sm font-medium text-gray-700 mb-1">
                Submission Type
              </label>
              <select
                id="submissionType"
                name="submissionType"
                value={formData.submissionType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select a type...</option>
                <option value="article">Article/Essay</option>
                <option value="poetry">Poetry</option>
                <option value="photography">Photography</option>
                <option value="artwork">Artwork</option>
                <option value="interview">Interview</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Submission Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter your submission title"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="submitterName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="submitterName"
                  name="submitterName"
                  value={formData.submitterName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="submitterEmail"
                  name="submitterEmail"
                  value={formData.submitterEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Brief Description / Pitch
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                placeholder="Brief summary of your submission (max 500 characters)"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/500 characters</p>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none font-mono text-sm"
                placeholder="Paste your full submission content here..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-500">
              By submitting, you agree to our editorial guidelines.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-ink text-paper font-medium rounded-lg hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
