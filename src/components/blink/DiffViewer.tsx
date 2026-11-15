// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useEffect } from 'react'
import { useDiff } from '../../hooks/useDiff'
import type { DiffCandidate } from '../../types/api'

interface DiffViewerProps {
  cuadranteId?: string
  epocaA?: string
  epocaB?: string
  onSelectCandidate?: (candidate: DiffCandidate) => void
}

export function DiffViewer({
  cuadranteId,
  epocaA = 'DR1',
  epocaB = 'QR3',
  onSelectCandidate,
}: DiffViewerProps) {
  const { diffData, isLoading, error, fetchDiffData } = useDiff({
    cuadranteId,
    epocaA,
    epocaB,
    autoFetch: true,
  })

  useEffect(() => {
    fetchDiffData()
  }, [cuadranteId, fetchDiffData])

  return (
    <div className="flex flex-col w-full bg-slate-950 text-slate-100 select-none">
      {/* 1. Difference Canvas Viewport */}
      <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            <p className="font-mono text-xs text-emerald-300 animate-pulse tracking-wide">
              Computing |Matriz_B − Matriz_A|...
            </p>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 gap-3">
            <p className="text-xs text-red-300 font-mono">{error}</p>
            <button
              type="button"
              onClick={fetchDiffData}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 text-xs font-mono cursor-pointer"
            >
              Retry Diff
            </button>
          </div>
        )}

        {/* The Matriz Difference Image |B - A| */}
        {diffData?.imagen ? (
          <img
            src={diffData.imagen}
            alt="Absolute Difference Matrix |B - A|"
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          !isLoading && (
            <div className="text-xs font-mono text-slate-500">
              No difference image available
            </div>
          )
        )}

        {/* Top Badges: Formula and Threshold */}
        <div className="absolute top-3 left-3 z-15 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-950/80 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300 border border-emerald-500/40 shadow-lg backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span>|B − A| SUBTRACTION</span>
          </div>

          {diffData && (
            <div className="rounded-xl bg-slate-900/80 px-2 py-0.5 font-mono text-[10px] text-amber-300 border border-amber-500/30 backdrop-blur-sm">
              Umbral: &gt; {diffData.umbral.toFixed(2)}
            </div>
          )}
        </div>

        {/* Static Cancellation Legend */}
        <div className="absolute bottom-3 left-3 z-15 rounded bg-slate-950/85 px-2 py-0.5 font-mono text-[9px] text-slate-400 border border-white/10 backdrop-blur-sm">
          Fixed Stars = 0 (Black) • Dynamic &gt; 3σ (White)
        </div>
      </div>

      {/* 2. Candidate Explanation and Discovery Panel (RF-09) */}
      <div className="p-3.5 space-y-2.5 bg-slate-900/60 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
              Candidates Detected
            </span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.2 border border-emerald-500/30 font-bold">
              {diffData?.candidatos?.length ?? 0}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Click candidate to target
          </span>
        </div>

        {/* Candidates List */}
        {diffData?.candidatos && diffData.candidatos.length > 0 ? (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {diffData.candidatos.map((candidate, idx) => (
              <button
                key={`${candidate.ra}_${candidate.dec}_${idx}`}
                type="button"
                onClick={() => onSelectCandidate?.(candidate)}
                className="w-full text-left flex flex-col gap-1 rounded-xl bg-slate-950/70 p-2.5 border border-white/5 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
                    <span className="text-emerald-300 font-bold">
                      Candidate #{idx + 1}
                    </span>
                  </div>
                  <span className="rounded bg-amber-500/10 text-amber-300 text-[9px] px-1.5 py-0.2 border border-amber-500/30">
                    Δ {candidate.valor.toFixed(1)} &gt; {diffData.umbral.toFixed(1)}
                  </span>
                </div>

                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>RA: {candidate.ra.toFixed(4)}°</span>
                  <span>Dec: {candidate.dec >= 0 ? '+' : ''}{candidate.dec.toFixed(4)}°</span>
                </div>

                <p className="text-[9px] text-slate-400/90 font-mono italic leading-tight">
                  {candidate.motivo}
                </p>
              </button>
            ))}
          </div>
        ) : (
          !isLoading && (
            <p className="text-[10px] font-mono text-slate-500 italic p-2 bg-slate-950/50 rounded-xl text-center">
              No points exceeded the 3σ threshold in this quadrant.
            </p>
          )
        )}

        {/* Mathematical Threshold Explanation (RF-09 Requirement) */}
        <div className="rounded-xl bg-slate-950/50 p-2.5 border border-white/5 font-mono text-[9px] text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Why is this a candidate? (RF-09):</strong> Fixed stars have identical pixel values in both epochs ($A - A = 0$). Only astronomical objects exhibiting high proper motion or intense flux variability exceed the mathematical $3\sigma$ threshold.
        </div>
      </div>
    </div>
  )
}

