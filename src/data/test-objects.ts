// Assisted by Antigravity (SI) — reviewed by Luissmont
import type { TestObject } from '../types/quadrant'

/**
 * The 5 test objects requested by the challenge (00-contexto-general.md §5).
 * J2000 coordinates, FOV 2, split into two strict groups:
 * - Movement: Barnard's Star, WISE 0855-0714, Epsilon Indi B
 * - Brightness: RW Aurigae, R Draconis
 */
export const TEST_OBJECTS: readonly TestObject[] = [
  {
    id: 'barnards-star',
    name: "Barnard's Star",
    tipoPrueba: 'movimiento',
    ra: 269.452075,
    dec: 4.693365,
    raSexagesimal: '17h57m48.50s',
    decSexagesimal: '+04°41′36.1″',
    defaultFov: 2,
    description: 'High proper motion (~10.39"/yr) red dwarf in Ophiuchus.',
    urlShortcut: '/?ra=17h57m&dec=+4d41m&fov=2',
  },
  {
    id: 'wise-0855',
    name: 'WISE 0855-0714',
    tipoPrueba: 'movimiento',
    ra: 133.795133,
    dec: -7.245146,
    raSexagesimal: '08h55m10.83s',
    decSexagesimal: '−07°14′42.5″',
    defaultFov: 2,
    description: 'Sub-stellar brown dwarf with high proper motion (~8.15"/yr).',
    urlShortcut: '/?ra=08h55m&dec=-7d14m&fov=2',
  },
  {
    id: 'epsilon-indi-b',
    name: 'Epsilon Indi B',
    tipoPrueba: 'movimiento',
    ra: 331.044147,
    dec: -56.782844,
    raSexagesimal: '22h04m10.595s',
    decSexagesimal: '−56°46′58.24″',
    defaultFov: 2,
    description: 'Nearby binary brown dwarf system (~4.68"/yr proper motion).',
    urlShortcut: '/?ra=22h04m&dec=-56d47m&fov=2',
  },
  {
    id: 'rw-aurigae',
    name: 'RW Aurigae',
    tipoPrueba: 'brillo',
    ra: 76.956067,
    dec: 30.401326,
    raSexagesimal: '05h07m49.456s',
    decSexagesimal: '+30°24′04.77″',
    defaultFov: 2,
    description: 'T Tauri variable star with profound photometric fading events.',
    urlShortcut: '/?ra=05h07m&dec=+30d24m&fov=2',
  },
  {
    id: 'r-draconis',
    name: 'R Draconis',
    tipoPrueba: 'brillo',
    ra: 248.167625,
    dec: 66.754972,
    raSexagesimal: '16h32m40.23s',
    decSexagesimal: '+66°45′17.9″',
    defaultFov: 2,
    description: 'Mira-type pulsating red giant variable (period ~245 days).',
    urlShortcut: '/?ra=16h32m&dec=+66d45m&fov=2',
  },
] as const

export const DEFAULT_OBJECT = TEST_OBJECTS[0]

