// Assisted by Antigravity (SI) — reviewed by Luissmont
import { fetchApi } from './apiClient'
import type { CutoutResponse } from '../types/api'

export interface FetchCutoutParams {
  ra: number | string
  dec: number | string
  fov?: number
  epoca?: 'A' | 'B' | string
  formato?: 'json' | 'png'
}

/**
 * Fetches an infrared cutout for a specific coordinate and epoch (RF-06, RF-16).
 * Returns JSON with image in base64 Data URI format ("data:image/png;base64,...").
 */
export async function fetchCutout(
  params: FetchCutoutParams
): Promise<CutoutResponse> {
  const query = new URLSearchParams({
    ra: String(params.ra),
    dec: String(params.dec),
    fov: String(params.fov ?? 2),
    epoca: String(params.epoca ?? 'A'),
    formato: params.formato ?? 'json',
  })

  return fetchApi<CutoutResponse>(`/cutout?${query.toString()}`)
}

