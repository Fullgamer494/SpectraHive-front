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

export interface AladinInstance {
  gotoRaDec: (ra: number, dec: number) => void
  setFov: (fovInDegrees: number) => void
  getFov: () => [number, number]
  getRaDec: () => [number, number]
  setBaseImageLayer: (survey: string) => void
  getBaseImageLayer: () => unknown
  destroy?: () => void
}

export interface AladinStatic {
  init?: Promise<void> | (() => Promise<void>)
  aladin: (
    container: HTMLElement | string,
    options?: AladinOptions
  ) => AladinInstance
}

declare global {
  interface Window {
    A?: AladinStatic
    __aladinPromise?: Promise<AladinStatic>
    __loadAladinLite?: () => Promise<AladinStatic>
  }
}
