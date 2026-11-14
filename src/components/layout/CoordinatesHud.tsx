// Assisted by Antigravity (SI) — reviewed by Luissmont
import type { TargetCoordinates, TestObject } from '../../types/quadrant'
import { raDegToSexagesimal, decDegToSexagesimal } from '../../lib/coordinates'

interface CoordinatesHudProps {
  centerCoords: TargetCoordinates
  currentFov?: number
  hoverCoords: { ra: number; dec: number } | null
  clickedCoords: { ra: number; dec: number } | null
  activeObject?: TestObject
  onClearClicked?: () => void
}

export function CoordinatesHud({
  centerCoords,
  currentFov,
  hoverCoords,
  clickedCoords,
  activeObject,
  onClearClicked,
}: CoordinatesHudProps) {
  const displayFov = currentFov ?? centerCoords.fov

  return (
    <div className="pointer-events-auto rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] font-mono text-xs w-88 space-y-3">
      {/* Astrometric Header */}
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          <span className="font-semibold text-slate-200">Astrometric Telemetry</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-500">DUAL FORMAT</span>
          <span className="text-cyan-400 font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/30">
            J2000
          </span>
        </div>
      </div>

      {/* 1. Viewport Center */}
      <div className="space-y-1 bg-slate-900/40 rounded-xl p-2.5 border border-white/5">
        <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-tight">
          <span>Viewport Center</span>
          <span className="text-[9px] text-slate-500">Auto-synced</span>
        </div>
        <div className="flex justify-between text-[11px] items-baseline">
          <span className="text-slate-400">Decimal:</span>
          <span className="text-cyan-300 font-bold">
            {centerCoords.ra.toFixed(4)}°, {centerCoords.dec >= 0 ? '+' : ''}{centerCoords.dec.toFixed(4)}°
          </span>
        </div>
        <div className="flex justify-between text-[10px] items-baseline">
          <span className="text-slate-500">Sexagesimal:</span>
          <span className="text-cyan-400/90 font-medium">
            {raDegToSexagesimal(centerCoords.ra)}  {decDegToSexagesimal(centerCoords.dec)}
          </span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
          <span>Field of View:</span>
          <span className="text-slate-200 font-semibold">{displayFov.toFixed(2)}° × {displayFov.toFixed(2)}°</span>
        </div>
      </div>

      {/* 2. Cursor / Pointer Celestial Position */}
      <div className="space-y-1 bg-slate-900/40 rounded-xl p-2.5 border border-white/5">
        <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-tight">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            Cursor Celestial Position
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
        </div>
        {hoverCoords ? (
          <>
            <div className="flex justify-between text-[11px] items-baseline">
              <span className="text-slate-400">Decimal:</span>
              <span className="text-amber-300 font-bold">
                {hoverCoords.ra.toFixed(4)}°, {hoverCoords.dec >= 0 ? '+' : ''}{hoverCoords.dec.toFixed(4)}°
              </span>
            </div>
            <div className="flex justify-between text-[10px] items-baseline">
              <span className="text-slate-500">Sexagesimal:</span>
              <span className="text-amber-300/90 font-medium">
                {raDegToSexagesimal(hoverCoords.ra)}  {decDegToSexagesimal(hoverCoords.dec)}
              </span>
            </div>
          </>
        ) : (
          <p className="text-[10px] text-slate-500 italic">Hover mouse over sky canvas</p>
        )}
      </div>

      {/* 3. Clicked Star / Candidate (from aladin.on 'click' - RF-10 hook) */}
      <div className={`space-y-1.5 rounded-xl p-2.5 border transition-all ${
        clickedCoords
          ? 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
          : 'bg-slate-900/20 border-dashed border-white/10'
      }`}>
        <div className="flex justify-between items-center text-[10px] uppercase tracking-tight">
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Selected Sky Target
          </span>
          {clickedCoords && onClearClicked && (
            <button
              type="button"
              onClick={onClearClicked}
              className="text-[9px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {clickedCoords ? (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] items-baseline">
              <span className="text-slate-400">Decimal:</span>
              <span className="text-emerald-300 font-bold">
                {clickedCoords.ra.toFixed(5)}°, {clickedCoords.dec >= 0 ? '+' : ''}{clickedCoords.dec.toFixed(5)}°
              </span>
            </div>
            <div className="flex justify-between text-[10px] items-baseline">
              <span className="text-slate-500">Sexagesimal:</span>
              <span className="text-emerald-300/90 font-medium">
                {raDegToSexagesimal(clickedCoords.ra)}  {decDegToSexagesimal(clickedCoords.dec)}
              </span>
            </div>
            <p className="text-[9px] text-emerald-400/80 mt-1 italic">
              Ready for Anomaly Report (RF-10)
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-slate-500 italic">
            Click any star on canvas to target coordinates
          </p>
        )}
      </div>

      {activeObject && (
        <p className="text-[9px] text-slate-500 pt-1.5 border-t border-white/5 leading-snug">
          Target: {activeObject.name} • {activeObject.description}
        </p>
      )}
    </div>
  )
}
