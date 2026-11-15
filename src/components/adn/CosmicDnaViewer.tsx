// Assisted by Codex (SI) — reviewed by pendiente
// Assisted by Antigravity (SI) — reviewed by Luissmont
import { ChartNoAxesColumn, Info, MoveUpRight, Sun, X } from 'lucide-react'
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
const BAND_COLORS: Readonly<Record<string, string>> = {
  '0.75 um': '#a36d66',
  '1.10 um': '#b1845e',
  '1.65 um': '#b5a56c',
  '2.20 um': '#899d76',
  '3.40 um': '#6c958d',
  '4.10 um': '#658b9e',
  '4.80 um': '#777f9e',
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
                <span><ChartNoAxesColumn aria-hidden="true" /> Cosmic DNA</span>
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
            title="Close (Esc)" aria-label="Close Cosmic DNA"
          >
            <X aria-hidden="true" />
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
                    {isMotion ? <MoveUpRight aria-hidden="true" /> : <Sun aria-hidden="true" />} {isMotion ? 'High Proper Motion Object' : 'Brightness Variable Source'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block uppercase text-[10px]">Wavelength Coverage</span>
                  <span className="text-slate-200 font-semibold">0.75 µm → 4.80 µm (NIR / MIR)</span>
                </div>
              </div>

              <figure className="spectral-readout" aria-labelledby="spectral-chart-title">
                <figcaption><h3 id="spectral-chart-title">Spectral signature</h3><p>Normalized flux / 0.00–1.00</p></figcaption>
                <div className="spectral-bars" aria-hidden="true">
                  {displayData.bandas.map((band, index) => (
                    <div key={band} className="spectral-bar-track"><div style={{ backgroundColor: BAND_COLORS[band] ?? '#658b9e', height: `${Math.max(0, Math.min(100, (displayData.valores[index] ?? 0) * 100))}%` }} /></div>
                  ))}
                </div>
                <table className="spectral-table">
                  <caption className="sr-only">Wavelength and normalized flux for each spectral band</caption>
                  <thead><tr><th scope="col">Wavelength</th><th scope="col">Normalized flux</th></tr></thead>
                  <tbody>{displayData.bandas.map((band, index) => <tr key={band}><th scope="row">{band.replace('um', 'µm')}</th><td>{(displayData.valores[index] ?? 0).toFixed(2)}</td></tr>)}</tbody>
                </table>
              </figure>

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
                  <span><Info aria-hidden="true" /> Visual signature</span>
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

