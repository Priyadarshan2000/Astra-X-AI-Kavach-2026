import { createContext, useContext, useMemo, useState } from 'react'
import { DIGITAL_TWINS } from '../data/twins.js'
import {
  SAMPLE_CODE,
  analyzeSource,
  buildReport,
  generatePatch,
  simulateFuzz,
  simulateRegression,
} from '../data/mock.js'

const MissionContext = createContext(null)

const initial = {
  twin: DIGITAL_TWINS[0],
  fileName: DIGITAL_TWINS[0].fileName,
  language: DIGITAL_TWINS[0].language,
  source: SAMPLE_CODE.c,
  scan: null,
  patch: null,
  fuzz: null,
  tests: null,
  report: null,
}

export function MissionProvider({ children }) {
  const [mission, setMission] = useState(initial)

  const selectTwin = (twin) => {
    setMission((m) => ({
      ...m,
      twin,
      fileName: twin.fileName,
      language: twin.language,
      source: SAMPLE_CODE[twin.language] || SAMPLE_CODE.c,
      scan: null,
      patch: null,
      fuzz: null,
      tests: null,
      report: null,
    }))
  }

  const ingestSource = ({ source, language, fileName }) => {
    setMission((m) => ({ ...m, source, language, fileName, scan: null, patch: null, fuzz: null, tests: null, report: null }))
  }

  const runScan = () => {
    const scan = analyzeSource(mission.source, mission.language)
    setMission((m) => ({ ...m, scan }))
    return scan
  }

  const runPatch = () => {
    const patch = generatePatch(mission.source, mission.language)
    setMission((m) => ({ ...m, patch }))
    return patch
  }

  const runFuzz = () => {
    const fuzz = simulateFuzz(mission.scan?.findings || [])
    setMission((m) => ({ ...m, fuzz }))
    return fuzz
  }

  const runRegression = () => {
    const tests = simulateRegression()
    const report = buildReport({
      scan: mission.scan,
      patch: mission.patch,
      fuzz: mission.fuzz,
      tests,
      project: mission.twin?.name,
    })
    setMission((m) => ({ ...m, tests, report }))
    return { tests, report }
  }

  const value = useMemo(
    () => ({ mission, selectTwin, ingestSource, runScan, runPatch, runFuzz, runRegression, setMission }),
    [mission],
  )

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>
}

export function useMission() {
  const ctx = useContext(MissionContext)
  if (!ctx) throw new Error('useMission must be used within MissionProvider')
  return ctx
}
