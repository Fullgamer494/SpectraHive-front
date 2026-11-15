// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { QuadrantDto } from '../../types/api'

interface QuadrantQueueNavProps {
  quadrants: QuadrantDto[]
  currentIndex: number
  activeQuadrant: QuadrantDto | null
  isLoading?: boolean
  onNext: () => void
  onPrev: () => void
  onSelectIndex: (index: number) => void
}

const STATUS_LABELS = { pendiente: 'Pending', confirmado: 'Confirmed', descartado: 'Discarded' }

export function QuadrantQueueNav({ quadrants, currentIndex, activeQuadrant, isLoading = false, onNext, onPrev, onSelectIndex }: QuadrantQueueNavProps) {
  return (
    <nav className="workspace-queue" aria-label="Quadrant queue" aria-busy={isLoading}>
      <div className="workspace-queue-summary" aria-live="polite">
        <span className="workspace-eyebrow">OBSERVATION QUEUE</span>
        <span>{isLoading ? 'Loading fields…' : quadrants.length ? `${String(currentIndex + 1).padStart(2, '0')} / ${String(quadrants.length).padStart(2, '0')}` : 'No fields available'}</span>
        {activeQuadrant && <strong className="workspace-queue-name">{activeQuadrant.nombre}</strong>}
        {activeQuadrant && <span className="workspace-queue-status">{STATUS_LABELS[activeQuadrant.estado]}</span>}
      </div>
      <div className="workspace-queue-fields">
        {quadrants.map((q, index) => <button key={q.id} type="button" aria-current={index === currentIndex ? 'step' : undefined} onClick={() => onSelectIndex(index)} title={`${q.nombre} · ${STATUS_LABELS[q.estado]}`} aria-label={`Field ${index + 1}: ${q.nombre}, ${STATUS_LABELS[q.estado]}`}>{String(index + 1).padStart(2, '0')}<span className="workspace-field-state" data-state={q.estado} aria-hidden="true" /></button>)}
      </div>
      <div className="workspace-queue-actions">
        <button type="button" onClick={onPrev} disabled={!quadrants.length || isLoading} aria-label="Previous quadrant"><ArrowLeft aria-hidden="true" /> <span>Previous</span></button>
        <button type="button" onClick={onNext} disabled={!quadrants.length || isLoading} aria-label="Next quadrant"><span>Next field</span> <ArrowRight aria-hidden="true" /></button>
      </div>
    </nav>
  )
}
