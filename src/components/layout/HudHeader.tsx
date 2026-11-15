// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import { Moon, Sun } from 'lucide-react'
import type { TargetCoordinates } from '../../types/quadrant'
import { HIPS_SURVEYS } from '../../lib/constants'

interface HudHeaderProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  coordinates: TargetCoordinates
  activeObjectName?: string
  activeObjectType?: 'movimiento' | 'brillo'
  activeSurvey: string
  onSurveyChange: (surveyUrl: string) => void
  onFovChange: (fov: 1 | 2) => void
}

export function HudHeader({ theme, onToggleTheme, coordinates, activeObjectName, activeObjectType, activeSurvey, onSurveyChange, onFovChange }: HudHeaderProps) {
  return (
    <header className="workspace-header">
      <div className="workspace-brand"><span>SpectraHive</span><span>SPHEREx / Citizen science</span></div>
      <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-pressed={theme === 'dark'} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
        {theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
        <span>Theme</span><strong>{theme === 'dark' ? 'Dark' : 'Light'}</strong>
      </button>
      <div className="workspace-current-target">
        <span className="workspace-eyebrow">OBSERVING</span>
        <strong>{activeObjectName ?? 'Custom field'}</strong>
        {activeObjectType && <span>{activeObjectType === 'movimiento' ? 'Motion' : 'Brightness'}</span>}
      </div>
      <div className="workspace-view-controls">
        <label htmlFor="survey-select">Sky layer</label>
        <select id="survey-select" value={activeSurvey} onChange={(e) => onSurveyChange(e.target.value)}>
          {HIPS_SURVEYS.map((survey) => <option key={survey.id} value={survey.url}>{survey.name} [{survey.badge}]</option>)}
        </select>
        <div className="workspace-fov" role="group" aria-label="Field of view">
          <span>FOV</span>
          {([1, 2] as const).map((fov) => <button key={fov} type="button" aria-pressed={coordinates.fov === fov} aria-label={`Set field of view to ${fov} degrees`} onClick={() => onFovChange(fov)}>{fov}°</button>)}
        </div>
      </div>
    </header>
  )
}
