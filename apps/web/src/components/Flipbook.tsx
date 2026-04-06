'use client'

import React from 'react'
import HTMLFlipBook from 'react-pageflip'
import { useState } from 'react'

interface FlipbookProps {
  pdfUrl: string
  issueTitle: string
}

// Simple page component for the flipbook
const Page = React.forwardRef<HTMLDivElement, { number: number; imageUrl?: string }>(
  (props, ref) => {
    return (
      <div ref={ref} className="page bg-white shadow-lg">
        <div className="page-content flex h-full flex-col items-center justify-center p-8">
          {props.imageUrl ? (
            <img
              src={props.imageUrl}
              alt={`Page ${props.number}`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <p className="text-gray-400">Page {props.number}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
)
Page.displayName = 'Page'

export function Flipbook({ pdfUrl: _pdfUrl, issueTitle }: FlipbookProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // For now, we'll create a placeholder flipbook
  // In production, you'd convert PDF pages to images
  const totalPages = 20 // Placeholder

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-medium text-ink transition-all hover:border-[var(--color-nav)] hover:text-[var(--color-nav)]"
      >
        Read Flipbook
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative max-h-[90vh] max-w-[90vw]">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
        >
          Close
        </button>

        {/* Flipbook */}
        <HTMLFlipBook
          width={400}
          height={600}
          size="stretch"
          minWidth={315}
          maxWidth={400}
          minHeight={400}
          maxHeight={600}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={(e) => setCurrentPage(e.data)}
          className="flipbook"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={false}
          disableFlipByClick={false}
        >
          {/* Cover page */}
          <div className="page cover bg-[var(--color-nav)] text-white">
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <h2 className="font-display text-3xl">{issueTitle}</h2>
              <p className="mt-4 text-sm text-white/70">Pulse Literary & Arts Magazine</p>
              <p className="mt-2 text-xs text-white/50">Click to open</p>
            </div>
          </div>

          {/* Content pages - placeholder */}
          {Array.from({ length: totalPages }, (_, i) => (
            <div key={i} className="page bg-white">
              <div className="flex h-full flex-col p-8">
                <p className="text-center text-gray-400">Content Page {i + 1}</p>
                <p className="mt-4 text-sm text-gray-600">
                  This is where the PDF content would be displayed. In production, each page
                  would be rendered from the PDF file.
                </p>
              </div>
            </div>
          ))}

          {/* Back cover */}
          <div className="page cover bg-[var(--color-nav)] text-white">
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <p className="font-display text-2xl">Pulse</p>
              <p className="mt-4 text-xs text-white/70">pulseliterary.com</p>
            </div>
          </div>
        </HTMLFlipBook>

        {/* Page indicator */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white">
          Page {currentPage + 1} of {totalPages + 2}
        </div>
      </div>
    </div>
  )
}
