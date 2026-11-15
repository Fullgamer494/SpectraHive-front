// Assisted by Codex (SI) — reviewed by pendiente
// Assisted by Antigravity (SI) — reviewed by Luissmont
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { useRef } from 'react'
import { useAladin } from '../../hooks/useAladin'
import type { TargetCoordinates } from '../../types/quadrant'

interface AladinViewerProps {
  coordinates: TargetCoordinates
  survey?: string
  className?: string
  selectedCoordinates?: { ra: number; dec: number } | null
  onPositionChange?: (ra: number, dec: number) => void
  onZoomChange?: (fov: number) => void
  onClickCoordinates?: (ra: number, dec: number) => void
  onHoverCoordinates?: (ra: number, dec: number) => void
}

export function AladinViewer({
  coordinates,
  survey,
  className = '',
  selectedCoordinates,
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
    selectedCoordinates,
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

      {status === 'loading' && (
        <div className="sky-state" role="status"><span className="loading-mark" /><h3>Loading sky context</h3><p>RA {coordinates.ra.toFixed(4)}° / Dec {coordinates.dec.toFixed(4)}° · FOV {coordinates.fov}°</p></div>
      )}
      {status === 'error' && (
        <div className="sky-state" role="alert"><TriangleAlert aria-hidden="true" /><h3>Sky context unavailable</h3><p>{errorMessage || 'Unable to load the sky viewer.'}</p><button type="button" onClick={retry}><RefreshCw aria-hidden="true" /> Retry connection</button></div>
      )}
    </div>
  )
}
