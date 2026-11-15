// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import { ArrowUpRight, ChevronDown, MoveUpRight, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TEST_OBJECTS } from '../../data/test-objects'
import type { TestObject } from '../../types/quadrant'

interface TestObjectShortcutsProps {
  activeObjectId?: string
  onSelectObject: (obj: TestObject) => void
}

export function TestObjectShortcuts({ activeObjectId, onSelectObject }: TestObjectShortcutsProps) {
  const [expandedGroup, setExpandedGroup] = useState<'movimiento' | 'brillo' | null>('movimiento')

  useEffect(() => {
    const activeGroup = TEST_OBJECTS.find((obj) => obj.id === activeObjectId)?.tipoPrueba
    if (activeGroup) setExpandedGroup(activeGroup)
  }, [activeObjectId])

  return (
    <div className="workspace-targets">
      <p className="targets-intro">Choose a test object to center the sky map. Each opens with a 2° field of view.</p>
      {(['movimiento', 'brillo'] as const).map((type) => (
        <section key={type} className={`target-group target-group-${type}`}>
          <button className="workspace-target-group" type="button" aria-expanded={expandedGroup === type} aria-controls={`target-options-${type}`} onClick={() => setExpandedGroup((current) => current === type ? null : type)}>
            {type === 'movimiento' ? <MoveUpRight aria-hidden="true" /> : <Sun aria-hidden="true" />}
            <span className="target-group-copy"><strong>{type === 'movimiento' ? 'Motion' : 'Brightness'}</strong><small>{type === 'movimiento' ? 'Position changes' : 'Light changes, not position'}</small></span>
            <span className="target-group-count">{TEST_OBJECTS.filter((obj) => obj.tipoPrueba === type).length}</span>
            <ChevronDown className="target-group-chevron" aria-hidden="true" />
          </button>
          <div id={`target-options-${type}`} hidden={expandedGroup !== type}>
          {TEST_OBJECTS.filter((obj) => obj.tipoPrueba === type).map((obj) => (
            <button key={obj.id} type="button" aria-pressed={obj.id === activeObjectId} onClick={() => onSelectObject(obj)}>
              <span className="target-object-copy"><strong>{obj.name}</strong><small><span>RA</span> {obj.ra.toFixed(4)}° <i>/</i> <span>Dec</span> {obj.dec >= 0 ? '+' : ''}{obj.dec.toFixed(4)}°</small></span><ArrowUpRight aria-hidden="true" />
            </button>
          ))}
          </div>
        </section>
      ))}
    </div>
  )
}
