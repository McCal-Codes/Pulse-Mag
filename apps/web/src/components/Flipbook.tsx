'use client'

import React, { useRef, useEffect } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react'

interface FlipbookProps {
  pdfUrl: string
  issueTitle: string
}

interface PageProps {
  number: number
  imageUrl?: string
  content?: React.ReactNode
}

// Page component for the flipbook
const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div ref={ref} className="page bg-white shadow-lg">
      <div className="page-content h-full w-full overflow-hidden">
        {props.imageUrl ? (
          <img
            src={props.imageUrl}
            alt={`Page ${props.number}`}
            className="h-full w-full object-contain"
          />
        ) : props.content ? (
          props.content
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="rounded-full bg-gray-200 p-4">
              <span className="text-2xl font-display text-gray-400">{props.number}</span>
            </div>
            <p className="mt-4 text-sm text-gray-400">Content loading...</p>
          </div>
        )}
      </div>
    </div>
  )
})
Page.displayName = 'Page'

export function Flipbook({ pdfUrl: _pdfUrl, issueTitle }: FlipbookProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [totalPages] = useState(20) // Placeholder - would be actual PDF page count
  const flipBookRef = useRef<HTMLFlipBook>(null)

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        flipBookRef.current?.pageFlip().flipPrev()
      } else if (e.key === 'ArrowRight') {
        flipBookRef.current?.pageFlip().flipNext()
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handlePrev = () => {
    flipBookRef.current?.pageFlip().flipPrev()
  }

  const handleNext = () => {
    flipBookRef.current?.pageFlip().flipNext()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-black/15 bg-white px-6 py-2.5 text-sm font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)] hover:shadow-md"
      >
        Read Flipbook
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative flex h-full max-h-[95vh] w-full max-w-[1200px] flex-col">
        {/* Header with controls */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <h3 className="font-display text-lg text-white">{issueTitle}</h3>
            <span className="text-sm text-white/60">
              Page {currentPage + 1} of {totalPages + 2}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              title="Close (Esc)"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Flipbook container */}
        <div className="relative flex flex-1 items-center justify-center">
          {/* Previous button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="absolute left-0 z-10 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 lg:left-4"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Flipbook */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={500}
            height={700}
            size="stretch"
            minWidth={300}
            maxWidth={500}
            minHeight={400}
            maxHeight={700}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={(e) => setCurrentPage(e.data)}
            className="flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {/* Cover page */}
            <div className="page cover overflow-hidden rounded-r-lg bg-[var(--color-nav)] text-white shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[var(--color-nav)] to-[#2a0f12] p-10 text-center">
                <div className="mb-6 rounded-full border-2 border-white/20 p-4">
                  <span className="font-display text-4xl text-white/30">✦</span>
                </div>
                <h2 className="font-display text-4xl leading-tight">{issueTitle}</h2>
                <div className="mt-6 h-px w-24 bg-white/30" />
                <p className="mt-6 text-sm font-medium tracking-widest text-white/70">
                  PULSE LITERARY & ARTS MAGAZINE
                </p>
                <p className="mt-8 text-xs text-white/50">Click to begin reading</p>
              </div>
            </div>

            {/* Content pages */}
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i}
                className={`page overflow-hidden bg-white shadow-lg ${
                  i % 2 === 0 ? 'rounded-r-lg' : 'rounded-l-lg'
                }`}
              >
                <div className="flex h-full flex-col p-10">
                  {/* Page header */}
                  <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
                    <span className="text-xs font-medium tracking-widest text-gray-400">
                      PULSE
                    </span>
                    <span className="text-xs text-gray-300">{i + 1}</span>
                  </div>

                  {/* Placeholder content - skeleton loading style */}
                  <div className="flex-1 space-y-4">
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-5/6 rounded bg-gray-100" />
                    <div className="h-4 w-4/5 rounded bg-gray-100" />
                    <div className="mt-4 h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-11/12 rounded bg-gray-100" />
                    <div className="h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                  </div>

                  {/* Page footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-4">
                    <span className="text-[0.6rem] text-gray-300">{issueTitle}</span>
                    <span className="text-[0.6rem] text-gray-300">
                      {i + 1} / {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Back cover */}
            <div className="page cover overflow-hidden rounded-l-lg bg-[var(--color-nav)] text-white shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[var(--color-nav)] to-[#2a0f12] p-10 text-center">
                <p className="font-display text-3xl">✦</p>
                <p className="mt-6 font-display text-2xl">PULSE</p>
                <div className="mt-6 h-px w-20 bg-white/30" />
                <p className="mt-6 text-sm text-white/70">pulseliterary.com</p>
                <p className="mt-2 text-xs text-white/50">Thank you for reading</p>
              </div>
            </div>
          </HTMLFlipBook>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages + 1}
            className="absolute right-0 z-10 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 lg:right-4"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60">0%</span>
            <div className="flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-1 rounded-full bg-white/80 transition-all duration-300"
                style={{
                  width: `${((currentPage + 1) / (totalPages + 2)) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-white/60">100%</span>
          </div>
          <p className="mt-2 text-center text-xs text-white/40">
            Use arrow keys ← → or click pages to navigate
          </p>
        </div>
      </div>
    </div>
  )
}
