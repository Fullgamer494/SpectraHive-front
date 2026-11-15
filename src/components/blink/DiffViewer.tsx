// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import { useEffect } from 'react'
import { useDiff } from '../../hooks/useDiff'
import type { DiffCandidate } from '../../types/api'

interface DiffViewerProps {
  cuadranteId?: string
  epocaA?: string
  epocaB?: string
  onSelectCandidate?: (candidate: DiffCandidate) => void
}

export function DiffViewer({
  cuadranteId,
  epocaA = 'DR1',
  epocaB = 'QR3',
  onSelectCandidate,
}: DiffViewerProps) {
  const { diffData, isLoading, error, fetchDiffData } = useDiff({
    cuadranteId,
    epocaA,
    epocaB,
    autoFetch: true,
  })

  useEffect(() => {
    fetchDiffData()
  }, [cuadranteId, fetchDiffData])

  return (
    <div className="difference-view">
      <div className="inspector-image image-stage">
        {diffData?.imagen && <img className="epoch-image is-visible" src={diffData.imagen} alt="Absolute difference between epochs B and A" />}
        <div className="image-caption"><span>|B − A|</span><span>{diffData?.fuente === 'sintetico' ? 'Synthetic fallback' : diffData?.fuente ?? ''}</span></div>
        {isLoading && <div className="image-message" role="status"><span className="loading-mark" />Computing difference…</div>}
        {error && <div className="image-message" role="alert"><p>{error}</p><button type="button" onClick={() => void fetchDiffData()}>Retry difference</button></div>}
        {!isLoading && !error && !diffData?.imagen && <div className="image-message">No difference image available</div>}
      </div>
      <section className="difference-results" aria-label="Difference candidates">
        <div className="difference-summary"><div><span className="workspace-eyebrow">CANDIDATES</span><strong>{diffData?.candidatos.length ?? '—'}</strong></div><div><span className="workspace-eyebrow">DETECTION THRESHOLD</span><strong>{diffData ? `> ${diffData.umbral.toFixed(2)}` : '—'}</strong></div></div>
        {diffData?.candidatos.map((candidate, index) => (
          <button type="button" className="candidate-row" key={`${candidate.ra}_${candidate.dec}`} onClick={() => onSelectCandidate?.(candidate)}>
            <span><strong>Candidate {String(index + 1).padStart(2, '0')}</strong><span>Signal {candidate.valor.toFixed(2)} / threshold {diffData.umbral.toFixed(2)}</span></span>
            <span>RA {candidate.ra.toFixed(4)}° / DEC {candidate.dec.toFixed(4)}°</span><span>{candidate.motivo}</span>
          </button>
        ))}
        {!isLoading && diffData?.candidatos.length === 0 && <p>No points exceed the detection threshold in this field.</p>}
        <section className="difference-explanation"><h3>How to read the difference</h3><p>Unchanged sources cancel toward black. A signal above the threshold may indicate movement or a change in brightness. Compare both epochs and review each candidate's explanation before reporting.</p></section>
      </section>
    </div>
  )
}
