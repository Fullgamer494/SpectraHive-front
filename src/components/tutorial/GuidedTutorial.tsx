// Assisted by Codex (SI) — reviewed by pendiente
import { useEffect, useRef, useState } from 'react'
import { TUTORIAL_STEPS } from '../../data/tutorial-steps'

interface GuidedTutorialProps {
  stepIndex: number | null
  onNext: () => void
  onBack: () => void
  onClose: () => void
}

interface HighlightRect { top: number; left: number; width: number; height: number }

export function GuidedTutorial({ stepIndex, onNext, onBack, onClose }: GuidedTutorialProps) {
  const [highlight, setHighlight] = useState<HighlightRect | null>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const step = stepIndex === null ? null : TUTORIAL_STEPS[stepIndex]

  useEffect(() => {
    if (!step) return
    const target = step.target ? document.querySelector<HTMLElement>(`[data-tutorial="${step.target}"]`) : null
    target?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })

    const update = () => {
      if (!target) { setHighlight(null); return }
      const rect = target.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) { setHighlight(null); return }
      setHighlight({ top: Math.max(4, rect.top - 5), left: Math.max(4, rect.left - 5), width: rect.width + 10, height: rect.height + 10 })
    }
    update()
    const observer = target ? new ResizeObserver(update) : null
    if (target && observer) observer.observe(target)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    const timer = window.setTimeout(update, 350)
    titleRef.current?.focus()
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      window.clearTimeout(timer)
    }
  }, [step])

  useEffect(() => {
    if (!step) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [step, onClose])

  if (!step || stepIndex === null) return null

  const isLast = stepIndex === TUTORIAL_STEPS.length - 1
  const cardStyle: React.CSSProperties = highlight && window.innerWidth > 700
    ? { top: Math.min(Math.max(16, highlight.top + highlight.height / 2 - 145), Math.max(16, window.innerHeight - 340)), left: highlight.left + highlight.width + 18 < window.innerWidth - 390 ? highlight.left + highlight.width + 18 : Math.max(16, highlight.left - 408) }
    : {}

  return (
    <div className="guided-tour" aria-live="off">
      <div className="guided-tour-shade" aria-hidden="true" />
      {highlight && <div className="guided-tour-highlight" style={highlight} aria-hidden="true" />}
      <section className="guided-tour-card" style={cardStyle} role="dialog" aria-modal="false" aria-labelledby="guided-tour-title" aria-describedby="guided-tour-body">
        <div className="guided-tour-topline"><span>FIELD GUIDE</span><span>Step {stepIndex + 1} of {TUTORIAL_STEPS.length}</span></div>
        <div className="guided-tour-progress" role="progressbar" aria-label="Tour progress" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={TUTORIAL_STEPS.length}><span style={{ width: `${(stepIndex + 1) / TUTORIAL_STEPS.length * 100}%` }} /></div>
        <h2 id="guided-tour-title" tabIndex={-1} ref={titleRef}>{step.title}</h2>
        <p id="guided-tour-body">{step.body}</p>
        <div className="guided-tour-actions">
          <button type="button" className="guided-tour-skip" onClick={onClose}>{isLast ? 'Close guide' : 'Skip tour'}</button>
          <div>
            {stepIndex > 0 && <button type="button" onClick={onBack}>Back</button>}
            <button type="button" className="guided-tour-next" onClick={isLast ? onClose : onNext}>{stepIndex === 0 ? 'Start tour' : isLast ? 'Finish' : 'Next'}</button>
          </div>
        </div>
      </section>
    </div>
  )
}
