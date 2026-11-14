// Assisted by Antigravity (SI) — reviewed by Luissmont
import { TEST_OBJECTS } from '../../data/test-objects'
import type { TestObject } from '../../types/quadrant'

interface TestObjectShortcutsProps {
  activeObjectId?: string
  onSelectObject: (obj: TestObject) => void
}

export function TestObjectShortcuts({
  activeObjectId,
  onSelectObject,
}: TestObjectShortcutsProps) {
  return (
    <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
          Challenge Test Objects (RF-04)
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          5 targets
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TEST_OBJECTS.map((obj) => {
          const isActive = obj.id === activeObjectId
          const isMotion = obj.tipoPrueba === 'movimiento'

          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => onSelectObject(obj)}
              className={`group flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs transition-all cursor-pointer border ${
                isActive
                  ? 'bg-cyan-950/70 border-cyan-400/80 text-cyan-200 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
                  : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-slate-800/60 hover:border-white/20'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isMotion ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                }`}
              />
              <span className="font-semibold">{obj.name}</span>
              <span
                className={`text-[9px] uppercase px-1.5 py-0.2 rounded ${
                  isMotion
                    ? 'bg-amber-500/10 text-amber-300'
                    : 'bg-emerald-500/10 text-emerald-300'
                }`}
              >
                {isMotion ? 'Mot' : 'Bri'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

