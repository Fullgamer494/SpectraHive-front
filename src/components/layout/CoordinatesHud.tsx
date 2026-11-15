// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import type { TargetCoordinates, TestObject } from '../../types/quadrant'
import { raDegToSexagesimal, decDegToSexagesimal } from '../../lib/coordinates'

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
      <div className="workspace-panel-heading"><h2 id="coordinates-title">Sky coordinates</h2><span className="module-index">02 / J2000</span></div>
      <section className="telemetry-section">
        <h3>Map center</h3>
        <p className="telemetry-explainer">The point at the center of the map. RA runs east–west; Dec runs north–south.</p>
        <dl className="telemetry-pair"><div><dt>RA · right ascension</dt><dd>{centerCoords.ra.toFixed(4)}°</dd></div><div><dt>Dec · declination</dt><dd>{centerCoords.dec >= 0 ? '+' : ''}{centerCoords.dec.toFixed(4)}°</dd></div></dl>
        <p className="coordinate-sexagesimal">{raDegToSexagesimal(centerCoords.ra)} / {decDegToSexagesimal(centerCoords.dec)}</p>
        <div className="telemetry-line"><span>Map width × height</span><strong>{(currentFov ?? centerCoords.fov).toFixed(2)}° × {(currentFov ?? centerCoords.fov).toFixed(2)}°</strong></div>
      </section>
      <section className="telemetry-section">
        <h3>Under pointer</h3>
        <p className="telemetry-explainer">Position beneath your cursor. Click the sky to inspect that point.</p>
        {hoverCoords ? <><p className="telemetry-value">RA {hoverCoords.ra.toFixed(4)}° · Dec {hoverCoords.dec >= 0 ? '+' : ''}{hoverCoords.dec.toFixed(4)}°</p><p className="coordinate-sexagesimal">{raDegToSexagesimal(hoverCoords.ra)} / {decDegToSexagesimal(hoverCoords.dec)}</p></> : <p className="telemetry-hint">Move the pointer over the sky map.</p>}
      </section>
      <section className="telemetry-section" data-selected={Boolean(clickedCoords)}>
        <h3>Point for inspection or report</h3>
        {clickedCoords ? <><p className="telemetry-explainer">This is the sky position used when you report an anomaly.</p><p className="telemetry-value">RA {clickedCoords.ra.toFixed(5)}° · Dec {clickedCoords.dec >= 0 ? '+' : ''}{clickedCoords.dec.toFixed(5)}°</p><p className="coordinate-sexagesimal">{raDegToSexagesimal(clickedCoords.ra)} / {decDegToSexagesimal(clickedCoords.dec)}</p><div className="telemetry-actions">{onCenterOnSelected && <button type="button" onClick={onCenterOnSelected}>Center map</button>}{onClearClicked && <button type="button" onClick={onClearClicked}>Clear point</button>}</div></> : <p className="telemetry-hint">Click the map or image to set a point for inspection and reporting.</p>}
      </section>
      {activeObject && <p className="telemetry-description">{activeObject.name} · {activeObject.description}</p>}
    </div>
  )
}
