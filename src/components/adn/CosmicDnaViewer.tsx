// Assisted by Antigravity (SI) — reviewed by Luissmont
import React, { useState } from 'react'
import { useCosmicDna } from '../../hooks/useCosmicDna'
import { FALLBACK_DNA_SAMPLES } from '../../data/dna-samples'
import type { DnaResponse } from '../../types/api'

interface CosmicDnaViewerProps {
  isOpen: boolean
  onClose: () => void
  objectName: string | null | undefined
}

// Color palette for the 7 SPHEREx infrared bands (from near-IR to mid-IR)
const BAND_COLORS: { [band: string]: { bar: string; glow: string; text: string } } = {
  '0.75 um': { bar: 'from-red-600 to-rose-500', glow: 'rgba(239, 68, 68, 0.4)', text: 'text-rose-400' },
  '1.10 um': { bar: 'from-orange-600 to-amber-500', glow: 'rgba(249, 115, 22, 0.4)', text: 'text-orange-400' },
  '1.65 um': { bar: 'from-amber-500 to-yellow-400', glow: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-300' },
  '2.20 um': { bar: 'from-lime-500 to-emerald-400', glow: 'rgba(132, 204, 22, 0.4)', text: 'text-lime-300' },
  '3.40 um': { bar: 'from-emerald-500 to-teal-400', glow: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-300' },
  '4.10 um': { bar: 'from-teal-500 to-cyan-400', glow: 'rgba(6, 182, 212, 0.4)', text: 'text-cyan-300' },
  '4.80 um': { bar: 'from-cyan-500 to-indigo-500', glow: 'rgba(99, 102, 241, 0.4)', text: 'text-indigo-300' },
}

export const CosmicDnaViewer: React.FC<CosmicDnaViewerProps> = ({
  isOpen,
  onClose,
  objectName,
}) => {
  const { dnaData, isLoading, error } = useCosmicDna(objectName)
  const [selectedReferenceKey, setSelectedReferenceKey] = useState<string | null>(null)

  if (!isOpen) return null

  // Active display data: either reference overlay or current target
  const displayData: DnaResponse | null = selectedReferenceKey
    ? FALLBACK_DNA_SAMPLES[selectedReferenceKey] ?? dnaData
    : dnaData

  const isMotion = displayData?.tipo_prueba === 'movimiento'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cosmic-dna-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-amber-300 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <div>
              <h2 id="cosmic-dna-title" className="text-sm font-bold tracking-wider uppercase text-cyan-400 font-mono flex items-center gap-2">
                <span>🧬 Cosmic DNA</span>
                <span className="text-[10px] text-slate-500 font-normal border border-slate-700 px-1.5 py-0.2 rounded">
                  SPHEREx 7-Band Signature
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Target: <span className="text-white font-semibold">{displayData?.objeto ?? objectName ?? 'Unknown'}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 text-lg leading-none cursor-pointer"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <p className="font-mono text-xs text-cyan-300 tracking-wide animate-pulse">
                Extracting Spectral Signature from SPHEREx Archive...
              </p>
            </div>
          )}

          {/* Error state */}
          {error && !displayData && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs">
              <p className="font-bold">Error loading Cosmic DNA</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {displayData && (
            <>
              {/* Object Category & Science Context */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px]">Classification</span>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold border ${
                      isMotion
                        ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/50'
                        : 'border-amber-500/40 text-amber-300 bg-amber-950/50'
                    }`}
                  >
                    {isMotion ? '☄️ High Proper Motion Object' : '✨ Brightness Variable Source'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block uppercase text-[10px]">Wavelength Coverage</span>
                  <span className="text-slate-200 font-semibold">0.75 µm → 4.80 µm (NIR / MIR)</span>
                </div>
              </div>

              {/* Spectral Barcode Container (RF-14) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold uppercase tracking-wider text-slate-300">
                    Visual Spectral Barcode (Normalized Flux)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Values: 0.0 (Min) → 1.0 (Peak)
                  </span>
                </div>

                {/* Barcode Frame */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                  <div className="grid grid-cols-7 gap-2.5 sm:gap-3.5 h-44 items-end pt-6 pb-2">
                    {displayData.bandas.map((band, idx) => {
                      const val = displayData.valores[idx] ?? 0
                      const colorInfo = BAND_COLORS[band] ?? {
                        bar: 'from-cyan-500 to-blue-500',
                        glow: 'rgba(6, 182, 212, 0.4)',
                        text: 'text-cyan-300',
                      }
                      const heightPercent = Math.max(10, Math.round(val * 100))

                      return (
                        <div key={band} className="flex flex-col items-center h-full justify-end group">
                          {/* Value tag on hover / top */}
                          <span className={`text-[10px] font-mono font-bold mb-1.5 transition-all ${colorInfo.text}`}>
                            {val.toFixed(2)}
                          </span>

                          {/* Gradient Vertical Bar */}
                          <div className="w-full bg-slate-800/80 rounded-t-md h-full flex items-end overflow-hidden p-0.5">
                            <div
                              className={`w-full rounded-t bg-gradient-to-t ${colorInfo.bar} transition-all duration-700 group-hover:brightness-125`}
                              style={{
                                height: `${heightPercent}%`,
                                boxShadow: `0 0 12px ${colorInfo.glow}`,
                              }}
                            />
                          </div>

                          {/* Wavelength label */}
                          <span className="text-[10px] font-mono text-slate-400 mt-2 truncate max-w-full text-center">
                            {band}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Scientific Description from API */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Profile Note:</span>
                <p className="text-slate-300 leading-relaxed">{displayData.descripcion}</p>
              </div>

              {/* Reference Template Comparison Switcher */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                  Compare with Reference Profiles:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setSelectedReferenceKey(null)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      selectedReferenceKey === null
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Current Object ({objectName ?? 'Target'})
                  </button>
                  {Object.entries(FALLBACK_DNA_SAMPLES).map(([key, sample]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedReferenceKey(key)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedReferenceKey === key
                          ? 'border-amber-400 bg-amber-950/60 text-amber-300 font-bold'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sample.objeto}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandatory NASA RF-15 Disclaimer */}
              <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-500/30 text-amber-200/90 text-xs font-mono space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wide text-[11px]">
                  <span>⚠️ Rule RF-15 Disclaimer</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Cosmic DNA is a <strong className="text-white">visual spectral signature</strong> intended strictly for comparative morphology against reference astronomical templates. It does <strong className="text-white">not</strong> constitute direct chemical or molecular identification.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all font-mono uppercase tracking-wider shadow-lg shadow-cyan-950/50 cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  )
}

