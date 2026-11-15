// Assisted by Codex (SI) — reviewed by pendiente
import type { TutorialStep } from '../types/tutorial'

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Explore the sky together',
    body: 'This quick guide walks through choosing a field, comparing two epochs, reviewing changes, and reporting what you find. You can skip it and reopen it any time.',
  },
  {
    id: 'targets',
    title: 'Choose a test object',
    body: 'These are the five objects the challenge asks you to test. Barnard’s Star, Epsilon Indi B, and WISE 0855 show motion. RW Aurigae and R Draconis show brightness changes, not motion. Select one to center the map.',
    target: 'targets',
  },
  {
    id: 'queue',
    title: 'Move between fields',
    body: 'Use Previous and Next field to review the available quadrant queue. Selecting a field updates its coordinates in the shareable URL.',
    target: 'queue',
  },
  {
    id: 'field',
    title: 'Set the field of view',
    body: 'Choose 1° or 2° to set the field width. The URL includes RA, Dec, and FOV so you can share this view. Sky layer changes the background map, not the two analysis epochs.',
    target: 'fov',
  },
  {
    id: 'blink',
    title: 'Compare Epoch A and B',
    body: 'The Blink view alternates two images of the same field. Pause playback or choose Epoch A and Epoch B yourself. Look for a position shift in motion objects or a light change in brightness objects.',
    target: 'blink',
  },
  {
    id: 'difference',
    title: 'Inspect the difference',
    body: 'Open Difference |B − A|. Fixed sources cancel, while changes remain visible. The threshold and candidate explanations help you judge whether a bright point is meaningful. An empty candidate list is also a valid result.',
    target: 'difference',
  },
  {
    id: 'report',
    title: 'Select and report',
    body: 'Click a point in the Blink image or choose a difference candidate, then use Report anomaly. Choose motion for position changes or brightness for light changes. If you find nothing, use Mark clean. A report is sent only when you confirm it.',
    target: 'report',
  },
  {
    id: 'dna',
    title: 'Explore Cosmic DNA',
    body: 'Cosmic DNA is a precalculated visual spectral signature for comparison, not a direct chemical identification. Reports need three matching validations on the same report to be confirmed; demo votes are labeled simulated.',
    target: 'dna',
  },
]
