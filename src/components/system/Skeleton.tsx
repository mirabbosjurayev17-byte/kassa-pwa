/** Small skeleton primitive */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

/**
 * Generic screen skeleton resembling the app shell (header + hero + cards).
 * Used while a page hydrates so refresh/re-entry feels polished.
 */
export function ScreenSkeleton() {
  return (
    <div className="px-5 lg:px-10 py-7 lg:py-8 max-w-6xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-28 h-3.5" />
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>

      <Skeleton className="w-full h-44 rounded-3xl mb-5" />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      <Skeleton className="w-full h-56 rounded-3xl mb-5" />

      <div className="space-y-3">
        <Skeleton className="w-full h-16 rounded-2xl" />
        <Skeleton className="w-full h-16 rounded-2xl" />
        <Skeleton className="w-full h-16 rounded-2xl" />
      </div>
    </div>
  )
}
