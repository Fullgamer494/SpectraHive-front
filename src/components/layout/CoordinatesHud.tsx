// Assisted by Antigravity (SI) — reviewed by Luissmont
import type { TargetCoordinates, TestObject } from '../../types/quadrant'

interface CoordinatesHudProps {
  coordinates: TargetCoordinates
  activeObject?: TestObject
}

export function CoordinatesHud({ coordinates, activeObject }: CoordinatesHudProps) {
  return (
    <div className="pointer-events-auto rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] font-mono text-xs max-w-xs">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 mb-2 border-b border-white/5 pb-1.5">
        <span>Astrometric HUD</span>
        <span className="text-cyan-400 font-bold">J2000</span>
      </div>

      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-400">RA (deg):</span>
          <span className="text-slate-200 font-bold">{coordinates.ra.toFixed(6)}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Dec (deg):</span>
          <span className="text-slate-200 font-bold">
            {coordinates.dec >= 0 ? '+' : ''}
            {coordinates.dec.toFixed(6)}°
          </span>
        </div>
        {activeObject && (
          <>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">RA (sexag):</span>
              <span className="text-cyan-300">{activeObject.raSexagesimal}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">Dec (sexag):</span>
              <span className="text-cyan-300">{activeObject.decSexagesimal}</span>
            </div>
          </>
        )}
        <div className="flex justify-between pt-1 border-t border-white/5 text-[10px]">
          <span className="text-slate-500">Field of View:</span>
          <span className="text-amber-300 font-semibold">{coordinates.fov}° × {coordinates.fov}°</span>
        </div>
      </div>

      {activeObject && (
        <p className="mt-2 text-[10px] text-slate-400 border-t border-white/5 pt-1.5 italic leading-tight">
          {activeObject.description}
        </p>
      )}
    </div>
  )
}

