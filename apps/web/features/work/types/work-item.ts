export type WorkItemKind = "Control" | "Revisión" | "Tarea" | "Excepción"

export type WorkItemFreshness = "Disponible" | "Desactualizado" | "Parcial"

export type WorkItem = {
  id: string
  kind: WorkItemKind
  title: string
  reason: string
  origin: string
  reference: string
  relatedOperationId?: string
  owner?: string
  dueDate?: string
  timeBand?: "Vencido" | "Próximo"
  blocking?: boolean
  assignedToDemoUser?: boolean
  source: string
  sourceUpdatedAt?: string
  freshness: WorkItemFreshness
  nextStep: string
  visible: boolean
  activity: string
}

export type WorkView =
  | "all"
  | "mine"
  | "upcoming"
  | "overdue"
  | "reviews"
  | "controls"
  | "exceptions"

export type WorkFilters = {
  query: string
  kind: WorkItemKind | ""
  view: WorkView
}

export type WorkSummary = {
  total: number
  blocking: number
  controls: number
  upcoming: number
  overdue: number
  reviews: number
  exceptions: number
}
