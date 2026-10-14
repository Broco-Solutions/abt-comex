import {
  demonstrationExportReviewers,
  type DemonstrationDjve,
  type ExportDoubleControl,
  type ExportationScenario,
  type ExportPermit,
} from "../types/exportation"
import { getDemonstrationOperationProgress } from "@/features/operations/data/operation-progress"

const storageKey = "abt-comex:demo:exportation:v1"
const reviewerIds = demonstrationExportReviewers.map((reviewer) => reviewer.id)

let memoryScenarios: ExportationScenario[] = []

export const demonstrationPermits: ExportPermit[] = [
  {
    id: "permit-demo-1401",
    reference: "PE-DEM-1401",
    operationId: "op-demo-3107",
    djveId: "djve-demo-2026-01",
    declaredQuantity: "1.000",
    affectedQuantity: "420",
    quantityUnit: "t (fixture)",
    expirationDate: "2026-11-30",
  },
  {
    id: "permit-demo-1402",
    reference: "PE-DEM-1402",
    operationId: "op-demo-3112",
    djveId: "djve-demo-2026-01",
    declaredQuantity: "800",
    affectedQuantity: "0",
    quantityUnit: "t (fixture)",
    expirationDate: "2026-12-15",
  },
  {
    id: "permit-demo-1403",
    reference: "PE-DEM-1403",
    operationId: "op-demo-3120",
    declaredQuantity: "No informado",
    affectedQuantity: "No informado",
    quantityUnit: "—",
    expirationDate: "No informada",
  },
  {
    id: "permit-demo-1404",
    reference: "PE-DEM-1404",
    operationId: "op-demo-3133",
    declaredQuantity: "2.400",
    affectedQuantity: "1.100",
    quantityUnit: "t (fixture)",
    expirationDate: "2026-10-31",
  },
]

export const demonstrationDjves: DemonstrationDjve[] = [
  {
    id: "djve-demo-2026-01",
    reference: "DJVE-DEM-2026-01",
    description: "Trámite autónomo de demostración · mercadería ficticia",
    expirationDate: "2026-12-31",
    declaredQuantity: "1.800",
    affectedQuantity: "420",
    quantityUnit: "t (fixture)",
    permitIds: ["permit-demo-1401", "permit-demo-1402"],
    autonomous: true,
  },
  {
    id: "djve-demo-2026-02",
    reference: "DJVE-DEM-2026-02",
    description: "Escenario de relación posterior a operación",
    expirationDate: "2026-10-31",
    declaredQuantity: "2.400",
    affectedQuantity: "1.100",
    quantityUnit: "t (fixture)",
    permitIds: ["permit-demo-1404"],
    autonomous: false,
  },
]

export function isValidExportReviewerPair(
  firstReviewer: string,
  secondReviewer: string
) {
  return (
    reviewerIds.some((id) => id === firstReviewer) &&
    reviewerIds.some((id) => id === secondReviewer) &&
    firstReviewer !== secondReviewer
  )
}

export function canCompleteExportDoubleControl(control: ExportDoubleControl) {
  return isValidExportReviewerPair(
    control.firstReviewer,
    control.secondReviewer
  )
}

function isExportationScenario(value: unknown): value is ExportationScenario {
  if (!value || typeof value !== "object") return false
  const item = value as Record<string, unknown>
  const control = item.doubleControl as Record<string, unknown> | undefined
  if (!control) return false
  const first = String(control.firstReviewer ?? "")
  const second = String(control.secondReviewer ?? "")
  const completed = control.completed === true
  const blank = !first && !second && !completed
  return (
    typeof item.operationId === "string" &&
    /^op-demo-\d+$/.test(item.operationId) &&
    (blank || (isValidExportReviewerPair(first, second) && completed))
  )
}

export function parseExportationScenarios(value: string) {
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed) || !parsed.every(isExportationScenario))
      return []
    const scenarios = parsed as ExportationScenario[]
    return new Set(scenarios.map((item) => item.operationId)).size ===
      scenarios.length
      ? scenarios
      : []
  } catch {
    return []
  }
}

export function loadExportationScenarios() {
  if (typeof window === "undefined") return memoryScenarios
  try {
    const stored = window.sessionStorage.getItem(storageKey)
    memoryScenarios = stored
      ? parseExportationScenarios(stored)
      : memoryScenarios
    return memoryScenarios
  } catch {
    return memoryScenarios
  }
}

export function saveExportationScenarios(scenarios: ExportationScenario[]) {
  memoryScenarios = scenarios
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(scenarios))
  } catch {
    // Keep this tab's local demonstration scenario in module memory.
  }
}

export function getExportationScenario(
  operationId: string,
  scenarios: ExportationScenario[]
): ExportationScenario {
  return (
    scenarios.find((item) => item.operationId === operationId) ?? {
      operationId,
      doubleControl: {
        firstReviewer: "",
        secondReviewer: "",
        completed: false,
      },
    }
  )
}

export const getExportationProgress = getDemonstrationOperationProgress
