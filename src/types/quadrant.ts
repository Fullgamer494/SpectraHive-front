// Assisted by Antigravity (SI) — reviewed by Luissmont

export type TestObjectType = 'movimiento' | 'brillo'

export interface TestObject {
  readonly id: string
  readonly name: string
  readonly commonName?: string
  readonly tipoPrueba: TestObjectType
  readonly ra: number // Decimal degrees (J2000)
  readonly dec: number // Decimal degrees (J2000)
  readonly raSexagesimal: string
  readonly decSexagesimal: string
  readonly defaultFov: 1 | 2
  readonly description: string
  readonly urlShortcut: string
}

export interface TargetCoordinates {
  ra: number
  dec: number
  fov: 1 | 2
}

