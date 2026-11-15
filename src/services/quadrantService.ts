// Assisted by Antigravity (SI) — reviewed by Luissmont
import { fetchApi } from './apiClient'
import type { QuadrantsResponse, QuadrantDto } from '../types/api'

/**
 * Fetches the queue of 10 quadrants from the FastAPI backend (RF-05).
 */
export async function fetchQuadrants(): Promise<QuadrantDto[]> {
  const data = await fetchApi<QuadrantsResponse>('/quadrants')
  return data.cuadrantes ?? []
}

