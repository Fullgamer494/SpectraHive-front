// Assisted by Antigravity (SI) — reviewed by Luissmont
import { fetchApi } from './apiClient'
import type { DnaResponse } from '../types/api'

/**
 * Normalizes an object name to a slug (e.g. "Barnard's Star" -> "barnards-star").
 */
export function normalizeObjectSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Fetches precalculated Cosmic DNA visual spectral barcode (RF-14, RF-15).
 */
export async function fetchDna(objectNameOrSlug: string): Promise<DnaResponse> {
  const slug = normalizeObjectSlug(objectNameOrSlug)
  return fetchApi<DnaResponse>(`/dna/${encodeURIComponent(slug)}`)
}

