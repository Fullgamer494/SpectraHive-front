// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchCutout } from '../services/cutoutService'

export interface UseBlinkOptions {
  ra: number
  dec: number
  fov?: number
  defaultSpeedMs?: number
}

export interface UseBlinkResult {
  currentEpoch: 'A' | 'B'
  isPlaying: boolean
  speedMs: number
  imageA: string | null
  imageB: string | null
  labelA: string
  labelB: string
  sourceTag: 'irsa' | 'sintetico' | null
  isLoading: boolean
  error: string | null
  toggleEpoch: () => void
  setEpoch: (epoch: 'A' | 'B') => void
  togglePlay: () => void
  setSpeed: (ms: number) => void
  reload: () => Promise<void>
}

// In-memory cache for fast quadrant switching
const cutoutsCache = new Map<
  string,
  {
    imageA: string
    imageB: string
    labelA: string
    labelB: string
    sourceTag: 'irsa' | 'sintetico'
  }
>()

export function useBlink({
  ra,
  dec,
  fov = 2,
  defaultSpeedMs = 500,
}: UseBlinkOptions): UseBlinkResult {
  const [currentEpoch, setCurrentEpoch] = useState<'A' | 'B'>('A')
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [speedMs, setSpeedMs] = useState<number>(defaultSpeedMs)

  const [imageA, setImageA] = useState<string | null>(null)
  const [imageB, setImageB] = useState<string | null>(null)
  const [labelA, setLabelA] = useState<string>('DR1')
  const [labelB, setLabelB] = useState<string>('QR3')
  const [sourceTag, setSourceTag] = useState<'irsa' | 'sintetico' | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const cacheKey = `${ra.toFixed(4)}_${dec.toFixed(4)}_${fov}`

  // 1. Fetch both Epoch A and Epoch B cutouts concurrently
  const loadCutouts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    // Check memory cache first
    const cached = cutoutsCache.get(cacheKey)
    if (cached) {
      setImageA(cached.imageA)
      setImageB(cached.imageB)
      setLabelA(cached.labelA)
      setLabelB(cached.labelB)
      setSourceTag(cached.sourceTag)
      setIsLoading(false)
      return
    }

    try {
      const [resA, resB] = await Promise.all([
        fetchCutout({ ra, dec, fov, epoca: 'A', formato: 'json' }),
        fetchCutout({ ra, dec, fov, epoca: 'B', formato: 'json' }),
      ])

      const dataA = resA.imagen
      const dataB = resB.imagen
      const tagA = resA.epoca || 'DR1'
      const tagB = resB.epoca || 'QR3'
      const src = resA.fuente || 'sintetico'

      setImageA(dataA)
      setImageB(dataB)
      setLabelA(tagA)
      setLabelB(tagB)
      setSourceTag(src)

      cutoutsCache.set(cacheKey, {
        imageA: dataA,
        imageB: dataB,
        labelA: tagA,
        labelB: tagB,
        sourceTag: src,
      })
    } catch (err) {
      console.error('[useBlink] Error fetching cutout pair:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch infrared cutouts')
    } finally {
      setIsLoading(false)
    }
  }, [cacheKey, ra, dec, fov])

  useEffect(() => {
    loadCutouts()
  }, [loadCutouts])

  // 2. Auto-blink interval timer
  const speedRef = useRef(speedMs)
  speedRef.current = speedMs

  useEffect(() => {
    if (!isPlaying || isLoading || !imageA || !imageB) return

    const intervalId = setInterval(() => {
      setCurrentEpoch((prev) => (prev === 'A' ? 'B' : 'A'))
    }, speedRef.current)

    return () => clearInterval(intervalId)
  }, [isPlaying, isLoading, imageA, imageB, speedMs])

  // 3. User Controls
  const toggleEpoch = useCallback(() => {
    setCurrentEpoch((prev) => (prev === 'A' ? 'B' : 'A'))
  }, [])

  const setEpoch = useCallback((epoch: 'A' | 'B') => {
    setCurrentEpoch(epoch)
  }, [])

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const setSpeed = useCallback((ms: number) => {
    setSpeedMs(ms)
  }, [])

  return {
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
    toggleEpoch,
    setEpoch,
    togglePlay,
    setSpeed,
    reload: loadCutouts,
  }
}

