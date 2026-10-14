export const demonstrationExportReviewers = [
  { id: "demo-export-person-01", label: "Persona de demostración 01" },
  { id: "demo-export-person-02", label: "Persona de demostración 02" },
  { id: "demo-export-person-03", label: "Persona de demostración 03" },
] as const

export type ExportReviewerId =
  (typeof demonstrationExportReviewers)[number]["id"]

export type ExportDoubleControl = {
  firstReviewer: ExportReviewerId | ""
  secondReviewer: ExportReviewerId | ""
  completed: boolean
}

export type ExportationScenario = {
  operationId: string
  doubleControl: ExportDoubleControl
}

export type ExportPermit = {
  id: string
  reference: string
  operationId: string
  djveId?: string
  declaredQuantity: string
  affectedQuantity: string
  quantityUnit: string
  expirationDate: string
}

export type DemonstrationDjve = {
  id: string
  reference: string
  description: string
  expirationDate: string
  declaredQuantity: string
  affectedQuantity: string
  quantityUnit: string
  permitIds: string[]
  autonomous: boolean
}
