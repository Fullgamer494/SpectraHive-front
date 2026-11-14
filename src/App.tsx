// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useCallback } from 'react'
import { AladinViewer } from './components/blink/AladinViewer'
import { HudHeader } from './components/layout/HudHeader'
import { TestObjectShortcuts } from './components/search/TestObjectShortcuts'
import { CoordinatesHud } from './components/layout/CoordinatesHud'
import { UrlErrorBanner } from './components/ui/UrlErrorBanner'
import { useUrlState } from './hooks/useUrlState'
import { DEFAULT_ALADIN_SURVEY } from './lib/constants'
import type { TestObject } from './types/quadrant'

export default function App() {
  const [activeSurvey, setActiveSurvey] = useState<string>(DEFAULT_ALADIN_SURVEY)

  // 1. Dynamic URL State hook (RF-01, RF-02, RF-03)
  const {
    coordinates: commandedCoords,
    activeObject,
    urlError,
    setCoordinatesAndUrl,
    clearUrlError,
  } = useUrlState()

  // 2. Real-time Live Telemetry from Aladin Viewport (updated smoothly as user pans and zooms)
  const [liveCenter, setLiveCenter] = useState<{ ra: number; dec: number }>({
    ra: commandedCoords.ra,
    dec: commandedCoords.dec,
  })
  const [liveFov, setLiveFov] = useState<number>(commandedCoords.fov)

  // 3. Real-time Cursor Coordinates (under mouse pointer)
  const [hoverCoords, setHoverCoords] = useState<{ ra: number; dec: number } | null>(null)

  // 4. User Selected Celestial Target (from clicking on sky/star - RF-10)
  const [clickedCoords, setClickedCoords] = useState<{ ra: number; dec: number } | null>(null)

  // User selects an official test object (RF-04) -> syncs state and pushes to browser history
  const handleSelectObject = useCallback(
    (obj: TestObject) => {
      setClickedCoords(null)
      setCoordinatesAndUrl(
        {
          ra: obj.ra,
          dec: obj.dec,
          fov: obj.defaultFov,
        },
        obj,
        true
      )
      setLiveCenter({ ra: obj.ra, dec: obj.dec })
      setLiveFov(obj.defaultFov)
    },
    [setCoordinatesAndUrl]
  )

  // User toggles FOV 1° or 2° (RF-02) -> syncs state and replaces URL param
  const handleFovChange = useCallback(
    (fov: 1 | 2) => {
      setCoordinatesAndUrl(
        {
          ...commandedCoords,
          fov,
        },
        activeObject,
        false
      )
      setLiveFov(fov)
    },
    [commandedCoords, activeObject, setCoordinatesAndUrl]
  )

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
      setCoordinatesAndUrl(
        {
          ...commandedCoords,
          ra: clickedCoords.ra,
          dec: clickedCoords.dec,
        },
        undefined,
        false
      )
      setLiveCenter({ ra: clickedCoords.ra, dec: clickedCoords.dec })
    }
  }, [clickedCoords, commandedCoords, setCoordinatesAndUrl])

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
        {/* Top Section: Mission Header, Short-cuts & Error Notifications */}
        <div className="flex flex-col gap-3 max-w-7xl mx-auto w-full">
          {urlError && <UrlErrorBanner message={urlError} onDismiss={clearUrlError} />}

          <HudHeader
            coordinates={{ ...commandedCoords, ra: liveCenter.ra, dec: liveCenter.dec }}
            activeObjectName={activeObject?.name}
            activeObjectType={activeObject?.tipoPrueba}
            activeSurvey={activeSurvey}
            onSurveyChange={setActiveSurvey}
            onFovChange={handleFovChange}
          />
          <TestObjectShortcuts
            activeObjectId={activeObject?.id}
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
              <span className="text-slate-200 font-semibold">STAGE 01: DYNAMIC URL ACTIVE</span>
            </div>
            <p className="text-slate-500 mt-0.5">
              URL synced with ?ra=&dec=&fov= • Shareable deep links (RF-03)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
