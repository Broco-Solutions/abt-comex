"use client"

import { useCallback, useEffect, useState } from "react"

import {
  demonstrationOperations,
  loadDemoOperations,
  saveDemoOperations,
} from "../data/operations"
import type { DemonstrationOperation } from "../types/operation"

import { useScenario } from "@/features/demo/state/scenario-provider"
import { scenarioKind } from "@/features/demo/data/scenarios"

export function useDemoOperations() {
  const [operations, setOperations] = useState(demonstrationOperations)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Hydrate browser-only scenario state after SSR to keep initial markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOperations(loadDemoOperations())
    setReady(true)
  }, [])

  const updateOperations = useCallback(
    (
      update: (current: DemonstrationOperation[]) => DemonstrationOperation[]
    ) => {
      const next = update(operations)
      saveDemoOperations(next)
      setOperations(next)
    },
    [operations]
  )

  const resetOperations = useCallback(() => {
    saveDemoOperations(demonstrationOperations)
    setOperations(demonstrationOperations)
  }, [])

  const { scenario } = useScenario()
  const kind = scenarioKind(scenario)
  const visibleOperations =
    scenario.id === "client"
      ? []
      : kind
        ? operations.filter((item) => item.kind === kind)
        : operations
  return {
    operations: visibleOperations,
    ready,
    updateOperations,
    resetOperations,
  }
}
