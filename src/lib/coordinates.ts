// Assisted by Antigravity (SI) — reviewed by Luissmont

/**
 * Converts decimal Right Ascension (0° to 360°) to sexagesimal format (HHh MMm SS.SSs).
 */
export function raDegToSexagesimal(raDeg: number): string {
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
 * Converts decimal RA to compact shortcut format (e.g. "17h57m").
 */
export function raDegToCompact(raDeg: number): string {
  const normalized = ((raDeg % 360) + 360) % 360
  const totalHours = normalized / 15
  const hours = Math.floor(totalHours)
  const minutes = Math.floor((totalHours - hours) * 60)
  return `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}m`
}

/**
 * Converts decimal Dec to compact shortcut format (e.g. "+4d41m" or "-7d14m").
 */
export function decDegToCompact(decDeg: number): string {
  const sign = decDeg >= 0 ? '+' : '-'
  const abs = Math.abs(decDeg)
  const degrees = Math.floor(abs)
  const minutes = Math.floor((abs - degrees) * 60)
  return `${sign}${degrees}d${minutes.toString().padStart(2, '0')}m`
}

/**
 * Parses Right Ascension string in decimal or sexagesimal format.
 * Examples accepted:
 * - "269.452075" (decimal degrees)
 * - "17h57m", "17h57m48.5s", "17h 57m 48.5s" (hours:minutes:seconds)
 * - "17:57:48.5", "17 57 48.5"
 */
export function parseRa(input: string): { value?: number; error?: string } {
  const trimmed = input.trim()
  if (!trimmed) {
    return { error: 'Right Ascension cannot be empty.' }
  }

  // 1. Try pure decimal number
  const decimalVal = Number(trimmed)
  if (!isNaN(decimalVal)) {
    if (decimalVal < 0 || decimalVal > 360) {
      return {
        error: `Right Ascension out of range: ${decimalVal}°. Value must be between 0° and 360°.`,
      }
    }
    return { value: decimalVal }
  }

  // 2. Try sexagesimal with h/m/s indicators
  // e.g. "17h57m", "17h 57m 48.5s", "08h55m"
  const hmsRegex = /^(\d+(?:\.\d+)?)[hH](?:[ ]*(\d+(?:\.\d+)?)[mM])?(?:[ ]*(\d+(?:\.\d+)?)[sS])?$/
  const hmsMatch = trimmed.match(hmsRegex)
  if (hmsMatch) {
    const hours = parseFloat(hmsMatch[1])
    const minutes = hmsMatch[2] ? parseFloat(hmsMatch[2]) : 0
    const seconds = hmsMatch[3] ? parseFloat(hmsMatch[3]) : 0

    if (hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
      return { error: `Invalid sexagesimal RA values in '${trimmed}'. Hours: 0-23, Minutes: 0-59.` }
    }

    const totalDegrees = (hours + minutes / 60 + seconds / 3600) * 15
    if (totalDegrees < 0 || totalDegrees > 360) {
      return { error: `RA out of range: ${totalDegrees.toFixed(4)}°. Must be 0° to 360°.` }
    }
    return { value: totalDegrees }
  }

  // 3. Try space or colon-separated sexagesimal (e.g. "17:57:48.5" or "17 57 48.5")
  const separated = trimmed.split(/[:\s]+/)
  if (separated.length >= 2 && separated.length <= 3) {
    const hours = parseFloat(separated[0])
    const minutes = parseFloat(separated[1])
    const seconds = separated[2] ? parseFloat(separated[2]) : 0

    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60) {
        const totalDegrees = (hours + minutes / 60 + seconds / 3600) * 15
        if (totalDegrees >= 0 && totalDegrees <= 360) {
          return { value: totalDegrees }
        }
      }
    }
  }

  return { error: `Unrecognized Right Ascension format: '${input}'. Use decimal (e.g. 269.45) or sexagesimal (e.g. 17h57m).` }
}

/**
 * Parses Declination string in decimal or sexagesimal format.
 * Examples accepted:
 * - "+4.693365", "-7.245146" (decimal degrees)
 * - "+4d41m", "-7d14m", "+04°41′36.1″", "-56d47m"
 * - "+04:41:36", "-07 14 42.5"
 */
export function parseDec(input: string): { value?: number; error?: string } {
  const trimmed = input.trim()
  if (!trimmed) {
    return { error: 'Declination cannot be empty.' }
  }

  // 1. Try pure decimal number
  const decimalVal = Number(trimmed)
  if (!isNaN(decimalVal)) {
    if (decimalVal < -90 || decimalVal > 90) {
      return {
        error: `Declination out of range: ${decimalVal}°. Value must be between -90° and +90°.`,
      }
    }
    return { value: decimalVal }
  }

  // 2. Try sexagesimal with d/°/m/′/s/″ indicators (e.g. "+4d41m", "-7d14m", "+04°41′36.1″")
  const dmsRegex = /^([+-]?)(\d+(?:\.\d+)?)[dD°](?:[ ]*(\d+(?:\.\d+)?)[mM′'])?(?:[ ]*(\d+(?:\.\d+)?)[sS″"])?$/
  const dmsMatch = trimmed.match(dmsRegex)
  if (dmsMatch) {
    const isNegative = dmsMatch[1] === '-'
    const degrees = parseFloat(dmsMatch[2])
    const minutes = dmsMatch[3] ? parseFloat(dmsMatch[3]) : 0
    const seconds = dmsMatch[4] ? parseFloat(dmsMatch[4]) : 0

    if (degrees < 0 || degrees > 90 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
      return { error: `Invalid sexagesimal Dec values in '${trimmed}'. Degrees: 0-90, Minutes: 0-59.` }
    }

    const absTotal = degrees + minutes / 60 + seconds / 3600
    const totalDegrees = isNegative ? -absTotal : absTotal

    if (totalDegrees < -90 || totalDegrees > 90) {
      return { error: `Declination out of range: ${totalDegrees.toFixed(4)}°. Must be -90° to +90°.` }
    }
    return { value: totalDegrees }
  }

  // 3. Try space or colon-separated sexagesimal (e.g. "+04:41:36" or "-07 14 42.5")
  const signMatch = trimmed.match(/^([+-]?)(.*)$/)
  if (signMatch) {
    const isNegative = signMatch[1] === '-'
    const separated = signMatch[2].trim().split(/[:\s]+/)
    if (separated.length >= 2 && separated.length <= 3) {
      const degrees = parseFloat(separated[0])
      const minutes = parseFloat(separated[1])
      const seconds = separated[2] ? parseFloat(separated[2]) : 0

      if (!isNaN(degrees) && !isNaN(minutes) && !isNaN(seconds)) {
        if (degrees >= 0 && degrees <= 90 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60) {
          const absTotal = degrees + minutes / 60 + seconds / 3600
          const totalDegrees = isNegative ? -absTotal : absTotal
          if (totalDegrees >= -90 && totalDegrees <= 90) {
            return { value: totalDegrees }
          }
        }
      }
    }
  }

  return { error: `Unrecognized Declination format: '${input}'. Use decimal (e.g. +4.69) or sexagesimal (e.g. +4d41m).` }
}

/**
 * Parses FOV string. According to RF-02, FOV is strictly 1 or 2 (default 2).
 */
export function parseFov(input: string | null): 1 | 2 {
  if (input === '1') return 1
  return 2
}

/**
 * Validates astronomical coordinates according to RF-01.
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
