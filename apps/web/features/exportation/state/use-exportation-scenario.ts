"use client"

import { useEffect, useState } from "react"

import {
  getExportationScenario,
  loadExportationScenarios,
  saveExportationScenarios,
} from "../data/exportation-scenarios"
import type {
  ExportDoubleControl,
  ExportationScenario,
} from "../types/exportation"

export function useExportationScenario(operationId: string) {
  const [scenarios, setScenarios] = useState<ExportationScenario[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Hydrate browser-only scenario state after SSR to preserve stable initial markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScenarios(loadExportationScenarios())
    setReady(true)
  }, [])

  function updateDoubleControl(doubleControl: ExportDoubleControl) {
    const next = [
      ...scenarios.filter((item) => item.operationId !== operationId),
      { operationId, doubleControl },
    ]
    saveExportationScenarios(next)
    setScenarios(next)
  }

  return {
    ready,
    scenario: getExportationScenario(operationId, scenarios),
    updateDoubleControl,
  }
}
