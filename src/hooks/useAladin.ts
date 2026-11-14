// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useEffect, useRef, useState, useCallback } from 'react'
import type { AladinInstance, AladinStatic } from '../types/aladin'
import { DEFAULT_ALADIN_SURVEY } from '../lib/constants'

export type AladinStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface UseAladinOptions {
  ra: number
  dec: number
  fov: 1 | 2
  survey?: string
  showReticle?: boolean
  showLayersControl?: boolean
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
  const [retryCounter, setRetryCounter] = useState(0)

  const retry = useCallback(() => {
    aladinRef.current = null
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
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [containerRef, retryCounter, options.survey, options.showReticle, options.showLayersControl])

  // React to coordinate / FOV updates once initialized
  useEffect(() => {
    if (status === 'ready' && aladinRef.current) {
      try {
        aladinRef.current.gotoRaDec(options.ra, options.dec)
        aladinRef.current.setFov(options.fov)
      } catch (err) {
        console.warn('[AladinLite] Error updating viewport position:', err)
      }
    }
  }, [options.ra, options.dec, options.fov, status])

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

  return {
    status,
    errorMessage,
    aladin: aladinRef.current,
    retry,
  }
}
