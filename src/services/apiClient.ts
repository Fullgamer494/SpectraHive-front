// Assisted by Antigravity (SI) — reviewed by Luissmont
import type { HealthResponse } from '../types/api'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number
}

/**
 * Centralized HTTP request client with timeout and typed error handling.
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 12000, headers, ...restOptions } = options
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${normalizedEndpoint}`

  try {
    const response = await fetch(url, {
      ...restOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorBody: unknown
      try {
        errorBody = await response.json()
      } catch {
        errorBody = await response.text()
      }

      const message =
        typeof errorBody === 'object' && errorBody !== null && 'detail' in errorBody
          ? String((errorBody as { detail: unknown }).detail)
          : `HTTP ${response.status}: ${response.statusText}`

      throw new ApiError(message, response.status, errorBody)
    }

    return (await response.json()) as T
  } catch (err) {
    clearTimeout(timeoutId)

    if (err instanceof ApiError) {
      throw err
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(`Request timeout after ${timeoutMs}ms: ${url}`)
    }

    throw new ApiError(
      err instanceof Error
        ? `API network failure (${url}): ${err.message}`
        : `Network error communicating with backend at ${url}`
    )
  }
}

/**
 * Checks if FastAPI backend is healthy and responding.
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  return fetchApi<HealthResponse>('/health', { timeoutMs: 4000 })
}

