// Assisted by Antigravity (SI) — reviewed by Luissmont

/**
 * Converts decimal Right Ascension (0° to 360°) to sexagesimal format (HHh MMm SS.SSs).
 */
export function raDegToSexagesimal(raDeg: number): string {
  // Normalize to [0, 360)
  const normalized = ((raDeg % 360) + 360) % 360
  const totalHours = normalized / 15
  const hours = Math.floor(totalHours)
  const totalMinutes = (totalHours - hours) * 60
  const minutes = Math.floor(totalMinutes)
  const seconds = (totalMinutes - minutes) * 60

  const h = hours.toString().padStart(2, '0')
  const m = minutes.toString().padStart(2, '0')
  const s = seconds.toFixed(2).padStart(5, '0')

  return `${h}h ${m}m ${s}s`
}

/**
 * Converts decimal Declination (-90° to +90°) to sexagesimal format (±DD° MM′ SS.S″).
 */
export function decDegToSexagesimal(decDeg: number): string {
  const sign = decDeg >= 0 ? '+' : '-'
  const abs = Math.abs(decDeg)
  const degrees = Math.floor(abs)
  const totalMinutes = (abs - degrees) * 60
  const minutes = Math.floor(totalMinutes)
  const seconds = (totalMinutes - minutes) * 60

  const d = degrees.toString().padStart(2, '0')
  const m = minutes.toString().padStart(2, '0')
  const s = seconds.toFixed(1).padStart(4, '0')

  return `${sign}${d}° ${m}′ ${s}″`
}

/**
 * Validates astronomical coordinates according to RF-01.
 * RA must be between 0° and 360°.
 * Dec must be between -90° and +90°.
 */
export function validateCoordinates(
  ra: number,
  dec: number
): { valid: boolean; error?: string } {
  if (isNaN(ra) || ra < 0 || ra > 360) {
    return {
      valid: false,
      error: `Invalid Right Ascension (${ra}°). Value must be between 0° and 360°.`,
    }
  }

  if (isNaN(dec) || dec < -90 || dec > 90) {
    return {
      valid: false,
      error: `Invalid Declination (${dec}°). Value must be between -90° and +90°.`,
    }
  }

  return { valid: true }
}

