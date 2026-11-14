// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useRef } from 'react'
import { useAladin } from '../../hooks/useAladin'
import type { TargetCoordinates } from '../../types/quadrant'

interface AladinViewerProps {
  coordinates: TargetCoordinates
  survey?: string
  className?: string
  onPositionChange?: (ra: number, dec: number) => void
  onZoomChange?: (fov: number) => void
  onClickCoordinates?: (ra: number, dec: number) => void
  onHoverCoordinates?: (ra: number, dec: number) => void
}

export function AladinViewer({
  coordinates,
  survey,
  className = '',
  onPositionChange,
  onZoomChange,
  onClickCoordinates,
  onHoverCoordinates,
}: AladinViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { status, errorMessage, retry } = useAladin(containerRef, {
    ra: coordinates.ra,
    dec: coordinates.dec,
    fov: coordinates.fov,
    survey,
    onPositionChange,
    onZoomChange,
    onClickCoordinates,
    onHoverCoordinates,
  })

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-950 ${className}`}>
      {/* Aladin Lite Canvas / WebGL Mount Container */}
      <div
        id="aladin-lite-div"
        ref={containerRef}
        className="w-full h-full select-none"
        style={{ minHeight: '100%', minWidth: '100%' }}
      />

      {/* Loading Skeleton / Pulse Overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
          <div className="relative flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute h-24 w-24 rounded-full border border-cyan-500/30 animate-ping" />
            <div className="h-16 w-16 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <div className="absolute h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
          </div>

          <p className="mt-6 text-sm font-medium tracking-widest text-cyan-300 uppercase animate-pulse">
            Acquiring Viewport...
          </p>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            RA {coordinates.ra.toFixed(4)}° / Dec {coordinates.dec >= 0 ? '+' : ''}{coordinates.dec.toFixed(4)}° • FOV {coordinates.fov}°
          </p>
        </div>
      )}

      {/* Error / Resilient Fallback Overlay */}
      {status === 'error' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-lg">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900/70 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 mb-4">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-slate-100">
              Sky Viewport Unavailable
            </h3>
            <p className="mt-2 text-xs text-slate-300 font-mono leading-relaxed">
              {errorMessage || 'Unable to establish WebGL stream from CDN providers.'}
            </p>

            <button
              onClick={retry}
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600/30 px-4 py-2 text-xs font-semibold text-cyan-200 border border-cyan-500/50 hover:bg-cyan-600/50 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/20"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
