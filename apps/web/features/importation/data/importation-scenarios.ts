import {
  demonstrationReviewers,
  type DemonstrationDoubleControl,
  type ImportationScenario,
} from "../types/importation"

const storageKey = "abt-comex:demo:importation:v1"
const reviewerIds = demonstrationReviewers.map((reviewer) => reviewer.id)

let memoryScenarios: ImportationScenario[] = []

export function isValidReviewerPair(
  firstReviewer: string,
  secondReviewer: string
): boolean {
  return (
    reviewerIds.some((id) => id === firstReviewer) &&
    reviewerIds.some((id) => id === secondReviewer) &&
    firstReviewer !== secondReviewer
  )
}

export function canCompleteDoubleControl(control: DemonstrationDoubleControl) {
  return isValidReviewerPair(control.firstReviewer, control.secondReviewer)
}

function isScenario(value: unknown): value is ImportationScenario {
  if (!value || typeof value !== "object") return false
  const item = value as Record<string, unknown>
  const control = item.doubleControl as Record<string, unknown> | undefined
  if (!control) return false
  const firstReviewer = String(control.firstReviewer ?? "")
  const secondReviewer = String(control.secondReviewer ?? "")
  const completed = control.completed === true
  const validEmpty = !firstReviewer && !secondReviewer && !completed
  return (
    typeof item.operationId === "string" &&
    /^op-demo-\d+$/.test(item.operationId) &&
    (validEmpty ||
      (isValidReviewerPair(firstReviewer, secondReviewer) && completed))
  )
}

export function parseImportationScenarios(value: string) {
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed) || !parsed.every(isScenario)) return []
    const scenarios = parsed as ImportationScenario[]
    return new Set(scenarios.map((item) => item.operationId)).size ===
      scenarios.length
      ? scenarios
      : []
  } catch {
    return []
  }
}

export function loadImportationScenarios() {
  if (typeof window === "undefined") return memoryScenarios
  try {
    const stored = window.sessionStorage.getItem(storageKey)
    memoryScenarios = stored
      ? parseImportationScenarios(stored)
      : memoryScenarios
    return memoryScenarios
  } catch {
    return memoryScenarios
  }
}

export function saveImportationScenarios(scenarios: ImportationScenario[]) {
  memoryScenarios = scenarios
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(scenarios))
  } catch {
    // Keep this tab's local demonstration scenario in module memory.
  }
  window.dispatchEvent(new Event("abt:importation-change"))
}

export function getImportationScenario(
  operationId: string,
  scenarios: ImportationScenario[]
): ImportationScenario {
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
