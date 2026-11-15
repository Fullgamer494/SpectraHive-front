// Assisted by Antigravity (SI) — reviewed by Luissmont
import type { QuadrantDto } from '../../types/api'

interface QuadrantQueueNavProps {
  quadrants: QuadrantDto[]
  currentIndex: number
  activeQuadrant: QuadrantDto | null
  isLoading?: boolean
  onNext: () => void
  onPrev: () => void
  onSelectIndex: (index: number) => void
}

export function QuadrantQueueNav({
  quadrants,
  currentIndex,
  activeQuadrant,
  isLoading = false,
  onNext,
  onPrev,
  onSelectIndex,
}: QuadrantQueueNavProps) {
  if (!activeQuadrant && !isLoading) return null

  const isMotion = activeQuadrant?.tipo_prueba === 'movimiento'
  const isConfirmed = activeQuadrant?.estado === 'confirmado'
  const isPending = activeQuadrant?.estado === 'pendiente'

  const formattedCurrent = (currentIndex + 1).toString().padStart(2, '0')
  const formattedTotal = (quadrants.length || 1).toString().padStart(2, '0')

  return (
    <div className="pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* 1. Queue Counter & Step Navigation */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrev}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800 transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Previous Quadrant in Queue"
            title="Previous Quadrant"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/50 border border-white/5 font-mono text-xs">
            <span className="text-slate-500 text-[10px] uppercase tracking-wider">QUEUE</span>
            <span className="text-cyan-300 font-bold text-sm tracking-tight">{formattedCurrent}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 text-xs">{formattedTotal}</span>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800 transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Next Quadrant in Queue"
            title="Next Quadrant"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Quadrant Name & Badges */}
        {activeQuadrant && (
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-slate-100 tracking-tight">
              {activeQuadrant.nombre}
            </span>

            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider border ${
                isMotion
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isMotion ? 'Motion' : 'Brightness'}
            </span>

            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider border ${
                isConfirmed
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isPending
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isConfirmed ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                }`}
              />
              {activeQuadrant.estado}
            </span>
          </div>
        )}
      </div>

      {/* 2. Timeline Dots & Epoch Metadata */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {/* Epochs pair badge */}
        {activeQuadrant && (
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-[10px] text-slate-400 bg-slate-900/40 px-2.5 py-1 rounded-lg border border-white/5">
            <span className="text-slate-500 uppercase">Epochs:</span>
            <span className="text-cyan-300 font-semibold">{activeQuadrant.epoca_a}</span>
            <span className="text-slate-500">↔</span>
            <span className="text-cyan-300 font-semibold">{activeQuadrant.epoca_b}</span>
          </div>
        )}

        {/* Progress Dots Track (Clickable) */}
        <div className="flex items-center gap-1.5 bg-slate-900/50 px-2.5 py-1.5 rounded-xl border border-white/5">
          {quadrants.map((q, idx) => {
            const isSelected = idx === currentIndex
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'w-6 bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
                    : 'w-2 bg-slate-700 hover:bg-slate-500 hover:w-3'
                }`}
                title={`${idx + 1}. ${q.nombre} (${q.tipo_prueba})`}
                aria-label={`Jump to quadrant ${idx + 1}: ${q.nombre}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

