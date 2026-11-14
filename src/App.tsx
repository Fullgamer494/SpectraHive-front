// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useCallback } from 'react'
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

  // 1. Commanded Target Coordinates (changed when clicking shortcuts, searching, or clicking FOV buttons)
  const [commandedCoords, setCommandedCoords] = useState<TargetCoordinates>({
    ra: DEFAULT_OBJECT.ra,
    dec: DEFAULT_OBJECT.dec,
    fov: DEFAULT_OBJECT.defaultFov,
  })

  // 2. Real-time Live Telemetry from Aladin Viewport (updated smoothly as user pans and zooms)
  const [liveCenter, setLiveCenter] = useState<{ ra: number; dec: number }>({
    ra: DEFAULT_OBJECT.ra,
    dec: DEFAULT_OBJECT.dec,
  })
  const [liveFov, setLiveFov] = useState<number>(DEFAULT_OBJECT.defaultFov)

  // 3. Real-time Cursor Coordinates (under mouse pointer)
  const [hoverCoords, setHoverCoords] = useState<{ ra: number; dec: number } | null>(null)

  // 4. User Selected Celestial Target (from clicking on sky/star - RF-10)
  const [clickedCoords, setClickedCoords] = useState<{ ra: number; dec: number } | null>(null)

  const handleSelectObject = useCallback((obj: TestObject) => {
    setActiveObject(obj)
    setClickedCoords(null)
    setCommandedCoords({
      ra: obj.ra,
      dec: obj.dec,
      fov: obj.defaultFov,
    })
    setLiveCenter({ ra: obj.ra, dec: obj.dec })
    setLiveFov(obj.defaultFov)
  }, [])

  const handleFovChange = useCallback((fov: 1 | 2) => {
    setCommandedCoords((prev) => ({ ...prev, fov }))
    setLiveFov(fov)
  }, [])

  // Event handler for Aladin positionChanged (pan / drag)
  const handlePositionChange = useCallback((ra: number, dec: number) => {
    setLiveCenter({ ra, dec })
  }, [])

  // Event handler for Aladin zoomChanged (mouse wheel zoom)
  const handleZoomChange = useCallback((fov: number) => {
    setLiveFov(fov)
  }, [])

  // Event handler for clicking on any celestial coordinate (RF-10)
  const handleClickCoordinates = useCallback((ra: number, dec: number) => {
    setClickedCoords({ ra, dec })
  }, [])

  // Event handler for centering camera directly on the selected target
  const handleCenterOnSelected = useCallback(() => {
    if (clickedCoords) {
      setCommandedCoords((prev) => ({
        ...prev,
        ra: clickedCoords.ra,
        dec: clickedCoords.dec,
      }))
      setLiveCenter({ ra: clickedCoords.ra, dec: clickedCoords.dec })
    }
  }, [clickedCoords])

  // Event handler for hovering over the sky canvas
  const handleHoverCoordinates = useCallback((ra: number, dec: number) => {
    setHoverCoords({ ra, dec })
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* 1. Aladin Lite Interactive Canvas Backdrop (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <AladinViewer
          coordinates={commandedCoords}
          survey={activeSurvey}
          selectedCoordinates={clickedCoords}
          onPositionChange={handlePositionChange}
          onZoomChange={handleZoomChange}
          onClickCoordinates={handleClickCoordinates}
          onHoverCoordinates={handleHoverCoordinates}
        />
      </div>

      {/* 2. Dark Space Glassmorphism HUD Overlay (Floating on top) */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6">
        {/* Top Section: Mission Header & Telemetry */}
        <div className="flex flex-col gap-3 max-w-7xl mx-auto w-full">
          <HudHeader
            coordinates={{ ...commandedCoords, ra: liveCenter.ra, dec: liveCenter.dec }}
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
          <CoordinatesHud
            centerCoords={{ ...commandedCoords, ra: liveCenter.ra, dec: liveCenter.dec }}
            currentFov={liveFov}
            hoverCoords={hoverCoords}
            clickedCoords={clickedCoords}
            activeObject={activeObject}
            onClearClicked={() => setClickedCoords(null)}
            onCenterOnSelected={handleCenterOnSelected}
          />

          {/* Mission Status Badge */}
          <div className="pointer-events-auto rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10 px-3.5 py-2 font-mono text-[10px] text-slate-400 shadow-lg hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-semibold">STAGE 01: TARGET LOCK ACTIVE</span>
            </div>
            <p className="text-slate-500 mt-0.5">
              Click any star to lock coordinates with green celestial pin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
