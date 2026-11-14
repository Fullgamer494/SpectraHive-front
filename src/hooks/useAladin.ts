// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useEffect, useRef, useState, useCallback } from 'react'
import type { AladinInstance, AladinStatic, AladinClickEvent, AladinCatalog } from '../types/aladin'
import { DEFAULT_ALADIN_SURVEY } from '../lib/constants'

export type AladinStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface UseAladinOptions {
  ra: number
  dec: number
  fov: 1 | 2
  survey?: string
  showReticle?: boolean
  showLayersControl?: boolean
  selectedCoordinates?: { ra: number; dec: number } | null
  onPositionChange?: (ra: number, dec: number) => void
  onZoomChange?: (fov: number) => void
  onClickCoordinates?: (ra: number, dec: number) => void
  onHoverCoordinates?: (ra: number, dec: number) => void
}

export interface UseAladinResult {
  status: AladinStatus
  errorMessage: string | null
  aladin: AladinInstance | null
  retry: () => void
}

export function useAladin(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseAladinOptions
): UseAladinResult {
  const [status, setStatus] = useState<AladinStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const aladinRef = useRef<AladinInstance | null>(null)
  const catalogRef = useRef<AladinCatalog | null>(null)
  const [retryCounter, setRetryCounter] = useState(0)

  // Track commanded coordinates to avoid fighting Aladin's own gestures
  const lastCommandedRef = useRef<{ ra: number; dec: number; fov: number } | null>(null)

  // Stable callback refs
  const onPositionChangeRef = useRef(options.onPositionChange)
  onPositionChangeRef.current = options.onPositionChange

  const onZoomChangeRef = useRef(options.onZoomChange)
  onZoomChangeRef.current = options.onZoomChange

  const onClickCoordinatesRef = useRef(options.onClickCoordinates)
  onClickCoordinatesRef.current = options.onClickCoordinates

  const onHoverCoordinatesRef = useRef(options.onHoverCoordinates)
  onHoverCoordinatesRef.current = options.onHoverCoordinates

  const retry = useCallback(() => {
    aladinRef.current = null
    catalogRef.current = null
    lastCommandedRef.current = null
    setErrorMessage(null)
    setStatus('loading')
    if (typeof window !== 'undefined' && window.__loadAladinLite) {
      window.__aladinPromise = window.__loadAladinLite()
    }
    setRetryCounter((c) => c + 1)
  }, [])

  useEffect(() => {
    let isCancelled = false
    const container = containerRef.current

    if (!container) return

    const initAladin = async () => {
      try {
        let A: AladinStatic | undefined = window.A

        if (!A && window.__aladinPromise) {
          A = await window.__aladinPromise
        } else if (!A && window.__loadAladinLite) {
          A = await window.__loadAladinLite()
        }

        if (isCancelled) return

        if (!A) {
          throw new Error('Aladin Lite library could not be loaded from any CDN.')
        }

        // Await WASM/Rust core initialization if required by Aladin v3
        if (A.init) {
          if (typeof A.init === 'function') {
            await (A.init as () => Promise<void>)()
          } else if (typeof A.init.then === 'function') {
            await A.init
          }
        }

        if (isCancelled || !containerRef.current) return

        // Clear existing canvas nodes
        containerRef.current.innerHTML = ''

        const targetStr = `${options.ra} ${options.dec >= 0 ? '+' : ''}${options.dec}`
        const activeSurvey = options.survey ?? DEFAULT_ALADIN_SURVEY
        console.log('[AladinLite] Mounting viewer for target:', targetStr, 'with survey:', activeSurvey)

        const instance = A.aladin(containerRef.current, {
          target: targetStr,
          fov: options.fov,
          survey: activeSurvey,
          showReticle: options.showReticle ?? true,
          showZoomControl: false,
          showLayersControl: options.showLayersControl ?? false,
          showGotoControl: false,
          showShareControl: false,
          showFullscreenControl: false,
          showFrame: false,
          showCooGrid: false,
          cooFrame: 'J2000',
          fullScreen: false,
        })

        // Initialize target marker catalog layer (for RF-10 click target locking)
        if (A.catalog) {
          try {
            const targetCatalog = A.catalog({
              name: 'Candidate Marker',
              color: '#10b981',
              sourceSize: 20,
              shape: 'circle',
              displayLabel: true,
              labelColumn: 'label',
            })
            instance.addCatalog(targetCatalog)
            catalogRef.current = targetCatalog
          } catch (catalogErr) {
            console.warn('[AladinLite] Catalog layer creation failed:', catalogErr)
          }
        }

        // Initialize last commanded tracking
        lastCommandedRef.current = {
          ra: options.ra,
          dec: options.dec,
          fov: options.fov,
        }

        // 1. Hook into position changes (pan / drag)
        instance.on('positionChanged', (...args: unknown[]) => {
          let newRa: number | undefined
          let newDec: number | undefined

          if (typeof args[0] === 'number' && typeof args[1] === 'number') {
            newRa = args[0]
            newDec = args[1]
          } else if (args[0] && typeof (args[0] as { ra?: number }).ra === 'number') {
            newRa = (args[0] as { ra: number }).ra
            newDec = (args[0] as { dec: number }).dec
          } else {
            const current = instance.getRaDec()
            if (current) {
              newRa = current[0]
              newDec = current[1]
            }
          }

          if (typeof newRa === 'number' && typeof newDec === 'number') {
            if (lastCommandedRef.current) {
              lastCommandedRef.current.ra = newRa
              lastCommandedRef.current.dec = newDec
            }
            onPositionChangeRef.current?.(newRa, newDec)
          }
        })

        // 2. Hook into zoom changes (mouse wheel / zoom gesture)
        instance.on('zoomChanged', () => {
          const fovPair = instance.getFov()
          if (fovPair && typeof fovPair[0] === 'number') {
            const currentFov = fovPair[0]
            if (lastCommandedRef.current) {
              lastCommandedRef.current.fov = currentFov
            }
            onZoomChangeRef.current?.(currentFov)
          }
        })

        // 3. Hook into click on sky / stars (RF-10)
        instance.on('click', (...args: unknown[]) => {
          const clickData = args[0] as AladinClickEvent | undefined
          if (clickData && typeof clickData.ra === 'number' && typeof clickData.dec === 'number') {
            console.log('[AladinLite] Sky clicked at celestial coords:', clickData.ra, clickData.dec)
            onClickCoordinatesRef.current?.(clickData.ra, clickData.dec)
          }
        })

        if (!isCancelled) {
          aladinRef.current = instance
          setStatus('ready')
          setErrorMessage(null)
        }
      } catch (err) {
        console.error('[AladinLite] Mount failed:', err)
        if (!isCancelled) {
          setStatus('error')
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to initialize Aladin Lite WebGL viewport.'
          )
        }
      }
    }

    initAladin()

    return () => {
      isCancelled = true
      if (aladinRef.current) {
        try {
          aladinRef.current.destroy?.()
        } catch {
          // Ignore destruction cleanup errors
        }
        aladinRef.current = null
      }
      catalogRef.current = null
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [containerRef, retryCounter, options.survey, options.showReticle, options.showLayersControl])

  // React to commanded coordinate / FOV updates ONLY when explicitly changed from HUD
  useEffect(() => {
    if (status !== 'ready' || !aladinRef.current) return

    const last = lastCommandedRef.current
    const raDiff = last ? Math.abs(last.ra - options.ra) : 1
    const decDiff = last ? Math.abs(last.dec - options.dec) : 1
    const fovDiff = last ? Math.abs(last.fov - options.fov) : 1

    if (raDiff > 0.0001 || decDiff > 0.0001) {
      try {
        aladinRef.current.gotoRaDec(options.ra, options.dec)
      } catch (err) {
        console.warn('[AladinLite] Error updating viewport position:', err)
      }
    }

    if (fovDiff > 0.01) {
      try {
        aladinRef.current.setFov(options.fov)
      } catch (err) {
        console.warn('[AladinLite] Error updating viewport FOV:', err)
      }
    }

    lastCommandedRef.current = {
      ra: options.ra,
      dec: options.dec,
      fov: options.fov,
    }
  }, [options.ra, options.dec, options.fov, status])

  // Synchronize target marker pinned on clicked coordinates
  useEffect(() => {
    const catalog = catalogRef.current
    if (!catalog || status !== 'ready' || !window.A?.source) return

    try {
      catalog.clean?.()
      catalog.clear?.()

      if (options.selectedCoordinates) {
        const src = window.A.source(
          options.selectedCoordinates.ra,
          options.selectedCoordinates.dec,
          { label: 'CANDIDATE' }
        )
        catalog.addSources([src])
      }
    } catch (err) {
      console.warn('[AladinLite] Error synchronizing target candidate marker:', err)
    }
  }, [options.selectedCoordinates, status])

  // React to dynamic survey changes
  useEffect(() => {
    if (status === 'ready' && aladinRef.current && options.survey) {
      try {
        console.log('[AladinLite] Switching base survey to:', options.survey)
        aladinRef.current.setBaseImageLayer(options.survey)
      } catch (err) {
        console.warn('[AladinLite] Failed to switch survey layer:', err)
      }
    }
  }, [options.survey, status])

  // Mousemove event listener for real-time cursor celestial coordinates
  useEffect(() => {
    const container = containerRef.current
    if (!container || status !== 'ready') return

    const handleMouseMove = (e: MouseEvent) => {
      if (!aladinRef.current || !aladinRef.current.pix2world) return

      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      try {
        const worldCoords = aladinRef.current.pix2world(x, y)
        if (worldCoords && typeof worldCoords[0] === 'number' && typeof worldCoords[1] === 'number') {
          onHoverCoordinatesRef.current?.(worldCoords[0], worldCoords[1])
        }
      } catch {
        // Ignore edge coordinate projection errors
      }
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [status, containerRef])

  return {
    status,
    errorMessage,
    aladin: aladinRef.current,
    retry,
  }
}
