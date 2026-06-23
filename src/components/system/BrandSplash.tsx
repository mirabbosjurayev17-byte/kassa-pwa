/**
 * Full-screen branded splash shown while the app boots / re-hydrates.
 * Caribbean-green monogram on the soft app background with an indeterminate bar.
 */
export function BrandSplash() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center gap-7 px-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-dark flex items-center justify-center shadow-float">
          <svg width="44" height="44" viewBox="0 0 512 512" fill="none">
            <g stroke="#00DF81" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round">
              <path d="M190 150 V362" />
              <path d="M190 258 L332 150" />
              <path d="M190 258 L336 362" />
            </g>
          </svg>
        </div>
      </div>

      <div className="w-44 h-[3px] rounded-full bg-border overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-green to-green-bright animate-bar-indeterminate" />
      </div>
    </div>
  )
}
