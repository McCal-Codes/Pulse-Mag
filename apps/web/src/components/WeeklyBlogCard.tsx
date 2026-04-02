import Link from 'next/link'
import { urlFor } from '@/lib/sanity.image'

interface WeeklyBlog {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  weekNumber?: number
  year?: number
  featuredImage?: { asset?: { _ref: string } }
}

interface WeeklyBlogCardProps {
  blog: WeeklyBlog
}

export function WeeklyBlogCard({ blog }: WeeklyBlogCardProps) {
  const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const weekLabel = blog.weekNumber && blog.year
    ? `Week ${blog.weekNumber}, ${blog.year}`
    : null

  return (
    <Link
      href={`/weekly/${blog.slug.current}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row">
        {blog.featuredImage && (
          <div className="sm:w-48 flex-shrink-0">
            <img
              src={urlFor(blog.featuredImage).width(200).height(150).url()}
              alt={blog.title}
              className="w-full h-32 sm:h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Weekly Update
            </span>
            {weekLabel && (
              <span className="text-xs text-gray-500">• {weekLabel}</span>
            )}
          </div>
          <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-accent transition-colors mb-2">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{blog.excerpt}</p>
          )}
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>
    </Link>
  )
}
