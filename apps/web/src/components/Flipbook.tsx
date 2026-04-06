'use client'

import React, { useRef, useEffect, useCallback } from 'react'
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
  isMobile?: boolean
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
          <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${props.isMobile ? 'p-4' : 'p-8'}`}>
            <div className={`rounded-full bg-gray-200 ${props.isMobile ? 'p-2' : 'p-4'}`}>
              <span className={`font-display text-gray-400 ${props.isMobile ? 'text-lg' : 'text-2xl'}`}>{props.number}</span>
            </div>
            <p className={`mt-4 text-gray-400 ${props.isMobile ? 'text-xs' : 'text-sm'}`}>Content loading...</p>
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
  const [isMobile, setIsMobile] = useState(false)
  const [totalPages] = useState(20) // Placeholder - would be actual PDF page count
  const flipBookRef = useRef<HTMLFlipBook>(null)
  const touchStartX = useRef<number | null>(null)

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Touch/swipe handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    const minSwipeDistance = 50

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe left - go to next page
        flipBookRef.current?.pageFlip().flipNext()
      } else {
        // Swipe right - go to previous page
        flipBookRef.current?.pageFlip().flipPrev()
      }
    }
    touchStartX.current = null
  }, [])

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

  // Responsive dimensions based on screen size
  const getDimensions = () => {
    if (isMobile) {
      return {
        width: 320,
        height: 480,
        minWidth: 280,
        maxWidth: 340,
        minHeight: 400,
        maxHeight: 520,
      }
    }
    return {
      width: 500,
      height: 700,
      minWidth: 300,
      maxWidth: 500,
      minHeight: 400,
      maxHeight: 700,
    }
  }

  const dims = getDimensions()

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`relative flex h-full ${isMobile ? 'max-h-[98vh]' : 'max-h-[95vh]'} w-full ${isMobile ? 'max-w-full' : 'max-w-[1200px]'} flex-col`}>
        {/* Header with controls */}
        <div className={`flex items-center justify-between ${isMobile ? 'px-2 py-2' : 'px-4 py-3'}`}>
          <div className="flex items-center gap-2 sm:gap-4">
            <h3 className={`font-display text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>{issueTitle}</h3>
            <span className={`text-white/60 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {currentPage + 1}/{totalPages + 2}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <button
                onClick={toggleFullscreen}
                className="rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className={`rounded-full text-white/80 transition-all hover:bg-white/10 hover:text-white ${isMobile ? 'p-1.5' : 'p-2'}`}
              title="Close (Esc)"
            >
              <X size={isMobile ? 20 : 24} />
            </button>
          </div>
        </div>

        {/* Flipbook container */}
        <div className="relative flex flex-1 items-center justify-center">
          {/* Previous button - hidden on mobile (use swipe instead) */}
          {!isMobile && (
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="absolute left-0 z-10 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 lg:left-4"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Flipbook */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={dims.width}
            height={dims.height}
            size="stretch"
            minWidth={dims.minWidth}
            maxWidth={dims.maxWidth}
            minHeight={dims.minHeight}
            maxHeight={dims.maxHeight}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={(e) => setCurrentPage(e.data)}
            className="flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={600}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={!isMobile}
            disableFlipByClick={false}
          >
            {/* Cover page */}
            <div className="page cover overflow-hidden rounded-r-lg bg-[var(--color-nav)] text-white shadow-2xl">
              <div className={`flex h-full flex-col items-center justify-center bg-gradient-to-br from-[var(--color-nav)] to-[#2a0f12] text-center ${isMobile ? 'p-4' : 'p-10'}`}>
                <div className={`rounded-full border-2 border-white/20 ${isMobile ? 'mb-3 p-2' : 'mb-6 p-4'}`}>
                  <span className={`font-display text-white/30 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>✦</span>
                </div>
                <h2 className={`font-display leading-tight ${isMobile ? 'text-xl' : 'text-4xl'}`}>{issueTitle}</h2>
                <div className={`bg-white/30 ${isMobile ? 'mt-3 h-px w-16' : 'mt-6 h-px w-24'}`} />
                <p className={`font-medium tracking-widest text-white/70 ${isMobile ? 'mt-3 text-xs' : 'mt-6 text-sm'}`}>
                  PULSE
                </p>
                <p className={`text-white/50 ${isMobile ? 'mt-2 text-[10px]' : 'mt-8 text-xs'}`}>Tap to read</p>
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
                <div className={`flex h-full flex-col ${isMobile ? 'p-4' : 'p-10'}`}>
                  {/* Page header */}
                  <div className={`flex items-center justify-between border-b border-black/10 ${isMobile ? 'mb-3 pb-2' : 'mb-6 pb-4'}`}>
                    <span className={`font-medium tracking-widest text-gray-400 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                      PULSE
                    </span>
                    <span className={`text-gray-300 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{i + 1}</span>
                  </div>

                  {/* Placeholder content - skeleton loading style */}
                  <div className={`flex-1 ${isMobile ? 'space-y-2' : 'space-y-4'}`}>
                    <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-3/4' : 'h-4 w-3/4'}`} />
                    <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-full' : 'h-4 w-full'}`} />
                    <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-5/6' : 'h-4 w-5/6'}`} />
                    <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-4/5' : 'h-4 w-4/5'}`} />
                    <div className={`rounded bg-gray-100 ${isMobile ? 'mt-2 h-2 w-full' : 'mt-4 h-4 w-full'}`} />
                    <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-11/12' : 'h-4 w-11/12'}`} />
                    <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-full' : 'h-4 w-full'}`} />
                    <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-3/4' : 'h-4 w-3/4'}`} />
                  </div>

                  {/* Page footer */}
                  <div className={`flex items-center justify-between border-t border-black/10 ${isMobile ? 'mt-auto pt-2' : 'mt-auto pt-4'}`}>
                    <span className={`text-gray-300 ${isMobile ? 'text-[8px]' : 'text-[0.6rem]'}`}>{issueTitle}</span>
                    <span className={`text-gray-300 ${isMobile ? 'text-[8px]' : 'text-[0.6rem]'}`}>
                      {i + 1} / {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Back cover */}
            <div className="page cover overflow-hidden rounded-l-lg bg-[var(--color-nav)] text-white shadow-2xl">
              <div className={`flex h-full flex-col items-center justify-center bg-gradient-to-br from-[var(--color-nav)] to-[#2a0f12] text-center ${isMobile ? 'p-4' : 'p-10'}`}>
                <p className={`font-display ${isMobile ? 'text-2xl' : 'text-3xl'}`}>✦</p>
                <p className={`font-display ${isMobile ? 'mt-3 text-xl' : 'mt-6 text-2xl'}`}>PULSE</p>
                <div className={`bg-white/30 ${isMobile ? 'mt-3 h-px w-12' : 'mt-6 h-px w-20'}`} />
                <p className={`text-white/70 ${isMobile ? 'mt-3 text-xs' : 'mt-6 text-sm'}`}>pulseliterary.com</p>
                <p className={`text-white/50 ${isMobile ? 'mt-1 text-[10px]' : 'mt-2 text-xs'}`}>Thank you for reading</p>
              </div>
            </div>
          </HTMLFlipBook>

          {/* Next button - hidden on mobile (use swipe instead) */}
          {!isMobile && (
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages + 1}
              className="absolute right-0 z-10 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 lg:right-4"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>

        {/* Mobile swipe hint */}
        {isMobile && (
          <div className="px-4 py-2 text-center">
            <p className="text-xs text-white/50">Swipe left/right to turn pages</p>
          </div>
        )}

        {/* Progress bar */}
        <div className={`px-4 ${isMobile ? 'py-2' : 'py-3'}`}>
          <div className="flex items-center gap-3">
            <span className={`text-white/60 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>0%</span>
            <div className="flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-1 rounded-full bg-white/80 transition-all duration-300"
                style={{
                  width: `${((currentPage + 1) / (totalPages + 2)) * 100}%`,
                }}
              />
            </div>
            <span className={`text-white/60 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>100%</span>
          </div>
          {!isMobile && (
            <p className="mt-2 text-center text-xs text-white/40">
              Use arrow keys ← → or click pages to navigate
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
