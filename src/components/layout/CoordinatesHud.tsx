// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import type { TargetCoordinates, TestObject } from '../../types/quadrant'
import { raDegToSexagesimal, decDegToSexagesimal } from '../../lib/coordinates'
import { Crosshair, MapPin, MousePointer2 } from 'lucide-react'

interface CoordinatesHudProps {
  centerCoords: TargetCoordinates
  currentFov?: number
  hoverCoords: { ra: number; dec: number } | null
  clickedCoords: { ra: number; dec: number } | null
  activeObject?: TestObject
  onClearClicked?: () => void
  onCenterOnSelected?: () => void
}

export function CoordinatesHud({ centerCoords, currentFov, hoverCoords, clickedCoords, activeObject, onClearClicked, onCenterOnSelected }: CoordinatesHudProps) {
  return (
    <div className="coordinates-panel">
      <div className="workspace-panel-heading sky-coordinates-heading"><h2 id="coordinates-title"><Crosshair aria-hidden="true" /> Sky coordinates</h2><span className="module-index">J2000</span></div>
      <section className="telemetry-section telemetry-center">
        <div className="telemetry-section-title"><span className="telemetry-step">01</span><h3>Map center</h3><span className="sky-fix-status">LIVE FIX</span></div>
        <div className="sky-fix"><div className="sky-fix-dial" aria-hidden="true"><span className="sky-fix-north">N</span><span className="sky-fix-east">E</span><Crosshair /></div><dl className="telemetry-pair"><div><dt>RA <span>Right ascension</span></dt><dd>{centerCoords.ra.toFixed(4)}°</dd></div><div><dt>Dec <span>Declination</span></dt><dd>{centerCoords.dec >= 0 ? '+' : ''}{centerCoords.dec.toFixed(4)}°</dd></div></dl></div>
        <p className="coordinate-sexagesimal"><span>HMS / DMS</span>{raDegToSexagesimal(centerCoords.ra)} / {decDegToSexagesimal(centerCoords.dec)}</p>
        <div className="telemetry-line"><span>Visible sky area</span><strong>{(currentFov ?? centerCoords.fov).toFixed(2)}° × {(currentFov ?? centerCoords.fov).toFixed(2)}°</strong></div>
      </section>
      <section className="telemetry-section">
        <div className="telemetry-section-title"><MousePointer2 aria-hidden="true" /><h3>Under pointer</h3><span className="telemetry-live">TRACKING</span></div>
        {hoverCoords ? <><p className="telemetry-value"><span>RA</span> {hoverCoords.ra.toFixed(4)}° <i>/</i> <span>Dec</span> {hoverCoords.dec >= 0 ? '+' : ''}{hoverCoords.dec.toFixed(4)}°</p><p className="coordinate-sexagesimal">{raDegToSexagesimal(hoverCoords.ra)} / {decDegToSexagesimal(hoverCoords.dec)}</p></> : <p className="telemetry-hint">Move the pointer over the map to read its coordinates.</p>}
      </section>
      <section className="telemetry-section" data-selected={Boolean(clickedCoords)}>
        <div className="telemetry-section-title"><MapPin aria-hidden="true" /><h3>Selected point</h3><span className="sky-selected-status">{clickedCoords ? 'READY' : 'EMPTY'}</span></div>
        {clickedCoords ? <><p className="telemetry-explainer">Coordinates that will be attached to your anomaly report.</p><p className="telemetry-value"><span>RA</span> {clickedCoords.ra.toFixed(5)}° <i>/</i> <span>Dec</span> {clickedCoords.dec >= 0 ? '+' : ''}{clickedCoords.dec.toFixed(5)}°</p><p className="coordinate-sexagesimal">{raDegToSexagesimal(clickedCoords.ra)} / {decDegToSexagesimal(clickedCoords.dec)}</p><div className="telemetry-actions">{onCenterOnSelected && <button type="button" onClick={onCenterOnSelected}>Center map</button>}{onClearClicked && <button type="button" onClick={onClearClicked}>Clear point</button>}</div></> : <p className="telemetry-hint">Click the map to set the position for inspection or reporting.</p>}
      </section>
      {activeObject && <p className="telemetry-description">{activeObject.name} · {activeObject.description}</p>}
    </div>
  )
}
