'use client'

import React, { useState, useEffect } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, BookOpen, Loader2 } from 'lucide-react'

interface FlipbookProps {
  pdfUrl: string | null | undefined
  issueTitle: string
  issueId?: string
}

const Page = React.forwardRef<HTMLDivElement, { 
  children?: React.ReactNode
  isCover?: boolean
  isBackCover?: boolean
}>((props, ref) => {
  const { isCover, isBackCover, children } = props

  if (isCover || isBackCover) {
    return (
      <div 
        ref={ref} 
        className="page overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #d4a5a5 0%, #c99595 50%, #b88080 100%)',
          boxShadow: 'inset 0 0 60px rgba(90, 26, 34, 0.2)'
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className="page overflow-hidden bg-[#fefcfa]">
      {children}
    </div>
  )
})
Page.displayName = 'Page'

export function Flipbook({ pdfUrl, issueTitle, issueId }: FlipbookProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [pages, setPages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const flipBookRef = React.useRef<any>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isOpen || !issueId || pages.length > 0) return

    const loadPages = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/pdf-pages?issueId=${issueId}`)
        if (!res.ok) throw new Error('Failed to load PDF pages')
        const data = await res.json()
        setPages(data.images)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadPages()
  }, [isOpen, issueId, pages.length])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') flipBookRef.current?.pageFlip().flipPrev()
      else if (e.key === 'ArrowRight') flipBookRef.current?.pageFlip().flipNext()
      else if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const dims = isMobile 
    ? { width: 340, height: 480 }
    : { width: 500, height: 700 }

  if (!pdfUrl) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <BookOpen size={18} />
        <span>PDF not uploaded yet</span>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full border border-[var(--color-nav)]/30 bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-nav)] hover:bg-[var(--color-nav)] hover:text-white"
      >
        <BookOpen size={18} />
        Read Flipbook
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f5ebe0]">
      <div className="relative flex h-full max-h-[95vh] w-full max-w-[1100px] flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-[var(--color-nav)]" />
            <div>
              <h3 className="font-display text-[var(--color-nav)]">{issueTitle}</h3>
              <p className="text-xs text-[var(--color-nav)]/60">
                Page {currentPage + 1} of {pages.length + 4}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen()
                  setIsFullscreen(true)
                } else {
                  document.exitFullscreen()
                  setIsFullscreen(false)
                }
              }}
              className="p-2 text-[var(--color-nav)]/60 hover:text-[var(--color-nav)]"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-[var(--color-nav)]/60 hover:text-[var(--color-nav)]"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={48} className="animate-spin text-[var(--color-nav)]/40" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-red-600 mb-4">{error}</p>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[var(--color-nav)] text-white text-sm"
            >
              Open PDF Directly
            </a>
          </div>
        )}

        {/* Flipbook */}
        {!loading && !error && pages.length > 0 && (
          <div className="flex-1 flex items-center justify-center relative">
            
            {/* Nav arrows */}
            <button
              onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
              disabled={currentPage === 0}
              className="absolute left-2 z-20 p-3 rounded-full bg-white/80 text-[var(--color-nav)] shadow-lg disabled:opacity-0"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => flipBookRef.current?.pageFlip().flipNext()}
              disabled={currentPage >= pages.length + 3}
              className="absolute right-2 z-20 p-3 rounded-full bg-white/80 text-[var(--color-nav)] shadow-lg disabled:opacity-0"
            >
              <ChevronRight size={24} />
            </button>

            <HTMLFlipBook
              ref={flipBookRef}
              width={dims.width}
              height={dims.height}
              size="stretch"
              minWidth={300}
              maxWidth={600}
              minHeight={400}
              maxHeight={800}
              showCover={true}
              onFlip={(e) => setCurrentPage(e.data)}
              className="drop-shadow-2xl"
              flippingTime={600}
              usePortrait={false}
              style={{}}
              startPage={0}
              drawShadow={true}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.5}
              showPageCorners={true}
              disableFlipByClick={false}
              swipeDistance={30}
              clickEventForward={true}
              useMouseEvents={true}
              renderOnlyPageLengthChange={false}
              mobileScrollSupport={true}
            >
              {/* Front Cover */}
              <Page isCover>
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white">
                  <h1 className="font-display text-3xl">{issueTitle}</h1>
                  <p className="mt-4 text-sm tracking-widest">PULSE MAGAZINE</p>
                </div>
              </Page>

              {/* Inside Cover */}
              <Page>
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center text-[var(--color-nav)]/60">
                    <p className="font-display text-xl">Pulse</p>
                    <p className="text-xs mt-2">pulseliterary.com</p>
                  </div>
                </div>
              </Page>

              {/* PDF Pages as Images */}
              {pages.map((imgSrc, i) => (
                <Page key={i}>
                  <div className="h-full w-full flex items-center justify-center p-2">
                    <img 
                      src={imgSrc} 
                      alt={`Page ${i + 1}`}
                      className="max-w-full max-h-full object-contain shadow-lg"
                    />
                  </div>
                </Page>
              ))}

              {/* Back Cover */}
              <Page isBackCover>
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white">
                  <p className="font-display text-2xl">PULSE</p>
                  <p className="text-xs mt-2">Thank You for Reading</p>
                </div>
              </Page>
            </HTMLFlipBook>
          </div>
        )}
      </div>
    </div>
  )
}
