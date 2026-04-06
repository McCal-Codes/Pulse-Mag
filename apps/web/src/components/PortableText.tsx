import { PortableText as PortableTextComponent } from '@portabletext/react'
import type { PortableTextComponents, PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'
import type { SanityImageSource } from '@/lib/sanity.image'

interface PortableTextImageValue {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

interface PortableTextCodeValue {
  _type: 'code'
  code: string
  language?: string
  filename?: string
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: PortableTextImageValue }) => {
      if (!value?.asset?._ref) {
        return null
      }

      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={urlFor(value as SanityImageSource).width(1200).height(675).url()}
              alt={value.alt || ''}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 700px, 100vw"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }: { value: PortableTextCodeValue }) => {
      return (
        <figure className="my-6">
          {value.filename && (
            <figcaption className="mb-2 text-xs text-gray-400">{value.filename}</figcaption>
          )}
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
            <code>{value.code}</code>
          </pre>
        </figure>
      )
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mb-6 mt-12 font-display text-3xl font-normal tracking-tight text-ink">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-10 font-display text-2xl font-normal tracking-tight text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-8 font-display text-xl font-normal tracking-tight text-ink">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-6 font-display text-lg font-medium tracking-tight text-ink">
        {children}
      </h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-7 text-gray-700">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-[var(--color-nav)] pl-6 font-display italic text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 ml-6 list-disc space-y-1 text-gray-700">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1 text-gray-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    number: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">
        {children}
      </code>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => {
      const href = value?.href || ''
      const isExternal = href.startsWith('http')
      const target = isExternal ? '_blank' : undefined
      const rel = isExternal ? 'noopener noreferrer' : undefined

      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className="text-[var(--color-nav)] underline underline-offset-2 transition-colors hover:text-ink"
        >
          {children}
        </a>
      )
    },
  },
}

interface PortableTextProps {
  value: PortableTextBlock[] | undefined
}

export function PortableText({ value }: PortableTextProps) {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }

  return <PortableTextComponent value={value} components={components} />
}
