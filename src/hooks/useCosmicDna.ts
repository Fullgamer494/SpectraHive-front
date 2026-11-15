// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useEffect, useCallback } from 'react'
import { fetchDna, normalizeObjectSlug } from '../services/dnaService'
import { FALLBACK_DNA_SAMPLES } from '../data/dna-samples'
import type { DnaResponse } from '../types/api'

export interface UseCosmicDnaReturn {
  dnaData: DnaResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCosmicDna(objectName: string | null | undefined): UseCosmicDnaReturn {
  const [dnaData, setDnaData] = useState<DnaResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const loadDna = useCallback(async () => {
    if (!objectName) {
      setDnaData(null)
      return
    }

    setIsLoading(true)
    setError(null)
    const slug = normalizeObjectSlug(objectName)

    try {
      const data = await fetchDna(objectName)
      setDnaData(data)
    } catch (err) {
      console.warn(`[useCosmicDna] Could not fetch DNA for ${objectName}, using precalculated fallback:`, err)
      const fallback = FALLBACK_DNA_SAMPLES[slug]
      if (fallback) {
        setDnaData(fallback)
      } else {
        setError(err instanceof Error ? err.message : 'Cosmic DNA signature unavailable')
      }
    } finally {
      setIsLoading(false)
    }
  }, [objectName])

  useEffect(() => {
    loadDna()
  }, [loadDna])

  return {
    dnaData,
    isLoading,
    error,
    refetch: loadDna,
  }
}

