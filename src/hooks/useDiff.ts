// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useEffect, useCallback } from 'react'
import { fetchDiff } from '../services/diffService'
import type { DiffResponse } from '../types/api'

export interface UseDiffOptions {
  cuadranteId?: string
  epocaA?: string
  epocaB?: string
  autoFetch?: boolean
}

export interface UseDiffResult {
  diffData: DiffResponse | null
  isLoading: boolean
  error: string | null
  fetchDiffData: () => Promise<void>
}

// In-memory cache for difference results
const diffCache = new Map<string, DiffResponse>()

export function useDiff({
  cuadranteId,
  epocaA = 'DR1',
  epocaB = 'QR3',
  autoFetch = false,
}: UseDiffOptions): UseDiffResult {
  const [diffData, setDiffData] = useState<DiffResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDiffData = useCallback(async () => {
    if (!cuadranteId) return

    const cacheKey = `${cuadranteId}_${epocaA}_${epocaB}`
    const cached = diffCache.get(cacheKey)
    if (cached) {
      setDiffData(cached)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchDiff({
        cuadrante_id: cuadranteId,
        epoca_a: epocaA,
        epoca_b: epocaB,
      })

      diffCache.set(cacheKey, result)
      setDiffData(result)
    } catch (err) {
      console.error('[useDiff] Error computing matrix difference:', err)
      setError(err instanceof Error ? err.message : 'Failed to compute difference image')
    } finally {
      setIsLoading(false)
    }
  }, [cuadranteId, epocaA, epocaB])

  useEffect(() => {
    if (autoFetch && cuadranteId) {
      fetchDiffData()
    }
  }, [autoFetch, cuadranteId, fetchDiffData])

  return {
    diffData,
    isLoading,
    error,
    fetchDiffData,
  }
}

