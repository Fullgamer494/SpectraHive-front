// Assisted by Codex (SI) — reviewed by pendiente
import { ChartNoAxesColumn, Crosshair, LayoutGrid, PanelsTopLeft } from 'lucide-react'

interface WorkspaceNavProps {
  onFocusSection: (section: 'targets' | 'coordinates' | 'inspector') => void
  onOpenDna: () => void
}

export function WorkspaceNav({ onFocusSection, onOpenDna }: WorkspaceNavProps) {
  return (
    <nav className="workspace-nav" aria-label="Observation tools">
      <span className="workspace-nav-label">TOOLS</span>
      <button id="nav-targets" type="button" aria-controls="panel-targets" onClick={() => onFocusSection('targets')}>
        <LayoutGrid className="workspace-nav-icon" aria-hidden="true" /><span>Targets</span>
      </button>
      <button id="nav-coordinates" type="button" aria-controls="panel-coordinates" onClick={() => onFocusSection('coordinates')}>
        <Crosshair className="workspace-nav-icon" aria-hidden="true" /><span>Sky details</span>
      </button>
      <button id="nav-inspector" type="button" aria-controls="panel-inspector" onClick={() => onFocusSection('inspector')}>
        <PanelsTopLeft className="workspace-nav-icon" aria-hidden="true" /><span>Inspector</span>
      </button>
      <button type="button" onClick={onOpenDna} aria-haspopup="dialog">
        <ChartNoAxesColumn className="workspace-nav-icon" aria-hidden="true" /><span>Cosmic DNA</span>
      </button>
    </nav>
  )
}
