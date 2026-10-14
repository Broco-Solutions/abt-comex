"use client"

import { useEffect, useState } from "react"
import { loadImportationScenarios } from "@/features/importation/data/importation-scenarios"
import { projectWorkItems, visibleWorkItems } from "../data/work-items"

export function useWorkItems() {
  const [items, setItems] = useState(visibleWorkItems)
  useEffect(() => {
    const refresh = () => setItems(projectWorkItems(loadImportationScenarios()))
    refresh()
    window.addEventListener("abt:importation-change", refresh)
    return () => window.removeEventListener("abt:importation-change", refresh)
  }, [])
  return items
}
