// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState } from 'react'
import { AladinViewer } from './components/blink/AladinViewer'
import { HudHeader } from './components/layout/HudHeader'
import { TestObjectShortcuts } from './components/search/TestObjectShortcuts'
import { CoordinatesHud } from './components/layout/CoordinatesHud'
import { DEFAULT_OBJECT } from './data/test-objects'
import { DEFAULT_ALADIN_SURVEY } from './lib/constants'
import type { TargetCoordinates, TestObject } from './types/quadrant'

export default function App() {
  const [activeObject, setActiveObject] = useState<TestObject>(DEFAULT_OBJECT)
  const [activeSurvey, setActiveSurvey] = useState<string>(DEFAULT_ALADIN_SURVEY)
  const [coordinates, setCoordinates] = useState<TargetCoordinates>({
    ra: DEFAULT_OBJECT.ra,
    dec: DEFAULT_OBJECT.dec,
    fov: DEFAULT_OBJECT.defaultFov,
  })

  const handleSelectObject = (obj: TestObject) => {
    setActiveObject(obj)
    setCoordinates({
      ra: obj.ra,
      dec: obj.dec,
      fov: obj.defaultFov,
    })
  }

  const handleFovChange = (fov: 1 | 2) => {
    setCoordinates((prev) => ({ ...prev, fov }))
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* 1. Aladin Lite Interactive Canvas Backdrop (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <AladinViewer coordinates={coordinates} survey={activeSurvey} />
      </div>

      {/* 2. Dark Space Glassmorphism HUD Overlay (Floating on top) */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6">
        {/* Top Section: Mission Header & Telemetry */}
        <div className="flex flex-col gap-3 max-w-7xl mx-auto w-full">
          <HudHeader
            coordinates={coordinates}
            activeObjectName={activeObject.name}
            activeObjectType={activeObject.tipoPrueba}
            activeSurvey={activeSurvey}
            onSurveyChange={setActiveSurvey}
            onFovChange={handleFovChange}
          />
          <TestObjectShortcuts
            activeObjectId={activeObject.id}
            onSelectObject={handleSelectObject}
          />
        </div>

        {/* Bottom Section: Astrometric Telemetry HUD */}
        <div className="flex flex-wrap items-end justify-between gap-4 max-w-7xl mx-auto w-full">
          <CoordinatesHud coordinates={coordinates} activeObject={activeObject} />

          {/* Mission Status Badge */}
          <div className="pointer-events-auto rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10 px-3 py-2 font-mono text-[10px] text-slate-400 shadow-lg hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-semibold">STAGE 01: VIEWPORT READY</span>
            </div>
            <p className="text-slate-500 mt-0.5">
              Target: {activeObject.name} • SPHEREx Infrared Tracker
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
