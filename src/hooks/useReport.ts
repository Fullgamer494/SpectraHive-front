// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useCallback } from 'react'
import { createReport, validateReport } from '../services/reportService'
import type { AnomalyType, ReportResponse, ValidateReportResponse } from '../types/api'

export type ReportStage = 'idle' | 'submitting' | 'validating' | 'confirmed' | 'error'

export interface UseReportReturn {
  stage: ReportStage
  isSubmitting: boolean
  voteCount: number
  targetVotes: number
  reportData: ReportResponse | null
  validationData: ValidateReportResponse | null
  errorMessage: string | null
  submitReport: (params: {
    quadrantId: string
    ra: number
    dec: number
    tipo: AnomalyType
  }) => Promise<boolean>
  resetReport: () => void
}

export function useReport(): UseReportReturn {
  const [stage, setStage] = useState<ReportStage>('idle')
  const [voteCount, setVoteCount] = useState<number>(0)
  const [reportData, setReportData] = useState<ReportResponse | null>(null)
  const [validationData, setValidationData] = useState<ValidateReportResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resetReport = useCallback(() => {
    setStage('idle')
    setVoteCount(0)
    setReportData(null)
    setValidationData(null)
    setErrorMessage(null)
  }, [])

  const submitReport = useCallback(
    async (params: {
      quadrantId: string
      ra: number
      dec: number
      tipo: AnomalyType
    }): Promise<boolean> => {
      setStage('submitting')
      setErrorMessage(null)
      setVoteCount(0)

      try {
        // Step 1: Submit report to FastAPI / Supabase (RF-10, RF-11)
        const report = await createReport({
          cuadrante_id: params.quadrantId,
          ra: params.ra,
          dec: params.dec,
          tipo: params.tipo,
        })
        setReportData(report)

        // If marked clean (RF-11), no community anomaly consensus needed
        if (params.tipo === 'limpio') {
          setStage('confirmed')
          return true
        }

        // Step 2: Simulated Community Consensus (RF-12, RF-13)
        // 3 independent votes required to reach confirmed status
        setStage('validating')
        let lastVal: ValidateReportResponse | null = null

        for (let i = 1; i <= 3; i++) {
          await new Promise((resolve) => setTimeout(resolve, 600)) // smooth visual progression
          const res = await validateReport(report.reporte_id, true, true)
          lastVal = res
          setVoteCount(res.votos_coinciden)
        }

        setValidationData(lastVal)
        setStage('confirmed')
        return true
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to submit report'
        setErrorMessage(message)
        setStage('error')
        return false
      }
    },
    []
  )

  return {
    stage,
    isSubmitting: stage === 'submitting' || stage === 'validating',
    voteCount,
    targetVotes: 3,
    reportData,
    validationData,
    errorMessage,
    submitReport,
    resetReport,
  }
}

