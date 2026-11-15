// Assisted by Antigravity (SI) — reviewed by Luissmont
import { useState, useCallback, useEffect } from 'react'
import { AladinViewer } from './components/blink/AladinViewer'
import { HudHeader } from './components/layout/HudHeader'
import { QuadrantQueueNav } from './components/layout/QuadrantQueueNav'
import { TestObjectShortcuts } from './components/search/TestObjectShortcuts'
import { CoordinatesHud } from './components/layout/CoordinatesHud'
import { UrlErrorBanner } from './components/ui/UrlErrorBanner'
import { useUrlState } from './hooks/useUrlState'
import { useQuadrants } from './hooks/useQuadrants'
import { DEFAULT_ALADIN_SURVEY } from './lib/constants'
import { findMatchingTestObject } from './data/test-objects'
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

  // 2. Fixed Queue of 10 Quadrants from FastAPI Backend (RF-05)
  const {
    quadrants,
    currentIndex,
    activeQuadrant,
    isLoading: isQueueLoading,
    selectQuadrantIndex,
    selectQuadrantByCoordinates,
  } = useQuadrants({ ra: commandedCoords.ra, dec: commandedCoords.dec })

  // 3. Real-time Live Telemetry from Aladin Viewport (updated smoothly as user pans and zooms)
  const [liveCenter, setLiveCenter] = useState<{ ra: number; dec: number }>({
    ra: commandedCoords.ra,
    dec: commandedCoords.dec,
  })
  const [liveFov, setLiveFov] = useState<number>(commandedCoords.fov)

  // 4. Real-time Cursor Coordinates (under mouse pointer)
  const [hoverCoords, setHoverCoords] = useState<{ ra: number; dec: number } | null>(null)

  // 5. User Selected Celestial Target (from clicking on sky/star - RF-10)
  const [clickedCoords, setClickedCoords] = useState<{ ra: number; dec: number } | null>(null)

  // Synchronize active quadrant change with Aladin and URL
  const handleSelectQuadrantByIndex = useCallback(
    (index: number) => {
      selectQuadrantIndex(index)
      const target = quadrants[index]
      if (target) {
        setClickedCoords(null)
        const matched = findMatchingTestObject(target.ra, target.dec)
        setCoordinatesAndUrl(
          {
            ra: target.ra,
            dec: target.dec,
            fov: (target.fov === 1 ? 1 : 2) as 1 | 2,
          },
          matched,
          true
        )
        setLiveCenter({ ra: target.ra, dec: target.dec })
        setLiveFov((target.fov === 1 ? 1 : 2) as 1 | 2)
      }
    },
    [quadrants, selectQuadrantIndex, setCoordinatesAndUrl]
  )

  const handleNextQuadrant = useCallback(() => {
    const nextIdx = (currentIndex + 1) % quadrants.length
    handleSelectQuadrantByIndex(nextIdx)
  }, [currentIndex, quadrants.length, handleSelectQuadrantByIndex])

  const handlePrevQuadrant = useCallback(() => {
    const prevIdx = (currentIndex - 1 + quadrants.length) % quadrants.length
    handleSelectQuadrantByIndex(prevIdx)
  }, [currentIndex, quadrants.length, handleSelectQuadrantByIndex])

  // User clicks an official test object shortcut button (RF-04)
  const handleSelectTestObject = useCallback(
    (obj: TestObject) => {
      setClickedCoords(null)
      selectQuadrantByCoordinates(obj.ra, obj.dec)
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
    [selectQuadrantByCoordinates, setCoordinatesAndUrl]
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

  // Sync initial URL coordinates with queue
  useEffect(() => {
    selectQuadrantByCoordinates(commandedCoords.ra, commandedCoords.dec)
  }, [commandedCoords.ra, commandedCoords.dec, selectQuadrantByCoordinates])

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
        {/* Top Section: Mission Header, Quadrant Queue Nav & Test Object Shortcuts */}
        <div className="flex flex-col gap-2.5 max-w-7xl mx-auto w-full">
          {urlError && <UrlErrorBanner message={urlError} onDismiss={clearUrlError} />}

          <HudHeader
            coordinates={{ ...commandedCoords, ra: liveCenter.ra, dec: liveCenter.dec }}
            activeObjectName={activeQuadrant?.nombre ?? activeObject?.name}
            activeObjectType={activeQuadrant?.tipo_prueba ?? activeObject?.tipoPrueba}
            activeSurvey={activeSurvey}
            onSurveyChange={setActiveSurvey}
            onFovChange={handleFovChange}
          />

          {/* Fixed Quadrant Queue Navigator (RF-05) */}
          <QuadrantQueueNav
            quadrants={quadrants}
            currentIndex={currentIndex}
            activeQuadrant={activeQuadrant}
            isLoading={isQueueLoading}
            onNext={handleNextQuadrant}
            onPrev={handlePrevQuadrant}
            onSelectIndex={handleSelectQuadrantByIndex}
          />

          <TestObjectShortcuts
            activeObjectId={activeObject?.id}
            onSelectObject={handleSelectTestObject}
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
              <span className="text-slate-200 font-semibold">STAGE 02: QUEUE SYNC ACTIVE</span>
            </div>
            <p className="text-slate-500 mt-0.5">
              Queue: {currentIndex + 1} of {quadrants.length} • Connected to FastAPI Backend
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
