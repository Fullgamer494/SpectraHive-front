// Assisted by Antigravity (SI) — reviewed by Luissmont
// Assisted by Codex (SI) — reviewed by pendiente
import { useState, useCallback, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { AladinViewer } from './components/blink/AladinViewer'
import { BlinkViewer } from './components/blink/BlinkViewer'
import { HudHeader } from './components/layout/HudHeader'
import { QuadrantQueueNav } from './components/layout/QuadrantQueueNav'
import { TestObjectShortcuts } from './components/search/TestObjectShortcuts'
import { WorkspaceNav } from './components/layout/WorkspaceNav'
import { CoordinatesHud } from './components/layout/CoordinatesHud'
import { ReportModal } from './components/report/ReportModal'
import { CosmicDnaViewer } from './components/adn/CosmicDnaViewer'
import { UrlErrorBanner } from './components/ui/UrlErrorBanner'
import { useUrlState } from './hooks/useUrlState'
import { useQuadrants } from './hooks/useQuadrants'
import { useReport } from './hooks/useReport'
import { DEFAULT_ALADIN_SURVEY } from './lib/constants'
import { findMatchingTestObject } from './data/test-objects'
import type { TestObject } from './types/quadrant'
import type { DiffCandidate, AnomalyType } from './types/api'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [activeSurvey, setActiveSurvey] = useState<string>(DEFAULT_ALADIN_SURVEY)
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false)
  const [reportPresetType, setReportPresetType] = useState<AnomalyType | null>(null)
  const [isDnaModalOpen, setIsDnaModalOpen] = useState<boolean>(false)

  // Reporting and Simulated Consensus hook (RF-10, RF-11, RF-12, RF-13)
  const reportState = useReport()

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
    updateQuadrantStatus,
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
    if (!quadrants.length) return
    const nextIdx = (currentIndex + 1) % quadrants.length
    handleSelectQuadrantByIndex(nextIdx)
  }, [currentIndex, quadrants.length, handleSelectQuadrantByIndex])

  const handlePrevQuadrant = useCallback(() => {
    if (!quadrants.length) return
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
  const handleClickCoordinates = useCallback(
    (ra: number, dec: number) => {
      setClickedCoords({ ra, dec })
      setLiveCenter({ ra, dec })
      setCoordinatesAndUrl(
        {
          ...commandedCoords,
          ra,
          dec,
        },
        undefined,
        false
      )
    },
    [commandedCoords, setCoordinatesAndUrl]
  )

  // Event handler for clicking a candidate from the Difference |B - A| panel
  const handleSelectCandidate = useCallback(
    (candidate: DiffCandidate) => {
      setClickedCoords({ ra: candidate.ra, dec: candidate.dec })
      setLiveCenter({ ra: candidate.ra, dec: candidate.dec })
      setCoordinatesAndUrl(
        {
          ...commandedCoords,
          ra: candidate.ra,
          dec: candidate.dec,
        },
        undefined,
        false
      )
    },
    [commandedCoords, setCoordinatesAndUrl]
  )

  // Event handler for clicking directly on any star inside the SPHEREx Blink cutout
  const handleSelectTargetCoords = useCallback((coords: { ra: number; dec: number }) => {
    setClickedCoords(coords)
  }, [])

  // Report modal handlers (RF-10, RF-11, RF-12, RF-13)
  const handleOpenReport = useCallback(() => {
    setReportPresetType(null)
    setIsReportModalOpen(true)
  }, [])

  const handleMarkClean = useCallback(() => {
    setReportPresetType('limpio')
    setIsReportModalOpen(true)
  }, [])

  const handleReportSuccess = useCallback(
    (quadrantId: string, tipo: AnomalyType) => {
      const newStatus = tipo === 'limpio' ? 'descartado' : 'confirmado'
      updateQuadrantStatus(quadrantId, newStatus)
    },
    [updateQuadrantStatus]
  )

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

  const focusSection = (section: 'targets' | 'coordinates' | 'inspector') => {
    const element = document.getElementById(`panel-${section}`)
    element?.focus({ preventScroll: true })
    element?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  return (
    <div data-design="engineering" data-theme={theme} className="workspace">
      <HudHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        coordinates={commandedCoords}
        activeObjectName={activeQuadrant?.nombre ?? activeObject?.name}
        activeObjectType={activeQuadrant?.tipo_prueba ?? activeObject?.tipoPrueba}
        activeSurvey={activeSurvey}
        onSurveyChange={setActiveSurvey}
        onFovChange={handleFovChange}
      />
      {urlError && <UrlErrorBanner message={urlError} onDismiss={clearUrlError} />}
      <div className="workspace-body">
        <WorkspaceNav onFocusSection={focusSection} onOpenDna={() => setIsDnaModalOpen(true)} />
        <aside className="workspace-context" aria-label="Targets and sky details">
          <section id="panel-targets" className="context-section" tabIndex={-1} aria-labelledby="targets-title">
            <div className="workspace-panel-heading"><h2 id="targets-title">Test objects</h2><span className="module-index">01</span></div>
            <TestObjectShortcuts activeObjectId={activeObject?.id} onSelectObject={handleSelectTestObject} />
          </section>
          <section id="panel-coordinates" className="context-section" tabIndex={-1} aria-labelledby="coordinates-title">
            <CoordinatesHud
              centerCoords={{ ...commandedCoords, ra: liveCenter.ra, dec: liveCenter.dec }}
              currentFov={liveFov}
              hoverCoords={hoverCoords}
              clickedCoords={clickedCoords}
              activeObject={activeObject}
              onClearClicked={() => setClickedCoords(null)}
              onCenterOnSelected={handleCenterOnSelected}
            />
          </section>
        </aside>
        <main className="workspace-sky" aria-label="Sky observation workspace">
          <div className="workspace-map">
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
          <div className="workspace-map-label"><span>SKY CONTEXT</span><span>Drag to explore · Click to select</span></div>
          <div className="workspace-readout">
            <span>RA {liveCenter.ra.toFixed(4)}° / DEC {liveCenter.dec.toFixed(4)}°</span>
            <button type="button" onClick={() => focusSection('coordinates')}>
              {clickedCoords ? 'Selected target details' : 'Sky details'}
            </button>
          </div>
        </main>
          <aside id="panel-inspector" tabIndex={-1} className="workspace-inspector" aria-label="SPHEREx image analysis">
            <BlinkViewer
              ra={commandedCoords.ra}
              dec={commandedCoords.dec}
              fov={commandedCoords.fov}
              cuadranteId={activeQuadrant?.id}
              epocaA={activeQuadrant?.epoca_a}
              epocaB={activeQuadrant?.epoca_b}
              objectName={activeQuadrant?.nombre ?? activeObject?.name}
              tipoPrueba={activeQuadrant?.tipo_prueba ?? activeObject?.tipoPrueba}
              onSelectCandidate={handleSelectCandidate}
              onSelectTargetCoords={handleSelectTargetCoords}
              onOpenReport={handleOpenReport}
              onMarkClean={handleMarkClean}
              onOpenDna={() => setIsDnaModalOpen(true)}
            />
          </aside>
      </div>
      <QuadrantQueueNav
        quadrants={quadrants}
        currentIndex={currentIndex}
        activeQuadrant={activeQuadrant}
        isLoading={isQueueLoading}
        onNext={handleNextQuadrant}
        onPrev={handlePrevQuadrant}
        onSelectIndex={handleSelectQuadrantByIndex}
      />

      {/* Anomaly Reporting & Consensus Modal Dialog (RF-10, RF-11, RF-12, RF-13) */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onNextQuadrant={handleNextQuadrant}
        quadrant={activeQuadrant}
        currentRa={clickedCoords?.ra ?? commandedCoords.ra}
        currentDec={clickedCoords?.dec ?? commandedCoords.dec}
        initialType={reportPresetType}
        reportState={reportState}
        onReportSuccess={handleReportSuccess}
        onOpenDna={() => setIsDnaModalOpen(true)}
      />

      {/* Cosmic DNA Visual Spectral Barcode Viewer (RF-14, RF-15) */}
      <CosmicDnaViewer
        isOpen={isDnaModalOpen}
        onClose={() => setIsDnaModalOpen(false)}
        objectName={activeQuadrant?.nombre ?? activeObject?.name}
      />
    </div>
  )
}
