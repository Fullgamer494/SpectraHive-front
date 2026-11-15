// Assisted by Codex (SI) — reviewed by pendiente
import { useCallback, useState } from 'react'
import { TUTORIAL_STEPS } from '../data/tutorial-steps'

const STORAGE_KEY = 'spectrahive:tutorial:v1'

function hasSeenTutorial(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'seen'
  } catch {
    return true
  }
}

export function useGuidedTutorial() {
  const [stepIndex, setStepIndex] = useState<number | null>(() => hasSeenTutorial() ? null : 0)

  const close = useCallback(() => {
    setStepIndex(null)
    try { window.localStorage.setItem(STORAGE_KEY, 'seen') } catch { /* Storage may be unavailable. */ }
  }, [])

  const start = useCallback(() => setStepIndex(0), [])
  const next = useCallback(() => setStepIndex((index) => index === null ? null : Math.min(index + 1, TUTORIAL_STEPS.length - 1)), [])
  const back = useCallback(() => setStepIndex((index) => index === null ? null : Math.max(index - 1, 0)), [])

  return { stepIndex, start, next, back, close }
}
