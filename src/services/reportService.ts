// Assisted by Antigravity (SI) — reviewed by Luissmont
import { fetchApi } from './apiClient'
import type {
  ReportRequest,
  ReportResponse,
  ValidateReportResponse,
} from '../types/api'

/**
 * Submits an anomaly report or marks a quadrant clean (RF-10, RF-11).
 */
export async function createReport(
  payload: ReportRequest
): Promise<ReportResponse> {
  return fetchApi<ReportResponse>('/report', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Triggers simulated community cross-validation votes (RF-12, RF-13).
 */
export async function validateReport(
  reportId: string,
  coincide = true
): Promise<ValidateReportResponse> {
  return fetchApi<ValidateReportResponse>(`/report/${reportId}/validate`, {
    method: 'POST',
    body: JSON.stringify({ coincide }),
  })
}

