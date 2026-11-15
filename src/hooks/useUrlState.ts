// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  parseRa,
  parseDec,
  parseFov,
  raDegToCompact,
  decDegToCompact,
  validateCoordinates,
} from '../lib/coordinates'
import { DEFAULT_OBJECT, findMatchingTestObject } from '../data/test-objects'
import type { TargetCoordinates, TestObject } from '../types/quadrant'

export interface UseUrlStateResult {
  coordinates: TargetCoordinates
  activeObject?: TestObject
  urlError: string | null
  setCoordinatesAndUrl: (
    newCoords: TargetCoordinates,
    obj?: TestObject,
    pushHistory?: boolean
  ) => void
  clearUrlError: () => void
}

/**
 * Custom hook implementing dynamic URL synchronization according to RF-01, RF-02, RF-03.
 * Supports:
 * - Parsing ?ra=<RA>&dec=<Dec>&fov=<1|2> on initial load or popstate
 * - Compact sexagesimal (e.g. 17h57m, +4d41m) and decimal degrees
 * - Strict FOV constraint (only 1 or 2, default 2)
 * - Clear error message rejection for out-of-range coordinates
 * - Bi-directional URL synchronization without page reload
 */
export function useUrlState(): UseUrlStateResult {
  const [coordinates, setCoordinates] = useState<TargetCoordinates>({
    ra: DEFAULT_OBJECT.ra,
    dec: DEFAULT_OBJECT.dec,
    fov: DEFAULT_OBJECT.defaultFov,
  })
  const [activeObject, setActiveObject] = useState<TestObject | undefined>(DEFAULT_OBJECT)
  const [urlError, setUrlError] = useState<string | null>(null)
  const isInitialSyncRef = useRef<boolean>(false)

  // Parse URL search parameters into valid coordinates
  const parseCurrentUrl = useCallback((): {
    coords: TargetCoordinates
    obj?: TestObject
    error: string | null
  } => {
    if (typeof window === 'undefined') {
      return {
        coords: { ra: DEFAULT_OBJECT.ra, dec: DEFAULT_OBJECT.dec, fov: DEFAULT_OBJECT.defaultFov },
        obj: DEFAULT_OBJECT,
        error: null,
      }
    }

    const params = new URLSearchParams(window.location.search)
    const rawRa = params.get('ra')
    const rawDec = params.get('dec')
    const rawFov = params.get('fov')

    // If no coordinates provided in URL, use default Barnard's Star
    if (!rawRa && !rawDec) {
      return {
        coords: { ra: DEFAULT_OBJECT.ra, dec: DEFAULT_OBJECT.dec, fov: DEFAULT_OBJECT.defaultFov },
        obj: DEFAULT_OBJECT,
        error: null,
      }
    }

    if (!rawRa || !rawDec) {
      return {
        coords: { ra: DEFAULT_OBJECT.ra, dec: DEFAULT_OBJECT.dec, fov: DEFAULT_OBJECT.defaultFov },
        obj: DEFAULT_OBJECT,
        error: 'Both RA and Dec must be provided in the URL (e.g. ?ra=17h57m&dec=+4d41m&fov=2).',
      }
    }

    const raResult = parseRa(rawRa)
    if (raResult.error || raResult.value === undefined) {
      return {
        coords: { ra: DEFAULT_OBJECT.ra, dec: DEFAULT_OBJECT.dec, fov: DEFAULT_OBJECT.defaultFov },
        obj: DEFAULT_OBJECT,
        error: raResult.error || `Invalid Right Ascension: '${rawRa}'`,
      }
    }

    const decResult = parseDec(rawDec)
    if (decResult.error || decResult.value === undefined) {
      return {
        coords: { ra: DEFAULT_OBJECT.ra, dec: DEFAULT_OBJECT.dec, fov: DEFAULT_OBJECT.defaultFov },
        obj: DEFAULT_OBJECT,
        error: decResult.error || `Invalid Declination: '${rawDec}'`,
      }
    }

    const validation = validateCoordinates(raResult.value, decResult.value)
    if (!validation.valid) {
      return {
        coords: { ra: DEFAULT_OBJECT.ra, dec: DEFAULT_OBJECT.dec, fov: DEFAULT_OBJECT.defaultFov },
        obj: DEFAULT_OBJECT,
        error: validation.error || 'Coordinates out of valid range (RA: 0-360°, Dec: -90° to +90°).',
      }
    }

    const fov = parseFov(rawFov)
    const matchedObj = findMatchingTestObject(raResult.value, decResult.value)

    return {
      coords: { ra: raResult.value, dec: decResult.value, fov },
      obj: matchedObj,
      error: null,
    }
  }, [])

  // Sync state to URL without reloading
  const setCoordinatesAndUrl = useCallback(
    (newCoords: TargetCoordinates, obj?: TestObject, pushHistory = false) => {
      setCoordinates(newCoords)
      const matched = obj || findMatchingTestObject(newCoords.ra, newCoords.dec)
      setActiveObject(matched)
      setUrlError(null)

      if (typeof window === 'undefined') return

      let searchStr: string

      if (matched && matched.urlShortcut) {
        // Use standard official shortcut from 00-contexto-general.md §5
        // e.g. /?ra=17h57m&dec=+4d41m&fov=2
        const shortcutParams = matched.urlShortcut.replace(/^\/\?/, '')
        const p = new URLSearchParams(shortcutParams)
        p.set('fov', newCoords.fov.toString())
        searchStr = `?${p.toString()}`
      } else {
        const raParam = raDegToCompact(newCoords.ra)
        const decParam = decDegToCompact(newCoords.dec)
        searchStr = `?ra=${raParam}&dec=${decParam}&fov=${newCoords.fov}`
      }

      const newUrl = `${window.location.pathname}${searchStr}`

      if (window.location.search !== searchStr) {
        if (pushHistory) {
          window.history.pushState({ coords: newCoords }, '', newUrl)
        } else {
          window.history.replaceState({ coords: newCoords }, '', newUrl)
        }
      }
    },
    []
  )

  // Initial read on mount
  useEffect(() => {
    if (isInitialSyncRef.current) return
    isInitialSyncRef.current = true

    const initial = parseCurrentUrl()
    setCoordinates(initial.coords)
    setActiveObject(initial.obj)
    setUrlError(initial.error)

    // Ensure URL query string reflects active coordinates if it was empty
    if (!window.location.search && initial.obj) {
      setCoordinatesAndUrl(initial.coords, initial.obj, false)
    }
  }, [parseCurrentUrl, setCoordinatesAndUrl])

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const current = parseCurrentUrl()
      setCoordinates(current.coords)
      setActiveObject(current.obj)
      setUrlError(current.error)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [parseCurrentUrl])

  return {
    coordinates,
    activeObject,
    urlError,
    setCoordinatesAndUrl,
    clearUrlError: () => setUrlError(null),
  }
}

