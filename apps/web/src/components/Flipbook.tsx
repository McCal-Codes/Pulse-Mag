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
  
  // Paper texture background
  const paperTexture = {
    backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.02) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%),
      linear-gradient(to bottom, #faf9f7 0%, #f5f4f0 100%)
    `,
    boxShadow: isRight 
      ? 'inset -15px 0 30px -15px rgba(0,0,0,0.1)' 
      : 'inset 15px 0 30px -15px rgba(0,0,0,0.1)'
  }

  if (isCover || isBackCover) {
    return (
      <div 
        ref={ref} 
        className="page overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #5a1a22 0%, #3d1218 50%, #2a0f12 100%)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)'
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
      {/* Book spine shadow effect */}
      <div 
        className="absolute top-0 bottom-0 w-8 pointer-events-none"
        style={{
          left: isRight ? 0 : 'auto',
          right: isRight ? 'auto' : 0,
          background: isRight 
            ? 'linear-gradient(to right, rgba(0,0,0,0.08) 0%, transparent 100%)'
            : 'linear-gradient(to left, rgba(0,0,0,0.08) 0%, transparent 100%)'
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
    ? { width: 340, height: 480, minWidth: 300, maxWidth: 360, minHeight: 420, maxHeight: 520 }
    : { width: 520, height: 720, minWidth: 400, maxWidth: 520, minHeight: 550, maxHeight: 720 }

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
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient lighting effect */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)'
      }} />

      <div className={`relative flex h-full ${isMobile ? 'max-h-[98vh]' : 'max-h-[95vh]'} w-full ${isMobile ? 'max-w-full' : 'max-w-[1200px]'} flex-col`}>
        
        {/* Elegant header */}
        <div className={`flex items-center justify-between ${isMobile ? 'px-2 py-2' : 'px-6 py-4'} relative z-10`}>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <BookOpen size={16} className="text-white/80" />
            </div>
            <div>
              <h3 className={`font-display text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>{issueTitle}</h3>
              <p className={`text-white/50 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                Page {currentPage + 1} of {totalPages + 2}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <button
                onClick={toggleFullscreen}
                className="rounded-full p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className={`rounded-full text-white/60 transition-all hover:bg-white/10 hover:text-white ${isMobile ? 'p-1.5' : 'p-2'}`}
            >
              <X size={isMobile ? 18 : 20} />
            </button>
          </div>
        </div>

        {/* Book container with shadow */}
        <div className="relative flex flex-1 items-center justify-center">
          {/* Decorative shelf shadow */}
          <div 
            className="absolute bottom-0 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-full blur-xl"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          />

          {/* Navigation arrows */}
          {!isMobile && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="absolute left-2 z-20 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-0 lg:left-8"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage >= totalPages + 1}
                className="absolute right-2 z-20 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-0 lg:right-8"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* The Flipbook */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={dims.width}
            height={dims.height}
            size="stretch"
            minWidth={dims.minWidth}
            maxWidth={dims.maxWidth}
            minHeight={dims.minHeight}
            maxHeight={dims.maxHeight}
            maxShadowOpacity={0.4}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={(e) => setCurrentPage(e.data)}
            className="drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))' }}
            startPage={0}
            drawShadow={true}
            flippingTime={700}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={40}
            showPageCorners={!isMobile}
            disableFlipByClick={false}
          >
            {/* Front Cover */}
            <Page number={0} isCover>
              <div className="flex h-full flex-col items-center justify-center p-6 sm:p-10 text-center">
                {/* Decorative border */}
                <div className="absolute inset-4 sm:inset-6 border border-white/20" />
                <div className="absolute inset-5 sm:inset-8 border border-white/10" />
                
                {/* Logo mark */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/5">
                    <span className="font-display text-xl sm:text-3xl text-white/60">✦</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-display text-2xl sm:text-5xl text-white leading-tight">
                  {issueTitle}
                </h1>
                
                {/* Decorative line */}
                <div className="my-4 sm:my-6 flex items-center gap-3">
                  <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-white/40" />
                  <span className="text-xs sm:text-sm text-white/50 tracking-widest">ISSUE</span>
                  <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-white/40" />
                </div>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-white/60 tracking-[0.2em] uppercase">
                  Pulse Literary & Arts
                </p>

                {/* Tap hint */}
                <div className="absolute bottom-8 sm:bottom-12">
                  <p className="text-[10px] sm:text-xs text-white/40 animate-pulse">
                    {isMobile ? 'Tap to open' : 'Click to open'}
                  </p>
                </div>
              </div>
            </Page>

            {/* Inside cover - left */}
            <Page number={1} isRight={false}>
              <div className="flex h-full flex-col items-center justify-center p-6 sm:p-8">
                <div className="text-center">
                  <p className="font-display text-lg sm:text-xl text-gray-400">Pulse</p>
                  <p className="mt-2 text-xs text-gray-300">pulseliterary.com</p>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-[10px] text-gray-300 leading-relaxed">
                    Essays, dispatches, and criticism<br/>about what survives the algorithm
                  </p>
                </div>
              </div>
            </Page>

            {/* Content pages */}
            {Array.from({ length: totalPages }, (_, i) => {
              const isRightPage = i % 2 === 1
              return (
                <Page key={i} number={i + 2} isRight={isRightPage}>
                  <div className={`flex h-full flex-col ${isMobile ? 'p-5' : 'p-8'}`}>
                    {/* Page header with elegant styling */}
                    <div className={`flex items-center justify-between border-b border-gray-200 ${isMobile ? 'mb-4 pb-2' : 'mb-6 pb-3'}`}>
                      <span className={`font-medium tracking-[0.2em] text-gray-400 uppercase ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
                        Pulse
                      </span>
                      <span className={`font-display text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {i + 1}
                      </span>
                    </div>

                    {/* Content placeholder with realistic text blocks */}
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      {/* Title block */}
                      <div className={`rounded bg-gradient-to-r from-gray-200 to-gray-100 ${isMobile ? 'h-5 w-4/5' : 'h-7 w-3/4'}`} />
                      
                      {/* Paragraph blocks */}
                      <div className="space-y-2 sm:space-y-3 pt-2">
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-full' : 'h-3 w-full'}`} />
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-11/12' : 'h-3 w-11/12'}`} />
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-full' : 'h-3 w-full'}`} />
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-4/5' : 'h-3 w-4/5'}`} />
                      </div>

                      {/* Second paragraph */}
                      <div className="space-y-2 sm:space-y-3 pt-2">
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-full' : 'h-3 w-full'}`} />
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-5/6' : 'h-3 w-5/6'}`} />
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-full' : 'h-3 w-full'}`} />
                      </div>

                      {/* Image placeholder */}
                      <div className={`mt-4 rounded-lg bg-gradient-to-br from-gray-200 to-gray-100 ${isMobile ? 'h-20' : 'h-32'}`} />

                      {/* Third paragraph */}
                      <div className="space-y-2 sm:space-y-3 pt-2">
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-full' : 'h-3 w-full'}`} />
                        <div className={`rounded bg-gray-100 ${isMobile ? 'h-2 w-3/4' : 'h-3 w-3/4'}`} />
                      </div>
                    </div>

                    {/* Page footer */}
                    <div className={`flex items-center justify-between border-t border-gray-200 ${isMobile ? 'mt-auto pt-3' : 'mt-auto pt-4'}`}>
                      <span className={`text-gray-300 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
                        {issueTitle}
                      </span>
                      <span className={`text-gray-300 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
                        {Math.floor((i + 1) / 2) + 1}
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
                    <span className="font-display text-xl text-[var(--color-nav)]">✦</span>
                  </div>
                </div>
                <p className="font-display text-lg text-gray-600">Thank You for Reading</p>
                <p className="mt-2 text-xs text-gray-400">
                  Pulse Literary & Arts Magazine
                </p>
                <div className="mt-6">
                  <p className="text-[10px] text-gray-300">
                    Visit us at<br/>
                    <span className="text-[var(--color-nav)]">pulseliterary.com</span>
                  </p>
                </div>
              </div>
            </Page>

            {/* Back Cover */}
            <Page number={totalPages + 3} isBackCover>
              <div className="flex h-full flex-col items-center justify-center p-6 sm:p-10 text-center">
                <div className="absolute inset-4 sm:inset-6 border border-white/20" />
                
                <div className="mb-4">
                  <span className="font-display text-4xl sm:text-5xl text-white/80">✦</span>
                </div>
                
                <p className="font-display text-xl sm:text-2xl text-white">PULSE</p>
                
                <div className="my-4 flex items-center gap-2">
                  <div className="h-px w-8 bg-white/30" />
                  <span className="text-[10px] text-white/50">EST. 2024</span>
                  <div className="h-px w-8 bg-white/30" />
                </div>

                <p className="text-xs text-white/50">
                  Pittsburgh Literary & Arts Magazine
                </p>

                {/* Barcode placeholder */}
                <div className="mt-6 sm:mt-8">
                  <div className="h-8 w-24 bg-white/10 rounded" />
                </div>
              </div>
            </Page>
          </HTMLFlipBook>
        </div>

        {/* Bottom controls */}
        <div className={`relative z-10 ${isMobile ? 'px-3 py-2' : 'px-6 py-4'}`}>
          {/* Progress bar */}
          <div className="mx-auto max-w-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`text-white/40 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                {Math.round(((currentPage + 1) / (totalPages + 2)) * 100)}%
              </span>
              <div className="flex-1 overflow-hidden rounded-full bg-white/10 h-1">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white/60 to-white/80 transition-all duration-500"
                  style={{ width: `${((currentPage + 1) / (totalPages + 2)) * 100}%` }}
                />
              </div>
            </div>
            
            {isMobile && (
              <p className="mt-2 text-center text-[10px] text-white/40">
                Swipe to turn pages
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
