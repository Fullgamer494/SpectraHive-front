// Assisted by Antigravity (SI) — reviewed by Luissmont
import { DEFAULT_OBJECT } from '../data/test-objects'
import type { TargetCoordinates } from '../types/quadrant'

export const DEFAULT_TARGET: TargetCoordinates = {
  ra: DEFAULT_OBJECT.ra,
  dec: DEFAULT_OBJECT.dec,
  fov: DEFAULT_OBJECT.defaultFov,
}

export const ALLOWED_FOVS: readonly [1, 2] = [1, 2] as const

/**
 * HiPS surveys available for background imagery.
 * ESA and NASA/STScI mirrors use global HTTPS CDNs with open CORS headers,
 * avoiding connectivity timeouts from Strasbourg servers.
 */
export const HIPS_SURVEYS = [
  {
    id: 'esa-2mass',
    name: '2MASS Infrared (ESA)',
    url: 'https://skies.esac.esa.int/2MASSColor',
    badge: 'IR',
  },
  {
    id: 'esa-dss',
    name: 'DSS2 Color (ESA)',
    url: 'https://skies.esac.esa.int/DSSColor',
    badge: 'Optical',
  },
  {
    id: 'nasa-mast',
    name: 'DSS Color (NASA/STScI)',
    url: 'https://stpubdata.s3.us-east-1.amazonaws.com/mast/skybackgrounds/DSSColor',
    badge: 'AWS S3',
  },
  {
    id: 'cds-2mass',
    name: '2MASS (CDS ID)',
    url: 'CDS/P/2MASS/color',
    badge: 'CDS',
  },
] as const

export type HipsSurveyId = typeof HIPS_SURVEYS[number]['id']

export const DEFAULT_ALADIN_SURVEY = HIPS_SURVEYS[0].url
