"use client"

import { useCallback, useEffect, useState } from "react"

import {
  demonstrationOperations,
  loadDemoOperations,
  saveDemoOperations,
} from "../data/operations"
import type { DemonstrationOperation } from "../types/operation"

import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { scenarioKind } from "@/features/demo/data/scenarios"
import { hasCapability } from "@/features/demo/data/capabilities"
import { usePeople } from "@/features/people/state/use-people"

export function useDemoOperations() {
  const [operations, setOperations] = useState(demonstrationOperations)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const refresh = () => {
      setOperations(loadDemoOperations())
      setReady(true)
    }
    refresh()
    window.addEventListener("abt:demo-change", refresh)
    return () => window.removeEventListener("abt:demo-change", refresh)
  }, [])

  const updateOperations = useCallback(
    (
      update: (current: DemonstrationOperation[]) => DemonstrationOperation[]
    ) => {
      const next = update(loadDemoOperations())
      saveDemoOperations(next)
      setOperations(next)
    },
    []
  )

  const resetOperations = useCallback(() => {
    saveDemoOperations(demonstrationOperations)
    setOperations(demonstrationOperations)
  }, [])

  const { organizations } = useOrganizations()
  const { state: people } = usePeople()
  const projectedOperations = operations.map((operation) => ({
    ...operation,
    responsibleReference: operation.responsible,
    responsible: operation.responsibleId
      ? (people.members.find((person) => person.id === operation.responsibleId)
          ?.name ?? "Responsable pendiente de identificación")
      : `Sin asignación individual · ${operation.kind}`,
    client:
      organizations.find((item) => item.id === operation.clientId)?.name ??
      operation.client,
  }))
  const { scenario } = useScenario()
  const kind = scenarioKind(scenario)
  const visibleOperations =
    scenario.id === "client"
      ? projectedOperations.filter(
          (item) => item.clientId === scenario.clientId
        )
      : !hasCapability(scenario, "operations.read")
        ? []
        : kind
          ? projectedOperations.filter((item) => item.kind === kind)
          : projectedOperations
  return {
    operations: visibleOperations,
    ready,
    updateOperations,
    resetOperations,
  }
}
