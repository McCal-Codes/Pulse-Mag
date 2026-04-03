export function DiamondDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-[var(--color-nav)] ${className}`} aria-hidden="true">
      <span className="text-[0.45rem] opacity-60">◆</span>
      <span className="text-[0.55rem]">◆</span>
      <span className="text-[0.45rem] opacity-60">◆</span>
    </div>
  )
}
