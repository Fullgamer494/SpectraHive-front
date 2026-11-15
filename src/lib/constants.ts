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
 * Public HiPS mirrors are served over HTTPS and allow cross-origin tile loading.
 */
export const HIPS_SURVEYS = [
  {
    id: 'casda-2mass',
    name: '2MASS Infrared (CASDA)',
    url: 'https://casda.csiro.au/hips/2MASS/Color',
    badge: 'IR',
  },
  {
    id: 'casda-dss',
    name: 'DSS2 Color (CASDA)',
    url: 'https://casda.csiro.au/hips/DSS2/color',
    badge: 'Optical',
  },
  {
    id: 'nasa-mast',
    name: 'DSS Color (NASA/STScI)',
    url: 'https://stpubdata.s3.us-east-1.amazonaws.com/mast/skybackgrounds/DSSColor',
    badge: 'AWS S3',
  },
  {
    id: 'cds-2mass-mirror',
    name: '2MASS (CDS mirror)',
    url: 'https://hips.china-vo.org/m/CDS_P_2MASS_color',
    badge: 'CDS',
  },
] as const

export type HipsSurveyId = typeof HIPS_SURVEYS[number]['id']

export const DEFAULT_ALADIN_SURVEY = HIPS_SURVEYS[0].url
