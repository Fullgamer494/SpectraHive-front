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
      <div className="workspace-panel-heading"><h2 id="coordinates-title">Coordinates</h2><span className="module-index">02 / J2000</span></div>
      <section className="telemetry-section">
        <h3>Viewport center</h3>
        <dl className="telemetry-pair"><div><dt>RA / degrees</dt><dd>{centerCoords.ra.toFixed(4)}°</dd></div><div><dt>Dec / degrees</dt><dd>{centerCoords.dec >= 0 ? '+' : ''}{centerCoords.dec.toFixed(4)}°</dd></div></dl>
        <p className="coordinate-sexagesimal">{raDegToSexagesimal(centerCoords.ra)} / {decDegToSexagesimal(centerCoords.dec)}</p>
        <div className="telemetry-line"><span>Field of view</span><strong>{(currentFov ?? centerCoords.fov).toFixed(2)}° × {(currentFov ?? centerCoords.fov).toFixed(2)}°</strong></div>
      </section>
      <section className="telemetry-section">
        <h3>Cursor position</h3>
        {hoverCoords ? <><p className="telemetry-value">{hoverCoords.ra.toFixed(4)}° / {hoverCoords.dec.toFixed(4)}°</p><p className="coordinate-sexagesimal">{raDegToSexagesimal(hoverCoords.ra)} / {decDegToSexagesimal(hoverCoords.dec)}</p></> : <p className="telemetry-hint">Move the pointer over the sky to read its coordinates.</p>}
      </section>
      <section className="telemetry-section" data-selected={Boolean(clickedCoords)}>
        <h3>Selected target</h3>
        {clickedCoords ? <><p className="telemetry-value">{clickedCoords.ra.toFixed(5)}° / {clickedCoords.dec.toFixed(5)}°</p><p className="coordinate-sexagesimal">{raDegToSexagesimal(clickedCoords.ra)} / {decDegToSexagesimal(clickedCoords.dec)}</p><div className="telemetry-actions">{onCenterOnSelected && <button type="button" onClick={onCenterOnSelected}>Center view</button>}{onClearClicked && <button type="button" onClick={onClearClicked}>Clear selection</button>}</div></> : <p className="telemetry-hint">Click a source on the sky or cutout to select a target.</p>}
      </section>
      {activeObject && <p className="telemetry-description">{activeObject.name} · {activeObject.description}</p>}
    </div>
  )
}
