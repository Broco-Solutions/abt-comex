export const demonstrationReviewers = [
  { id: "demo-person-01", label: "Persona de demostración 01" },
  { id: "demo-person-02", label: "Persona de demostración 02" },
  { id: "demo-person-03", label: "Persona de demostración 03" },
] as const

export type DemonstrationReviewerId =
  (typeof demonstrationReviewers)[number]["id"]

export type DemonstrationDoubleControl = {
  firstReviewer: DemonstrationReviewerId | ""
  secondReviewer: DemonstrationReviewerId | ""
  completed: boolean
}

export type ImportationScenario = {
  operationId: string
  doubleControl: DemonstrationDoubleControl
}
