// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState } from 'react'
import { useBlink } from '../../hooks/useBlink'
import { DiffViewer } from './DiffViewer'
import type { DiffCandidate } from '../../types/api'

interface BlinkViewerProps {
  ra: number
  dec: number
  fov?: number
  cuadranteId?: string
  epocaA?: string
  epocaB?: string
  objectName?: string
  tipoPrueba?: 'movimiento' | 'brillo'
  onSelectCandidate?: (candidate: DiffCandidate) => void
  onClose?: () => void
}

export function BlinkViewer({
  ra,
  dec,
  fov = 2,
  cuadranteId,
  epocaA = 'DR1',
  epocaB = 'QR3',
  objectName,
  tipoPrueba,
  onSelectCandidate,
  onClose,
}: BlinkViewerProps) {
  const [activeTab, setActiveTab] = useState<'blink' | 'diff'>('blink')

  const {
    currentEpoch,
    isPlaying,
    speedMs,
    imageA,
    imageB,
    labelA,
    labelB,
    sourceTag,
    isLoading,
    error,
    togglePlay,
    setEpoch,
    setSpeed,
    reload,
  } = useBlink({ ra, dec, fov })

  const isMotion = tipoPrueba === 'movimiento'

  return (
    <div className="pointer-events-auto flex flex-col rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_12px_48px_rgba(0,0,0,0.7)] overflow-hidden w-full max-w-md transition-all">
      {/* 1. Top Header with Mission Badges & Close Button */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-slate-900/70">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 items-center justify-center">
            <span
              className={`h-2 w-2 rounded-full ${
                activeTab === 'blink' && isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
              }`}
            />
          </span>
          <span className="font-mono text-xs font-bold text-slate-100 tracking-wider">
            SPHEREx INSPECTOR
          </span>
          {tipoPrueba && (
            <span
              className={`rounded px-1.5 py-0.2 font-mono text-[9px] uppercase font-bold border ${
                isMotion
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isMotion ? 'Motion Test' : 'Brightness Test'}
            </span>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="Close Inspector"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. Mode Selector: [ Blink A ↔ B ] vs [ Resta |B - A| ] */}
      <div className="flex items-center justify-center p-1.5 bg-slate-900/40 border-b border-white/5 font-mono text-xs gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('blink')}
          className={`flex-1 py-1.5 rounded-xl text-center font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
            activeTab === 'blink'
              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
          }`}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>BLINK A ↔ B</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diff')}
          className={`flex-1 py-1.5 rounded-xl text-center font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
            activeTab === 'diff'
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
          }`}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>RESTA |B − A|</span>
        </button>
      </div>

      {/* 3. Tab Body: Either Blink Viewer or Difference Viewer */}
      {activeTab === 'diff' ? (
        <DiffViewer
          cuadranteId={cuadranteId}
          epocaA={epocaA}
          epocaB={epocaB}
          onSelectCandidate={onSelectCandidate}
        />
      ) : (
        <>
          {/* Main Dual-Epoch Canvas Frame */}
          <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center select-none">
            {/* Loading skeleton */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <p className="font-mono text-xs text-cyan-300 animate-pulse tracking-wide">
                  Loading SPHEREx Cutouts...
                </p>
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 gap-3">
                <p className="text-xs text-red-300 font-mono">{error}</p>
                <button
                  type="button"
                  onClick={reload}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 text-xs font-mono cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Epoch A Image Layer */}
            {imageA && (
              <img
                src={imageA}
                alt="Epoch A Infrared Cutout"
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-75 ${
                  currentEpoch === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            )}

            {/* Epoch B Image Layer */}
            {imageB && (
              <img
                src={imageB}
                alt="Epoch B Infrared Cutout"
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-75 ${
                  currentEpoch === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            )}

            {/* Center Reticle Crosshair */}
            <div className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center opacity-40">
              <div className="relative h-12 w-12 flex items-center justify-center">
                <div className="absolute h-px w-full bg-cyan-400" />
                <div className="absolute h-full w-px bg-cyan-400" />
                <div className="h-4 w-4 rounded-full border border-cyan-400" />
              </div>
            </div>

            {/* Floating Epoch HUD Pill (Active Epoch indicator) */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-mono text-xs font-bold shadow-lg border backdrop-blur-md transition-all ${
                  currentEpoch === 'A'
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-cyan-500/20'
                    : 'bg-amber-950/80 text-amber-300 border-amber-400 shadow-amber-500/20'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    currentEpoch === 'A' ? 'bg-cyan-400' : 'bg-amber-400'
                  }`}
                />
                <span>
                  EPOCH {currentEpoch} ({currentEpoch === 'A' ? labelA : labelB})
                </span>
              </div>

              {sourceTag === 'sintetico' && (
                <span className="rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-white/10 backdrop-blur-sm">
                  Fallback Sintético
                </span>
              )}
            </div>

            {/* Field of View stamp */}
            <div className="absolute bottom-3 right-3 z-20 rounded bg-slate-950/80 px-2 py-0.5 font-mono text-[10px] text-slate-400 border border-white/10">
              FOV {fov}° • J2000
            </div>
          </div>

          {/* Control Bar: Play/Pause, Manual Toggle, Speed */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-900/50 border-t border-white/10">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer border ${
                isPlaying
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>BLINK</span>
                </>
              )}
            </button>

            {/* Manual Epoch A / B Toggle Switch */}
            <div className="flex items-center rounded-xl bg-slate-950/80 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setEpoch('A')}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
                  currentEpoch === 'A'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ep. A
              </button>
              <button
                type="button"
                onClick={() => setEpoch('B')}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
                  currentEpoch === 'B'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ep. B
              </button>
            </div>

            {/* Speed Selector (300ms, 500ms, 1s) */}
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="text-slate-500 uppercase mr-1">Speed:</span>
              {[
                { label: '0.3s', ms: 300 },
                { label: '0.5s', ms: 500 },
                { label: '1.0s', ms: 1000 },
              ].map((item) => (
                <button
                  key={item.ms}
                  type="button"
                  onClick={() => setSpeed(item.ms)}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    speedMs === item.ms
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Target hint footer */}
      {objectName && (
        <div className="px-4 py-1.5 bg-slate-950/90 border-t border-white/5 font-mono text-[10px] text-slate-400 flex justify-between items-center">
          <span className="truncate">Target: {objectName}</span>
          <span className="text-slate-500 shrink-0">Percentiles 1-99</span>
        </div>
      )}
    </div>
  )
}
