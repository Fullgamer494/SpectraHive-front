// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useEffect, useCallback } from 'react'
import { fetchQuadrants } from '../services/quadrantService'
import { TEST_OBJECTS } from '../data/test-objects'
import type { QuadrantDto } from '../types/api'

// Fallback seed quadrants in case the backend network call is in progress or offline
const FALLBACK_QUADRANTS: QuadrantDto[] = TEST_OBJECTS.map((obj, index) => ({
  id: `fallback-${obj.id || index}`,
  nombre: obj.name,
  ra: obj.ra,
  dec: obj.dec,
  fov: obj.defaultFov,
  epoca_a: 'DR1',
  epoca_b: 'QR3',
  estado: index === 0 ? 'confirmado' : 'pendiente',
  es_objeto_prueba: true,
  tipo_prueba: obj.tipoPrueba,
  url_dinamica: obj.urlShortcut,
}))

export interface UseQuadrantsResult {
  quadrants: QuadrantDto[]
  currentIndex: number
  activeQuadrant: QuadrantDto | null
  totalCount: number
  isLoading: boolean
  error: string | null
  nextQuadrant: () => void
  prevQuadrant: () => void
  selectQuadrantIndex: (index: number) => void
  selectQuadrantById: (id: string) => void
  selectQuadrantByCoordinates: (ra: number, dec: number, tolerance?: number) => void
  updateQuadrantStatus: (idOrName: string, status: 'confirmado' | 'descartado' | 'pendiente') => void
  reloadQuadrants: () => Promise<void>
}

export function useQuadrants(initialCoordinates?: { ra: number; dec: number }): UseQuadrantsResult {
  const [quadrants, setQuadrants] = useState<QuadrantDto[]>(FALLBACK_QUADRANTS)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadQuadrants = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchQuadrants()
      if (data && data.length > 0) {
        setQuadrants(data)
      }
    } catch (err) {
      console.warn('[useQuadrants] Could not reach backend /quadrants, using resilient fallback queue:', err)
      setError(err instanceof Error ? err.message : 'Backend offline')
      // Keeps FALLBACK_QUADRANTS resiliently
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuadrants()
  }, [loadQuadrants])

  // Select by index with bounds safety
  const selectQuadrantIndex = useCallback((index: number) => {
    setQuadrants((prev) => {
      const safeIndex = Math.max(0, Math.min(index, prev.length - 1))
      setCurrentIndex(safeIndex)
      return prev
    })
  }, [])

  const nextQuadrant = useCallback(() => {
    setQuadrants((prev) => {
      setCurrentIndex((curr) => (curr + 1) % prev.length)
      return prev
    })
  }, [])

  const prevQuadrant = useCallback(() => {
    setQuadrants((prev) => {
      setCurrentIndex((curr) => (curr - 1 + prev.length) % prev.length)
      return prev
    })
  }, [])

  const selectQuadrantById = useCallback((id: string) => {
    setQuadrants((prev) => {
      const foundIdx = prev.findIndex((q) => q.id === id)
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx)
      }
      return prev
    })
  }, [])

  const selectQuadrantByCoordinates = useCallback(
    (ra: number, dec: number, tolerance = 0.5) => {
      setQuadrants((prev) => {
        const foundIdx = prev.findIndex(
          (q) => Math.abs(q.ra - ra) <= tolerance && Math.abs(q.dec - dec) <= tolerance
        )
        if (foundIdx !== -1) {
          setCurrentIndex(foundIdx)
        }
        return prev
      })
    },
    []
  )

  // Update local quadrant status (e.g. when confirmed via consensus or marked clean)
  const updateQuadrantStatus = useCallback(
    (idOrName: string, status: 'confirmado' | 'descartado' | 'pendiente') => {
      setQuadrants((prev) =>
        prev.map((q) =>
          q.id === idOrName || q.nombre === idOrName ? { ...q, estado: status } : q
        )
      )
    },
    []
  )

  // Sync initial coordinate matching if provided
  useEffect(() => {
    if (initialCoordinates) {
      selectQuadrantByCoordinates(initialCoordinates.ra, initialCoordinates.dec)
    }
  }, [initialCoordinates?.ra, initialCoordinates?.dec, selectQuadrantByCoordinates])

  const activeQuadrant = quadrants[currentIndex] ?? null

  return {
    quadrants,
    currentIndex,
    activeQuadrant,
    totalCount: quadrants.length,
    isLoading,
    error,
    nextQuadrant,
    prevQuadrant,
    selectQuadrantIndex,
    selectQuadrantById,
    selectQuadrantByCoordinates,
    updateQuadrantStatus,
    reloadQuadrants: loadQuadrants,
  }
}

