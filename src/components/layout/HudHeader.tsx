// Assisted by Antigravity (SI) — reviewed by Luissmont
import type { TargetCoordinates } from '../../types/quadrant'
import { HIPS_SURVEYS } from '../../lib/constants'
import { raDegToSexagesimal, decDegToSexagesimal } from '../../lib/coordinates'

interface HudHeaderProps {
  coordinates: TargetCoordinates
  activeObjectName?: string
  activeObjectType?: 'movimiento' | 'brillo'
  activeSurvey: string
  onSurveyChange: (surveyUrl: string) => void
  onFovChange: (fov: 1 | 2) => void
}

export function HudHeader({
  coordinates,
  activeObjectName,
  activeObjectType,
  activeSurvey,
  onSurveyChange,
  onFovChange,
}: HudHeaderProps) {
  return (
    <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tracking-wider text-slate-100">
              SPECTRAHIVE
            </span>
            <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[10px] font-medium text-cyan-300 border border-cyan-500/30">
              SPHEREx
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight">
            IR Citizen Science • Sky Viewport
          </p>
        </div>
      </div>

      {/* Target Telemetry Display */}
      <div className="hidden sm:flex items-center gap-4 rounded-xl bg-slate-900/40 px-3.5 py-1.5 border border-white/5 font-mono text-xs">
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Target</span>
          <span className="text-slate-200 font-semibold">
            {activeObjectName ?? 'Custom Field'}
          </span>
        </div>

        {activeObjectType && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
              activeObjectType === 'movimiento'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {activeObjectType === 'movimiento' ? 'Motion' : 'Brightness'}
          </span>
        )}

        <div className="h-6 w-px bg-white/10" />

        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Coordinates (Dec / Sexag)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-cyan-300 font-semibold">
              {coordinates.ra.toFixed(4)}°, {coordinates.dec >= 0 ? '+' : ''}
              {coordinates.dec.toFixed(4)}°
            </span>
            <span className="text-[10px] text-cyan-400/70 font-mono hidden md:inline">
              ({raDegToSexagesimal(coordinates.ra)} {decDegToSexagesimal(coordinates.dec)})
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: HiPS Survey Selector + FOV 1° / 2° */}
      <div className="flex items-center gap-2">
        {/* Survey Layer Selector */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/60 p-1 border border-white/10">
          <label htmlFor="survey-select" className="px-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            Layer
          </label>
          <select
            id="survey-select"
            value={activeSurvey}
            onChange={(e) => onSurveyChange(e.target.value)}
            className="bg-slate-950/80 text-cyan-200 border border-white/10 rounded-lg px-2 py-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            {HIPS_SURVEYS.map((survey) => (
              <option key={survey.id} value={survey.url} className="bg-slate-900 text-slate-200">
                {survey.name} [{survey.badge}]
              </option>
            ))}
          </select>
        </div>

        {/* Strict FOV Selector: 1° or 2° (RF-02) */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/60 p-1 border border-white/10">
          <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            FOV
          </span>
          <button
            type="button"
            onClick={() => onFovChange(1)}
            className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              coordinates.fov === 1
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            aria-label="Set Field of View to 1 degree"
          >
            1°
          </button>
          <button
            type="button"
            onClick={() => onFovChange(2)}
            className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              coordinates.fov === 2
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            aria-label="Set Field of View to 2 degrees"
          >
            2°
          </button>
        </div>
      </div>
    </header>
  )
}
