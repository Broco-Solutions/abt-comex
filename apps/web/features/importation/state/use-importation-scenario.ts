"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getImportationScenario,
  loadImportationScenarios,
  saveImportationScenarios,
} from "../data/importation-scenarios"
import type {
  DemonstrationDoubleControl,
  ImportationScenario,
} from "../types/importation"

export function useImportationScenario(operationId: string) {
  const [scenarios, setScenarios] = useState<ImportationScenario[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Hydrate only browser-local state after SSR to preserve stable initial markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScenarios(loadImportationScenarios())
    setReady(true)
  }, [])

  const updateDoubleControl = useCallback(
    (doubleControl: DemonstrationDoubleControl) => {
      const current = getImportationScenario(operationId, scenarios)
      const nextScenario = { ...current, doubleControl }
      const next = scenarios.some((item) => item.operationId === operationId)
        ? scenarios.map((item) =>
            item.operationId === operationId ? nextScenario : item
          )
        : [...scenarios, nextScenario]
      saveImportationScenarios(next)
      setScenarios(next)
    },
    [operationId, scenarios]
  )

  return {
    ready,
    scenario: getImportationScenario(operationId, scenarios),
    updateDoubleControl,
  }
}
