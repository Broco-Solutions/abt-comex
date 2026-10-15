"use client"

import { useEffect, useState } from "react"
import { loadDemoQuotes } from "@/features/quotes/data/quotes"
import { loadImportationScenarios } from "@/features/importation/data/importation-scenarios"
import { projectWorkItems, visibleWorkItems } from "../data/work-items"

import { useScenario } from "@/features/demo/state/scenario-provider"
import { scenarioKind } from "@/features/demo/data/scenarios"
import { demonstrationOperations } from "@/features/operations/data/operations"
import { loadPeople, selectedMemberId } from "@/features/people/data/people"
import { hasCapability } from "@/features/demo/data/capabilities"

export function useWorkItems() {
  const [items, setItems] = useState(visibleWorkItems)
  useEffect(() => {
    const refresh = () => {
      const people = loadPeople()
      const selected = selectedMemberId()
      setItems(
        projectWorkItems(loadImportationScenarios(), loadDemoQuotes()).map(
          (item) => {
            const ownerId = people.assignments[item.id]
            return ownerId === undefined
              ? item
              : {
                  ...item,
                  owner:
                    people.members.find((member) => member.id === ownerId)
                      ?.name ?? "Bandeja del equipo",
                  assignedToDemoUser: selected
                    ? ownerId === selected
                    : item.assignedToDemoUser,
                }
          }
        )
      )
    }
    refresh()
    window.addEventListener("abt:importation-change", refresh)
    window.addEventListener("abt:demo-change", refresh)
    return () => {
      window.removeEventListener("abt:importation-change", refresh)
      window.removeEventListener("abt:demo-change", refresh)
    }
  }, [])
  const { scenario } = useScenario()
  const kind = scenarioKind(scenario)
  return items.filter(
    (item) =>
      (!item.relatedOperationId ||
        hasCapability(scenario, "operations.read")) &&
      (!item.relatedQuoteId || scenario.commercial) &&
      (item.id !== "wrk-admin-no-operation-05" || scenario.financial) &&
      (!kind ||
        !item.relatedOperationId ||
        demonstrationOperations.some(
          (operation) =>
            operation.id === item.relatedOperationId && operation.kind === kind
        ))
  )
}
