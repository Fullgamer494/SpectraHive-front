// Assisted by Antigravity (SI) — reviewed by Luissmont
import type { DnaResponse } from '../types/api'

export const FALLBACK_DNA_SAMPLES: Record<string, DnaResponse> = {
  'barnards-star': {
    objeto: "Barnard's Star",
    bandas: ['0.75 um', '1.10 um', '1.65 um', '2.20 um', '3.40 um', '4.10 um', '4.80 um'],
    valores: [0.54, 0.88, 1.0, 0.84, 0.46, 0.34, 0.28],
    tipo_prueba: 'movimiento',
    descripcion:
      'Infrared visual reference signature for high proper-motion red dwarf (M4V). Comparative visual use only, not direct chemical identification.',
  },
  'wise-0855-0714': {
    objeto: 'WISE 0855-0714',
    bandas: ['0.75 um', '1.10 um', '1.65 um', '2.20 um', '3.40 um', '4.10 um', '4.80 um'],
    valores: [0.12, 0.24, 0.45, 0.62, 0.95, 1.0, 0.88],
    tipo_prueba: 'movimiento',
    descripcion:
      'Infrared signature for ultra-cool sub-stellar brown dwarf (Y-type). Peak emission in mid-infrared (3.4-4.5 um). Visual comparison only.',
  },
  'epsilon-indi-b': {
    objeto: 'Epsilon Indi B',
    bandas: ['0.75 um', '1.10 um', '1.65 um', '2.20 um', '3.40 um', '4.10 um', '4.80 um'],
    valores: [0.28, 0.52, 0.78, 0.91, 0.85, 0.72, 0.58],
    tipo_prueba: 'movimiento',
    descripcion:
      'Infrared signature for binary T-dwarf system. Characteristic methane absorption depressions. Visual comparison only.',
  },
  'rw-aurigae': {
    objeto: 'RW Aurigae',
    bandas: ['0.75 um', '1.10 um', '1.65 um', '2.20 um', '3.40 um', '4.10 um', '4.80 um'],
    valores: [0.92, 0.96, 1.0, 0.98, 0.91, 0.82, 0.76],
    tipo_prueba: 'brillo',
    descripcion:
      'Infrared signature for young pre-main-sequence T Tauri variable star. Infrared excess due to circumstellar accretion disk.',
  },
  'r-draconis': {
    objeto: 'R Draconis',
    bandas: ['0.75 um', '1.10 um', '1.65 um', '2.20 um', '3.40 um', '4.10 um', '4.80 um'],
    valores: [0.35, 0.68, 0.95, 1.0, 0.88, 0.75, 0.62],
    tipo_prueba: 'brillo',
    descripcion:
      'Infrared signature for pulsating Mira-type red giant variable star with heavy circumstellar dust envelope.',
  },
}

