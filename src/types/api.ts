// Assisted by Antigravity (SI) — reviewed by Luissmont

export type AnomalyType = 'movimiento' | 'brillo' | 'limpio'
export type QuadrantStatus = 'pendiente' | 'confirmado' | 'descartado'

export interface QuadrantDto {
  id: string
  nombre: string
  ra: number
  dec: number
  fov: number
  epoca_a: string
  epoca_b: string
  estado: QuadrantStatus
  es_objeto_prueba: boolean
  tipo_prueba: 'movimiento' | 'brillo'
  url_dinamica: string
}

export interface QuadrantsResponse {
  cuadrantes: QuadrantDto[]
}

export interface CutoutResponse {
  ra: number
  dec: number
  fov: number
  epoca: string
  fuente: 'irsa' | 'sintetico'
  imagen: string // Data URI (e.g. "data:image/png;base64,...")
  objeto?: string
}

export interface DiffCandidate {
  ra: number
  dec: number
  valor: number
  motivo: string
  tipo?: 'movimiento' | 'brillo'
}

export interface DiffRequest {
  cuadrante_id: string
  epoca_a?: string
  epoca_b?: string
  umbral?: number
}

export interface DiffResponse {
  cuadrante_id: string
  umbral: number
  fuente: string
  imagen: string // Data URI of |B - A| diff image
  candidatos: DiffCandidate[]
}

export interface DnaResponse {
  objeto: string
  bandas: string[]
  valores: number[]
  tipo_prueba: 'movimiento' | 'brillo'
  descripcion: string
}

export interface ReportRequest {
  cuadrante_id: string
  ra: number
  dec: number
  tipo: AnomalyType
}

export interface ReportResponse {
  reporte_id: string
  cuadrante_id: string
  estado: string
  mensaje?: string
}

export interface ValidateReportResponse {
  reporte_id: string
  validacion_id: string
  coincide: boolean
  es_simulado: boolean
  votos_coinciden: number
  confirmado: boolean
  estado_cuadrante: QuadrantStatus
  etiqueta?: string
}

export interface HealthResponse {
  status: string
  service?: string
  database_configured: boolean
}

