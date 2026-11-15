// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import { ArrowUpRight } from 'lucide-react'
import { TEST_OBJECTS } from '../../data/test-objects'
import type { TestObject } from '../../types/quadrant'

interface TestObjectShortcutsProps {
  activeObjectId?: string
  onSelectObject: (obj: TestObject) => void
}

export function TestObjectShortcuts({ activeObjectId, onSelectObject }: TestObjectShortcutsProps) {
  return (
    <div className="workspace-targets">
      <p>Select one of the five objects to explore. Each target opens at a 2° field of view.</p>
      {(['movimiento', 'brillo'] as const).map((type) => (
        <section key={type}>
          <div className="workspace-target-group"><strong>{type === 'movimiento' ? 'Motion' : 'Brightness'}</strong><span>{type === 'movimiento' ? 'Look for a change in position' : 'Look for a change in brightness'}</span></div>
          {TEST_OBJECTS.filter((obj) => obj.tipoPrueba === type).map((obj) => (
            <button key={obj.id} type="button" aria-pressed={obj.id === activeObjectId} onClick={() => onSelectObject(obj)}>
              <span>{obj.name}<small>RA {obj.ra.toFixed(4)}° / DEC {obj.dec.toFixed(4)}°</small></span><ArrowUpRight aria-hidden="true" />
            </button>
          ))}
        </section>
      ))}
    </div>
  )
}
