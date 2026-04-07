'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize, Minimize, BookOpen } from 'lucide-react'

interface FlipbookProps {
  pdfUrl: string
  issueTitle: string
}

// Page component with realistic paper styling
const Page = React.forwardRef<HTMLDivElement, { 
  number?: number
  isCover?: boolean
  isBackCover?: boolean
  isRight?: boolean
  children?: React.ReactNode
}>((props, ref) => {
  const { isCover, isBackCover, isRight, children } = props
  
  // Paper texture background - warm cream tones
  const paperTexture = {
    backgroundImage: `
      linear-gradient(to right, rgba(139, 90, 90, 0.03) 0%, transparent 5%, transparent 95%, rgba(139, 90, 90, 0.03) 100%),
      linear-gradient(to bottom, #fefcfa 0%, #fdf9f4 100%)
    `,
    boxShadow: isRight 
      ? 'inset -15px 0 30px -15px rgba(139, 90, 90, 0.06)' 
      : 'inset 15px 0 30px -15px rgba(139, 90, 90, 0.06)'
  }

  if (isCover || isBackCover) {
    return (
      <div 
        ref={ref} 
        className="page overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #d4a5a5 0%, #c99595 50%, #b88080 100%)',
          boxShadow: 'inset 0 0 60px rgba(90, 26, 34, 0.2), 0 4px 20px rgba(0,0,0,0.2)'
        }}
      >
        <div className="h-full w-full">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={ref} 
      className="page overflow-hidden"
      style={paperTexture}
    >
      {/* Book spine shadow effect - warm tone */}
      <div 
        className="absolute top-0 bottom-0 w-8 pointer-events-none"
        style={{
          left: isRight ? 0 : 'auto',
          right: isRight ? 'auto' : 0,
          background: isRight 
            ? 'linear-gradient(to right, rgba(139, 90, 90, 0.06) 0%, transparent 100%)'
            : 'linear-gradient(to left, rgba(139, 90, 90, 0.06) 0%, transparent 100%)'
        }}
      />
      <div className="relative h-full w-full">
        {children}
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
  const [totalPages] = useState(16)
  const flipBookRef = useRef<any>(null)
  const touchStartX = useRef<number | null>(null)

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Keyboard navigation
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

  // Touch/swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) flipBookRef.current?.pageFlip().flipNext()
      else flipBookRef.current?.pageFlip().flipPrev()
    }
    touchStartX.current = null
  }, [])

  const handlePrev = () => flipBookRef.current?.pageFlip().flipPrev()
  const handleNext = () => flipBookRef.current?.pageFlip().flipNext()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const dims = isMobile 
    ? { width: 340, height: 480, minWidth: 300, maxWidth: 380, minHeight: 420, maxHeight: 520 }
    : { width: 580, height: 800, minWidth: 480, maxWidth: 600, minHeight: 650, maxHeight: 820 }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 rounded-full border border-[var(--color-nav)]/30 bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-nav)] transition-all hover:bg-[var(--color-nav)] hover:text-white hover:shadow-lg"
      >
        <BookOpen size={18} />
        Read Flipbook
      </button>
    )
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ background: 'linear-gradient(135deg, #f5ebe0 0%, #f0e4d7 50%, #e8d9c9 100%)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Soft ambient lighting */}
      <div className="absolute inset-0 opacity-40" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)'
      }} />

      <div className={`relative flex h-full ${isMobile ? 'max-h-[98vh]' : 'max-h-[95vh]'} w-full ${isMobile ? 'max-w-full' : 'max-w-[1200px]'} flex-col`}>
        
        {/* Elegant header */}
        <div className={`flex items-center justify-between ${isMobile ? 'px-2 py-2' : 'px-6 py-4'} relative z-10`}>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-nav)]/10">
              <BookOpen size={16} className="text-[var(--color-nav)]" />
            </div>
            <div>
              <h3 className={`font-display text-[var(--color-nav)] ${isMobile ? 'text-sm' : 'text-lg'}`}>{issueTitle}</h3>
              <p className={`text-[var(--color-nav)]/60 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                Page {currentPage + 1} of {totalPages + 2}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <button
                onClick={toggleFullscreen}
                className="rounded-full p-2 text-[var(--color-nav)]/60 transition-all hover:bg-[var(--color-nav)]/10 hover:text-[var(--color-nav)]"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className={`rounded-full text-[var(--color-nav)]/60 transition-all hover:bg-[var(--color-nav)]/10 hover:text-[var(--color-nav)] ${isMobile ? 'p-1.5' : 'p-2'}`}
            >
              <X size={isMobile ? 18 : 20} />
            </button>
          </div>
        </div>

        {/* Book container with shadow */}
        <div className="relative flex flex-1 items-center justify-center">
            {/* Decorative shelf shadow - soft warm tone */}
          <div 
            className="absolute -bottom-2 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-full blur-2xl"
            style={{ background: 'rgba(139, 90, 90, 0.2)' }}
          />

          {/* Navigation arrows - warm tones */}
          {!isMobile && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="absolute left-2 z-20 rounded-full bg-white/80 p-3 text-[var(--color-nav)] shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-0 lg:left-8"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage >= totalPages + 1}
                className="absolute right-2 z-20 rounded-full bg-white/80 p-3 text-[var(--color-nav)] shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-0 lg:right-8"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* The Flipbook - two page spread mode */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={dims.width}
            height={dims.height}
            size="stretch"
            minWidth={dims.minWidth}
            maxWidth={dims.maxWidth}
            minHeight={dims.minHeight}
            maxHeight={dims.maxHeight}
            maxShadowOpacity={0.25}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={(e) => setCurrentPage(e.data)}
            className="drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(90, 26, 34, 0.2))' }}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={40}
            showPageCorners={!isMobile}
            disableFlipByClick={false}
          >
            {/* Front Cover - pastel rose */}
            <Page number={0} isCover>
              <div className="flex h-full flex-col items-center justify-center p-6 sm:p-10 text-center">
                {/* Decorative border */}
                <div className="absolute inset-4 sm:inset-6 border-2 border-white/40 rounded-sm" />
                <div className="absolute inset-5 sm:inset-8 border border-white/20 rounded-sm" />
                
                {/* Logo mark */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-white/50 bg-white/10">
                    <span className="font-display text-2xl sm:text-3xl text-white/80">✦</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-display text-2xl sm:text-4xl text-white leading-tight drop-shadow-sm">
                  {issueTitle}
                </h1>
                
                {/* Decorative line */}
                <div className="my-4 sm:my-6 flex items-center gap-3">
                  <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/50" />
                  <span className="text-xs sm:text-sm text-white/70 tracking-widest">ISSUE</span>
                  <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/50" />
                </div>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-white/80 tracking-[0.15em] uppercase">
                  Pulse Literary & Arts
                </p>

                {/* Tap hint */}
                <div className="absolute bottom-8 sm:bottom-12">
                  <p className="text-[10px] sm:text-xs text-white/60 animate-pulse">
                    {isMobile ? 'Tap to open' : 'Click to open'}
                  </p>
                </div>
              </div>
            </Page>

            {/* Inside cover - left */}
            <Page number={1} isRight={false}>
              <div className="flex h-full flex-col items-center justify-center p-6 sm:p-8">
                <div className="text-center">
                  <p className="font-display text-xl sm:text-2xl text-[var(--color-nav)]/70">Pulse</p>
                  <p className="mt-2 text-xs text-[var(--color-nav)]/50">pulseliterary.com</p>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-[10px] sm:text-xs text-[var(--color-nav)]/40 leading-relaxed">
                    Essays, dispatches, and criticism<br/>about what survives the algorithm
                  </p>
                </div>
              </div>
            </Page>

            {/* Content pages - in spread mode, HTMLFlipBook pairs them automatically */}
            {Array.from({ length: totalPages }, (_, i) => {
              // In spread mode, we don't need to track left/right - the library handles it
              const isEven = i % 2 === 0
              return (
                <Page key={i} number={i + 2}>
                  <div className={`flex h-full flex-col ${isMobile ? 'p-4' : 'p-6'}`}>
                    {/* Page header */}
                    <div className={`flex items-center justify-between border-b border-[var(--color-nav)]/10 ${isMobile ? 'mb-3 pb-1.5' : 'mb-4 pb-2'}`}>
                      <span className={`font-medium tracking-[0.2em] text-[var(--color-nav)]/40 uppercase ${isMobile ? 'text-[8px]' : 'text-[9px]'}`}>
                        Pulse
                      </span>
                      <span className={`font-display text-[var(--color-nav)]/30 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {i + 1}
                      </span>
                    </div>

                    {/* Content placeholder */}
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      {/* Title - only on right pages (odd indices in 0-based) */}
                      {!isEven && (
                        <div className={`rounded bg-gradient-to-r from-[var(--color-nav)]/10 to-[var(--color-nav)]/5 ${isMobile ? 'h-4 w-4/5' : 'h-5 w-3/4'}`} />
                      )}
                      
                      {/* Paragraph blocks */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-full' : 'h-2 w-full'}`} />
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-11/12' : 'h-2 w-11/12'}`} />
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-full' : 'h-2 w-full'}`} />
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-4/5' : 'h-2 w-4/5'}`} />
                      </div>

                      {/* Second paragraph */}
                      <div className="space-y-1.5 sm:space-y-2 pt-1">
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-full' : 'h-2 w-full'}`} />
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-5/6' : 'h-2 w-5/6'}`} />
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-full' : 'h-2 w-full'}`} />
                      </div>

                      {/* Image placeholder - only on some pages */}
                      {i % 4 === 1 && (
                        <div className={`mt-3 rounded bg-gradient-to-br from-[var(--color-nav)]/10 to-[var(--color-nav)]/5 ${isMobile ? 'h-16' : 'h-24'}`} />
                      )}

                      {/* Third paragraph */}
                      <div className="space-y-1.5 sm:space-y-2 pt-1">
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-full' : 'h-2 w-full'}`} />
                        <div className={`rounded bg-[var(--color-nav)]/5 ${isMobile ? 'h-1.5 w-3/4' : 'h-2 w-3/4'}`} />
                      </div>
                    </div>

                    {/* Page footer */}
                    <div className={`flex items-center justify-between border-t border-[var(--color-nav)]/10 ${isMobile ? 'mt-auto pt-2' : 'mt-auto pt-3'}`}>
                      <span className={`text-[var(--color-nav)]/30 ${isMobile ? 'text-[7px]' : 'text-[8px]'}`}>
                        {issueTitle}
                      </span>
                      <span className={`text-[var(--color-nav)]/30 ${isMobile ? 'text-[7px]' : 'text-[8px]'}`}>
                        {Math.floor(i / 2) + 1}
                      </span>
                    </div>
                  </div>
                </Page>
              )
            })}

            {/* Inside back cover - left */}
            <Page number={totalPages + 2} isRight={false}>
              <div className="flex h-full flex-col items-center justify-center p-6 sm:p-8 text-center">
                <div className="mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-nav)]/10">
                    <span className="font-display text-xl text-[var(--color-nav)]/70">✦</span>
                  </div>
                </div>
                <p className="font-display text-lg text-[var(--color-nav)]/60">Thank You for Reading</p>
                <p className="mt-2 text-xs text-[var(--color-nav)]/40">
                  Pulse Literary & Arts Magazine
                </p>
                <div className="mt-6">
                  <p className="text-[10px] text-[var(--color-nav)]/30">
                    Visit us at<br/>
                    <span className="text-[var(--color-nav)]/50">pulseliterary.com</span>
                  </p>
                </div>
              </div>
            </Page>

            {/* Back Cover - pastel rose */}
            <Page number={totalPages + 3} isBackCover>
              <div className="flex h-full flex-col items-center justify-center p-6 sm:p-10 text-center">
                <div className="absolute inset-4 sm:inset-6 border-2 border-white/40 rounded-sm" />
                
                <div className="mb-4">
                  <span className="font-display text-4xl sm:text-5xl text-white/90">✦</span>
                </div>
                
                <p className="font-display text-xl sm:text-2xl text-white">PULSE</p>
                
                <div className="my-4 flex items-center gap-2">
                  <div className="h-px w-8 bg-white/40" />
                  <span className="text-[10px] text-white/60">EST. 2024</span>
                  <div className="h-px w-8 bg-white/40" />
                </div>

                <p className="text-xs text-white/70">
                  Pittsburgh Literary & Arts Magazine
                </p>

                {/* Barcode placeholder */}
                <div className="mt-6 sm:mt-8">
                  <div className="h-8 w-24 bg-white/20 rounded" />
                </div>
              </div>
            </Page>
          </HTMLFlipBook>
        </div>

        {/* Bottom controls - warm tones */}
        <div className={`relative z-10 ${isMobile ? 'px-3 py-2' : 'px-6 py-4'}`}>
          {/* Progress bar */}
          <div className="mx-auto max-w-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`text-[var(--color-nav)]/40 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                {Math.round(((currentPage + 1) / (totalPages + 2)) * 100)}%
              </span>
              <div className="flex-1 overflow-hidden rounded-full bg-[var(--color-nav)]/10 h-1">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-nav)]/40 to-[var(--color-nav)]/60 transition-all duration-500"
                  style={{ width: `${((currentPage + 1) / (totalPages + 2)) * 100}%` }}
                />
              </div>
            </div>
            
            {isMobile && (
              <p className="mt-2 text-center text-[10px] text-[var(--color-nav)]/40">
                Swipe to turn pages
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
