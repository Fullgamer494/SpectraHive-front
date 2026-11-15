// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import { ChartNoAxesColumn, Flag, Minus, Pause, Play, Repeat2, RotateCcw, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useBlink } from '../../hooks/useBlink'
import { DiffViewer } from './DiffViewer'
import type { DiffCandidate } from '../../types/api'

interface BlinkViewerProps {
  ra: number
  dec: number
  fov?: number
  cuadranteId?: string
  epocaA?: string
  epocaB?: string
  objectName?: string
  tipoPrueba?: 'movimiento' | 'brillo'
  onSelectCandidate?: (candidate: DiffCandidate) => void
  onSelectTargetCoords?: (coords: { ra: number; dec: number }) => void
  onOpenReport?: () => void
  onMarkClean?: () => void
  onOpenDna?: () => void
}

export function BlinkViewer({
  ra,
  dec,
  fov = 2,
  cuadranteId,
  epocaA = 'DR1',
  epocaB = 'QR3',
  objectName,
  tipoPrueba,
  onSelectCandidate,
  onSelectTargetCoords,
  onOpenReport,
  onMarkClean,
  onOpenDna,
}: BlinkViewerProps) {
  const [activeTab, setActiveTab] = useState<'blink' | 'diff'>('blink')
  const [reticlePos, setReticlePos] = useState<{ xPct: number; yPct: number }>({
    xPct: 50,
    yPct: 50,
  })
  const [isCustomTarget, setIsCustomTarget] = useState<boolean>(false)

  // Reset reticle position when switching quadrants
  useEffect(() => {
    setReticlePos({ xPct: 50, yPct: 50 })
    setIsCustomTarget(false)
  }, [cuadranteId, objectName])

  const handleCutoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    const u = Math.max(0, Math.min(1, clickX / rect.width))
    const v = Math.max(0, Math.min(1, clickY / rect.height))

    const xPct = u * 100
    const yPct = v * 100
    setReticlePos({ xPct, yPct })
    setIsCustomTarget(true)

    // Invert pixel coordinate to celestial offset:
    // u: 0 (left = East = +RA) to 1 (right = West = -RA)
    // v: 0 (top = North = +Dec) to 1 (bottom = South = -Dec)
    const dx = u - 0.5
    const dy = 0.5 - v

    const cosDec = Math.cos((dec * Math.PI) / 180)
    const safeCos = Math.abs(cosDec) > 0.001 ? Math.abs(cosDec) : 1

    const raOffset = (-dx * fov) / safeCos
    const decOffset = dy * fov

    const targetRa = ((ra + raOffset) % 360 + 360) % 360
    const targetDec = Math.max(-90, Math.min(90, dec + decOffset))

    onSelectTargetCoords?.({ ra: targetRa, dec: targetDec })
  }

  const handleResetTarget = (e: React.MouseEvent) => {
    e.stopPropagation()
    setReticlePos({ xPct: 50, yPct: 50 })
    setIsCustomTarget(false)
    onSelectTargetCoords?.({ ra, dec })
  }

  const {
    currentEpoch,
    isPlaying,
    speedMs,
    imageA,
    imageB,
    labelA,
    labelB,
    sourceTag,
    isLoading,
    error,
    togglePlay,
    setEpoch,
    setSpeed,
    reload,
  } = useBlink({ ra, dec, fov })

  const isMotion = tipoPrueba === 'movimiento'

  return (
    <section className="inspector" aria-label="Image inspector">
      <header className="inspector-heading">
        <div className="inspector-kicker"><span>Inspector / {tipoPrueba ? (isMotion ? 'Motion study' : 'Brightness study') : 'Field study'}</span>
          <span className="module-index">03</span>
        </div>
        <h1 className="panel-title">{objectName ?? 'Custom field'}</h1>
        <p className="inspector-target">{isMotion ? 'Compare object position between epochs.' : tipoPrueba === 'brillo' ? 'Compare brightness between epochs; position stays fixed.' : 'Compare the same field across two epochs.'}</p>
      </header>
      <div className="inspector-modes" role="group" aria-label="Analysis mode">
        <button type="button" aria-pressed={activeTab === 'blink'} onClick={() => setActiveTab('blink')} data-tutorial="blink"><Repeat2 aria-hidden="true" /> Blink A / B</button>
        <button type="button" aria-pressed={activeTab === 'diff'} onClick={() => setActiveTab('diff')} data-tutorial="difference"><Minus aria-hidden="true" /> Difference |B − A|</button>
      </div>
      {activeTab === 'diff' ? (
        <DiffViewer cuadranteId={cuadranteId} epocaA={epocaA} epocaB={epocaB} onSelectCandidate={onSelectCandidate} />
      ) : (
        <>
          <div className="inspector-image image-stage" onClick={handleCutoutClick} title="Click a source in the image to select its coordinates">
            {imageA && <img src={imageA} alt="Epoch A infrared cutout" className={currentEpoch === 'A' ? 'epoch-image is-visible' : 'epoch-image'} />}
            {imageB && <img src={imageB} alt="Epoch B infrared cutout" className={currentEpoch === 'B' ? 'epoch-image is-visible' : 'epoch-image'} />}
            {!isLoading && !error && (
              <div className="image-reticle" style={{ left: `${reticlePos.xPct}%`, top: `${reticlePos.yPct}%` }} aria-hidden="true"><span /><span /></div>
            )}
            <div className="image-caption"><span>Epoch {currentEpoch} / {currentEpoch === 'A' ? labelA : labelB}</span><span>{sourceTag === 'sintetico' ? 'Synthetic fallback' : sourceTag === 'irsa' ? 'IRSA' : 'Loading'}</span></div>
            {isLoading && <div className="image-message" role="status"><span className="loading-mark" />Loading cutouts…</div>}
            {error && <div className="image-message" role="alert"><p>{error}</p><button type="button" onClick={(event) => { event.stopPropagation(); void reload() }}>Retry</button></div>}
            {isCustomTarget && <button className="image-reset" type="button" onClick={handleResetTarget}><RotateCcw aria-hidden="true" /> Reset selection</button>}
          </div>
          <div className="inspector-playback">
            <button type="button" className="playback-toggle" onClick={togglePlay} aria-label={isPlaying ? 'Pause blink' : 'Play blink'}>{isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}{isPlaying ? 'Pause' : 'Play'}</button>
            <div className="epoch-controls" role="group" aria-label="Select epoch">
              {(['A', 'B'] as const).map((epoch) => <button key={epoch} type="button" aria-pressed={currentEpoch === epoch} onClick={() => { if (isPlaying) togglePlay(); setEpoch(epoch) }}>Epoch {epoch}</button>)}
            </div>
            <label className="playback-speed">Interval<select value={speedMs} onChange={(event) => setSpeed(Number(event.target.value))}><option value={300}>0.3 s</option><option value={500}>0.5 s</option><option value={1000}>1.0 s</option></select></label>
          </div>
        </>
      )}
      <div className="inspector-facts">
        <div className="facts-heading"><span>Map center · J2000</span><span>Field width: {fov}°</span></div>
        <dl><div><dt>Right ascension</dt><dd>{ra.toFixed(4)}<small>°</small></dd></div><div><dt>Declination</dt><dd>{dec >= 0 ? '+' : ''}{dec.toFixed(4)}<small>°</small></dd></div></dl>
        <p>{tipoPrueba ? (isMotion ? 'Look for a shift in position between epochs.' : 'Look for a change in brightness, not position.') : 'Compare the same field across two epochs.'} <span>False color: percentiles 1–99.</span></p>
      </div>
      <footer className="inspector-actions" data-tutorial="report">
        <button type="button" className="action-primary" onClick={onOpenReport}><Flag aria-hidden="true" /> Report anomaly</button>
        <div><button type="button" onClick={onMarkClean}><ShieldCheck aria-hidden="true" /> Mark clean</button><button type="button" onClick={onOpenDna}><ChartNoAxesColumn aria-hidden="true" /> Cosmic DNA</button></div>
      </footer>
    </section>
  )
}
