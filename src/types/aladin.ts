// Assisted by Antigravity (SI) — reviewed by Luissmont

export interface AladinOptions {
  target?: string
  fov?: number
  survey?: string
  showReticle?: boolean
  showZoomControl?: boolean
  showLayersControl?: boolean
  showGotoControl?: boolean
  showShareControl?: boolean
  showFullscreenControl?: boolean
  showFrame?: boolean
  showCooGrid?: boolean
  cooFrame?: string
  fullScreen?: boolean
}

export interface AladinClickEvent {
  ra?: number
  dec?: number
  x?: number
  y?: number
  data?: unknown
}

export interface AladinSource {
  ra: number
  dec: number
  data?: Record<string, unknown>
}

export interface AladinCatalog {
  addSources: (sources: AladinSource[]) => void
  remove?: (source: AladinSource) => void
  clean?: () => void
  clear?: () => void
  hide?: () => void
  show?: () => void
}

export interface AladinInstance {
  gotoRaDec: (ra: number, dec: number) => void
  setFov: (fovInDegrees: number) => void
  getFov: () => [number, number]
  getRaDec: () => [number, number]
  setBaseImageLayer: (survey: string | unknown) => void
  getBaseImageLayer: () => unknown
  addCatalog: (catalog: AladinCatalog) => void
  pix2world?: (x: number, y: number) => [number, number] | null
  world2pix?: (ra: number, dec: number) => [number, number] | null
  on: (
    event: 'positionChanged' | 'zoomChanged' | 'click' | 'select' | 'mouseMove',
    callback: (...args: unknown[]) => void
  ) => void
  destroy?: () => void
}

export interface AladinStatic {
  init?: Promise<void> | (() => Promise<void>)
  aladin: (
    container: HTMLElement | string,
    options?: AladinOptions
  ) => AladinInstance
  catalog?: (options?: {
    name?: string
    color?: string
    sourceSize?: number
    shape?: string
    displayLabel?: boolean
    labelColumn?: string
  }) => AladinCatalog
  source?: (ra: number, dec: number, data?: Record<string, unknown>) => AladinSource
}

declare global {
  interface Window {
    A?: AladinStatic
    __aladinPromise?: Promise<AladinStatic>
    __loadAladinLite?: () => Promise<AladinStatic>
  }
}
