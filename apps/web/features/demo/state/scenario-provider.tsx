"use client"
import { useRouter } from "next/navigation"
import {
  initialAdministrativeLedger,
  saveAdministrativeLedger,
} from "@/features/administration/data/administrative-ledger"
import { hasCapability } from "../data/capabilities"
import {
  initialPeople,
  loadPeople,
  savePeople,
  memberForPerspective,
  selectedMemberKey,
  type Member,
} from "@/features/people/data/people"
import { saveReceivedDocuments } from "@/features/documents/data/documents"
import {
  initialOrganizations,
  saveOrganizations,
} from "@/features/organizations/data/organizations"
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
  login: (memberId: string) => boolean
  exit: () => void
  reset: () => void
}
const Context = createContext<ScenarioContext>({
  active: true,
  scenario: getScenario("direction"),
  dirty: false,
  choose: () => {},
  login: () => false,
  exit: () => {},
  reset: () => {},
})
export const useScenario = () => useContext(Context)

function memberScenario(member: Member): Scenario {
  const base = getScenario(member.perspective)
  const scoped = { ...base, capabilities: member.capabilities }
  return {
    ...scoped,
    memberId: member.id,
    commercial: hasCapability(scoped, "commercial.read"),
    financial: [
      "finance.billing",
      "finance.collections",
      "finance.treasury",
      "finance.expenses",
      "finance.prepare",
    ].some((cap) =>
      member.capabilities.includes(cap as (typeof member.capabilities)[number])
    ),
    executive: hasCapability(scoped, "management.read"),
  }
}

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
        const selectedId = sessionStorage.getItem(selectedMemberKey)
        const member = selectedId
          ? loadPeople().members.find((item) => item.id === selectedId)
          : memberForPerspective((selected ?? "operations") as ScenarioId)
        setActive(
          scenarios.some((item) => item.id === selected) &&
            member?.access === "Activo"
        )
        setScenario(
          member
            ? memberScenario(member)
            : getScenario(selected ?? "operations")
        )
        setDirty(sessionStorage.getItem(dirtyKey) === "true")
      } catch {
        /* Browser memory only if storage is unavailable. */
      }
      setReady(true)
    }
    const changed = () => {
      let memberId: string | null = null
      try {
        memberId = sessionStorage.getItem(selectedMemberKey)
      } catch {
        /* Memory-only browsing. */
      }
      if (memberId) {
        const member = loadPeople().members.find((item) => item.id === memberId)
        setActive(member?.access === "Activo")
        if (member) setScenario(memberScenario(member))
      }
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
    saveAdministrativeLedger(initialAdministrativeLedger)
    saveOrganizations(initialOrganizations)
    saveDemoOperations(demonstrationOperations)
    saveDemoQuotes(initialDemoQuotes)
    saveImportationScenarios([])
    saveExportationScenarios([])
    saveReceivedDocuments([])
    setDirty(false)
    setGeneration((current) => current + 1)
    try {
      sessionStorage.removeItem(dirtyKey)
    } catch {
      /* Browser state stays available without storage. */
    }
  }
  function login(memberId: string) {
    const member = loadPeople().members.find(
      (item) => item.id === memberId && item.access === "Activo"
    )
    if (!member || !confirmReset()) return false
    resetData()
    const nextScenario = memberScenario(member)
    setScenario(nextScenario)
    setActive(true)
    try {
      sessionStorage.setItem(selectionKey, member.perspective)
      sessionStorage.setItem(selectedMemberKey, member.id)
    } catch {
      /* Browser state stays available without storage. */
    }
    router.replace(
      nextScenario.id === "client"
        ? `/portal?cliente=${nextScenario.clientId}`
        : "/inicio"
    )
    return true
  }
  function choose(id: ScenarioId) {
    const member = memberForPerspective(id)
    if (member) login(member.id)
  }
  function exit() {
    if (!confirmReset()) return
    resetData()
    savePeople(initialPeople)
    try {
      sessionStorage.removeItem(selectionKey)
      sessionStorage.removeItem(selectedMemberKey)
    } catch {
      /* Browser state stays available without storage. */
    }
    setActive(false)
    router.replace("/acceso")
  }
  function reset() {
    if (!confirmReset()) return
    resetData()
    savePeople(initialPeople)
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
    <Context.Provider
      value={{ active, scenario, dirty, choose, login, exit, reset }}
    >
      <Fragment key={scenario.id + generation}>{children}</Fragment>
    </Context.Provider>
  )
}
