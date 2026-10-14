"use client"

import { useCallback, useEffect, useState } from "react"

import {
  demonstrationOperations,
  loadDemoOperations,
  saveDemoOperations,
} from "../data/operations"
import type { DemonstrationOperation } from "../types/operation"

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

  return { operations, ready, updateOperations, resetOperations }
}
