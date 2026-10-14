"use client"
import { useRouter } from "next/navigation"
import { createContext, Fragment, useContext, useEffect, useState } from "react"
import {
  demonstrationOperations,
  saveDemoOperations,
} from "@/features/operations/data/operations"
import {
  initialDemoQuotes,
  saveDemoQuotes,
} from "@/features/quotes/data/quotes"
import { saveImportationScenarios } from "@/features/importation/data/importation-scenarios"
import { saveExportationScenarios } from "@/features/exportation/data/exportation-scenarios"
import {
  getScenario,
  scenarios,
  type Scenario,
  type ScenarioId,
} from "../data/scenarios"

const selectionKey = "abt-comex:demo:scenario:v1"
const dirtyKey = "abt-comex:demo:dirty:v1"
type ScenarioContext = {
  active: boolean
  scenario: Scenario
  dirty: boolean
  choose: (id: ScenarioId) => void
  exit: () => void
  reset: () => void
}
const Context = createContext<ScenarioContext>({
  active: true,
  scenario: getScenario("direction"),
  dirty: false,
  choose: () => {},
  exit: () => {},
  reset: () => {},
})
export const useScenario = () => useContext(Context)

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [generation, setGeneration] = useState(0)
  const [scenario, setScenario] = useState<Scenario>(getScenario("direction"))
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [dirty, setDirty] = useState(false)
  useEffect(() => {
    const hydrate = () => {
      try {
        const selected = sessionStorage.getItem(selectionKey)
        setActive(scenarios.some((item) => item.id === selected))
        setScenario(getScenario(selected ?? "operations"))
        setDirty(sessionStorage.getItem(dirtyKey) === "true")
      } catch {
        /* Browser memory only if storage is unavailable. */
      }
      setReady(true)
    }
    const changed = () => {
      setDirty(true)
      try {
        sessionStorage.setItem(dirtyKey, "true")
      } catch {
        /* Browser state stays available without storage. */
      }
    }
    hydrate()
    window.addEventListener("abt:demo-change", changed)
    window.addEventListener("abt:importation-change", changed)
    return () => {
      window.removeEventListener("abt:demo-change", changed)
      window.removeEventListener("abt:importation-change", changed)
    }
  }, [])
  function confirmReset() {
    return (
      !dirty ||
      window.confirm(
        "Se perderán los cambios temporales del escenario. ¿Continuar?"
      )
    )
  }
  function resetData() {
    saveDemoOperations(demonstrationOperations)
    saveDemoQuotes(initialDemoQuotes)
    saveImportationScenarios([])
    saveExportationScenarios([])
    setDirty(false)
    setGeneration((current) => current + 1)
    try {
      sessionStorage.removeItem(dirtyKey)
    } catch {
      /* Browser state stays available without storage. */
    }
  }
  function choose(id: ScenarioId) {
    if (!confirmReset()) return
    resetData()
    setScenario(getScenario(id))
    setActive(true)
    try {
      sessionStorage.setItem(selectionKey, id)
    } catch {
      /* Browser state stays available without storage. */
    }
    router.replace(id === "client" ? "/portal" : "/inicio")
  }
  function exit() {
    if (!confirmReset()) return
    resetData()
    try {
      sessionStorage.removeItem(selectionKey)
    } catch {
      /* Browser state stays available without storage. */
    }
    setActive(false)
    router.replace("/acceso")
  }
  function reset() {
    if (!confirmReset()) return
    resetData()
    router.refresh()
  }
  if (!ready)
    return (
      <main className="grid min-h-svh place-items-center">
        <p role="status" className="text-sm text-muted-foreground">
          Preparando espacio de trabajo…
        </p>
      </main>
    )
  return (
    <Context.Provider value={{ active, scenario, dirty, choose, exit, reset }}>
      <Fragment key={scenario.id + generation}>{children}</Fragment>
    </Context.Provider>
  )
}
