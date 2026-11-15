// Assisted by Codex (SI) — reviewed by pendiente
// Assisted by Antigravity (SI) — reviewed by Luissmont
import { ArrowRight, ChartNoAxesColumn, Check, CircleCheck, MoveUpRight, Radio, ShieldCheck, Sun, TriangleAlert, X } from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'
import type { QuadrantDto, AnomalyType } from '../../types/api'
import type { UseReportReturn } from '../../hooks/useReport'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onNextQuadrant?: () => void
  quadrant: QuadrantDto | null
  currentRa: number
  currentDec: number
  initialType?: AnomalyType | null
  reportState: UseReportReturn
  onReportSuccess: (quadrantId: string, tipo: AnomalyType) => void
  onOpenDna?: () => void
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onNextQuadrant,
  quadrant,
  currentRa,
  currentDec,
  initialType,
  reportState,
  onReportSuccess,
  onOpenDna,
}) => {
  const [selectedType, setSelectedType] = useState<AnomalyType>('movimiento')

  const handleClose = useCallback(() => {
    reportState.resetReport()
    onClose()
  }, [reportState, onClose])

  // Set default type according to preset or quadrant test type (RN-02, RN-03)
  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType)
    } else if (quadrant?.tipo_prueba === 'brillo') {
      setSelectedType('brillo')
    } else {
      setSelectedType('movimiento')
    }
  }, [quadrant, initialType, isOpen])

  // ESC key listener to quickly close modal
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen || !quadrant) return null

  const isMotionGroup = quadrant.tipo_prueba === 'movimiento'
  const isBrightnessGroup = quadrant.tipo_prueba === 'brillo'

  const handleSubmit = async () => {
    const success = await reportState.submitReport({
      quadrantId: quadrant.id || quadrant.nombre,
      ra: currentRa,
      dec: currentDec,
      tipo: selectedType,
    })
    if (success) {
      onReportSuccess(quadrant.id || quadrant.nombre, selectedType)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in cursor-default"
    >
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100 flex flex-col max-h-[90vh] pointer-events-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full animate-pulse ${
                selectedType === 'limpio' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            <h2 id="report-modal-title" className="text-sm font-semibold tracking-wider uppercase text-cyan-400">
              {selectedType === 'limpio' ? 'Confirm Clean Quadrant (RF-11)' : 'Submit Anomaly Report'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 text-lg leading-none cursor-pointer"
            title="Close (Esc)" aria-label="Close report"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Target Coordinates & Quadrant Summary */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono tracking-wider">Quadrant</span>
              <span className="font-semibold text-white truncate block">{quadrant.nombre}</span>
              <span
                className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isMotionGroup
                    ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40'
                    : 'border-amber-500/40 text-amber-300 bg-amber-950/40'
                }`}
              >
                {isMotionGroup ? 'Motion Target' : 'Brightness Target'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono tracking-wider">Target Position</span>
              <span className="font-mono text-cyan-300 block">
                RA {currentRa.toFixed(4)}°
              </span>
              <span className="font-mono text-cyan-300 block">
                Dec {currentDec >= 0 ? `+${currentDec.toFixed(4)}` : currentDec.toFixed(4)}°
              </span>
            </div>
          </div>

          {/* Report Stage: Idle or Selecting */}
          {reportState.stage === 'idle' && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Select Anomaly Classification:
              </label>

              {/* Warning on Motion vs Brightness (RN-02 / RN-03) */}
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed">
                <span className="font-bold text-amber-400">Rule RN-02/03:</span> Motion ≠ Brightness.
                {isMotionGroup
                  ? " This target belongs to the motion group (high proper motion). Do not classify as brightness."
                  : " This target belongs to the brightness group (variable star). Do not classify as motion."}
              </div>

              {/* Option Cards */}
              <div className="space-y-2">
                {/* Motion Option */}
                <button
                  type="button"
                  onClick={() => setSelectedType('movimiento')}
                  disabled={isBrightnessGroup}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedType === 'movimiento'
                      ? 'border-cyan-400 bg-cyan-950/50 shadow-md shadow-cyan-950/50'
                      : isBrightnessGroup
                      ? 'border-slate-800 bg-slate-950/30 opacity-40 cursor-not-allowed'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                      <span className="text-cyan-400 font-bold"><MoveUpRight aria-hidden="true" /> Proper Motion Anomaly</span>
                      {isMotionGroup && (
                        <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      )}
                    </span>
                    <input
                      type="radio"
                      checked={selectedType === 'movimiento'}
                      onChange={() => setSelectedType('movimiento')}
                      disabled={isBrightnessGroup}
                      className="accent-cyan-400"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Object shifts celestial position between Epoch A (DR1) and Epoch B (QR3).
                  </p>
                </button>

                {/* Brightness Option */}
                <button
                  type="button"
                  onClick={() => setSelectedType('brillo')}
                  disabled={isMotionGroup}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedType === 'brillo'
                      ? 'border-amber-400 bg-amber-950/50 shadow-md shadow-amber-950/50'
                      : isMotionGroup
                      ? 'border-slate-800 bg-slate-950/30 opacity-40 cursor-not-allowed'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                      <span className="text-amber-400 font-bold"><Sun aria-hidden="true" /> Brightness Variation</span>
                      {isBrightnessGroup && (
                        <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      )}
                    </span>
                    <input
                      type="radio"
                      checked={selectedType === 'brillo'}
                      onChange={() => setSelectedType('brillo')}
                      disabled={isMotionGroup}
                      className="accent-amber-400"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Stationary source exhibiting significant luminosity or flux variation.
                  </p>
                </button>

                {/* Clean Quadrant Option (RF-11) */}
                <button
                  type="button"
                  onClick={() => setSelectedType('limpio')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedType === 'limpio'
                      ? 'border-emerald-400 bg-emerald-950/50 shadow-md shadow-emerald-950/50'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                      <span className="text-emerald-400 font-bold"><ShieldCheck aria-hidden="true" /> Mark as Clean Quadrant</span>
                    </span>
                    <input
                      type="radio"
                      checked={selectedType === 'limpio'}
                      onChange={() => setSelectedType('limpio')}
                      className="accent-emerald-400"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    No detectable movement, variable source, or candidate anomalies found.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Report Stage: Submitting / Validating */}
          {(reportState.stage === 'submitting' || reportState.stage === 'validating') && (
            <div className="py-6 space-y-6 text-center">
              <div className="inline-flex p-4 rounded-full bg-cyan-950/50 border border-cyan-500/40 animate-pulse">
                <span className="text-3xl"><Radio aria-hidden="true" size={28} /></span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">
                  {reportState.stage === 'submitting'
                    ? 'Transmitting Report to Database...'
                    : 'Running Cross-Validation Protocol...'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {reportState.stage === 'submitting'
                    ? 'Registering coordinates and anomaly classification into Supabase.'
                    : 'Gathering consensus from independent citizen science verifiers (RF-12, RF-13).'}
                </p>
              </div>

              {/* Consensus progress track */}
              {selectedType !== 'limpio' && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Community Consensus:</span>
                    <span className="text-cyan-400 font-bold">{reportState.voteCount} / {reportState.targetVotes} Votes</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 transition-all duration-500"
                      style={{ width: `${(reportState.voteCount / reportState.targetVotes) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span className={reportState.voteCount >= 1 ? 'text-cyan-400' : ''}>
                      <Check aria-hidden="true" /> You (Primary)
                    </span>
                    <span className={reportState.voteCount >= 2 ? 'text-cyan-400' : ''}>
                      <Check aria-hidden="true" /> Reviewer 2 [Simulated]
                    </span>
                    <span className={reportState.voteCount >= 3 ? 'text-emerald-400 font-bold' : ''}>
                      <Check aria-hidden="true" /> Reviewer 3 [Simulated]
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Report Stage: Confirmed */}
          {reportState.stage === 'confirmed' && (
            <div className="py-4 space-y-5 text-center">
              <div className="inline-flex p-3 rounded-full bg-emerald-950/60 border border-emerald-500/50">
                <span className="text-3xl"><CircleCheck aria-hidden="true" size={28} /></span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-emerald-400">
                  {selectedType === 'limpio' ? 'Quadrant Marked Clean' : 'Anomaly Confirmed by Consensus!'}
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedType === 'limpio'
                    ? 'The quadrant has been archived as inspected and free of anomalies.'
                    : 'The required 3 matching validations have been reached in the consensus view.'}
                </p>
              </div>

              {/* Badges / IDs */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Report ID:</span>
                  <span className="text-slate-300 truncate max-w-[240px]">
                    {reportState.reportData?.reporte_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quadrant Status:</span>
                  <span className="text-emerald-400 font-semibold uppercase">
                    {reportState.validationData?.estado_cuadrante || 'Confirmado'}
                  </span>
                </div>
                {selectedType !== 'limpio' && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <span className="text-slate-500">Validation Protocol:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      3 Consensus Votes [Simulated (RF-13)]
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Report Stage: Error */}
          {reportState.stage === 'error' && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs space-y-2">
              <div className="font-bold text-rose-400 flex items-center gap-2">
                <span><TriangleAlert aria-hidden="true" /> Error Submitting Report</span>
              </div>
              <p>{reportState.errorMessage}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {reportState.stage === 'idle' && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-lg ${
                  selectedType === 'limpio'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/50'
                }`}
              >
                {selectedType === 'limpio' ? 'Confirm Clean Quadrant' : 'Submit & Validate'}
              </button>
            </>
          )}

          {reportState.stage === 'confirmed' && (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  handleClose()
                  onNextQuadrant?.()
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Done / Next Quadrant <ArrowRight aria-hidden="true" /></span>
              </button>
              {onOpenDna && selectedType !== 'limpio' && (
                <button
                  type="button"
                  onClick={() => {
                    handleClose()
                    onOpenDna()
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-300 hover:brightness-110 shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2 font-mono uppercase"
                >
                  <span><ChartNoAxesColumn aria-hidden="true" /> View Cosmic DNA</span>
                </button>
              )}
            </div>
          )}

          {reportState.stage === 'error' && (
            <div className="w-full flex justify-end gap-3">
              <button
                type="button"
                onClick={() => reportState.resetReport()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

