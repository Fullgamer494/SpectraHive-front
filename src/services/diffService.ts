// Assisted by Antigravity (SI) — reviewed by Luissmont
import { fetchApi } from './apiClient'
import type { DiffRequest, DiffResponse } from '../types/api'

/**
 * Computes mathematical image difference |Matriz_B - Matriz_A| with thresholding (RF-08, RF-09).
 */
export async function fetchDiff(payload: DiffRequest): Promise<DiffResponse> {
  return fetchApi<DiffResponse>('/diff', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

