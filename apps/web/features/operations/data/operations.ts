import type { DemonstrationOperation } from "../types/operation"
import { validHandoff } from "./operational-continuity"

const operationStorageKey = "abt-comex:demo:operations:v1"

// Fictional, stable examples. They do not represent ABT records or live sources.
export const demonstrationOperations: DemonstrationOperation[] = [
  {
    id: "op-demo-2048",
    reference: "OP-DEM-2048",
    openedOn: "2026-10-02",
    kind: "Importación",
    clientId: "client-demo-norte",
    client: "Cliente Demo Norte",
    responsible: "Equipo Impo A",
    modality: "Marítima",
    situation: "En seguimiento",
    updatedOn: "2026-10-13",
    alert: "Sin alerta",
    nextAction: "Verificar novedad de arribo",
  },
  {
    id: "op-demo-2054",
    reference: "OP-DEM-2054",
    openedOn: "2026-09-18",
    kind: "Importación",
    clientId: "client-demo-centro",
    client: "Cliente Demo Centro",
    responsible: "Equipo Impo B",
    modality: "Aérea",
    situation: "Pendiente documental",
    updatedOn: "2026-10-12",
    alert: "Vencimiento",
    nextAction: "Revisar documentación pendiente",
  },
  {
    id: "op-demo-2061",
    reference: "OP-DEM-2061",
    openedOn: "2026-09-25",
    kind: "Importación",
    clientId: "client-demo-sur",
    client: "Cliente Demo Sur",
    responsible: "Equipo Impo A",
    modality: "Terrestre",
    situation: "Requiere atención",
    updatedOn: "2026-10-10",
    alert: "Bloqueo",
    nextAction: "Resolver observación antes del siguiente paso",
  },
  {
    id: "op-demo-3107",
    reference: "OP-DEM-3107",
    openedOn: "2026-10-01",
    kind: "Exportación",
    clientId: "client-demo-norte",
    client: "Cliente Demo Norte",
    responsible: "Equipo Expo A",
    modality: "Marítima",
    situation: "Lista para revisión",
    updatedOn: "2026-10-14",
    alert: "Sin alerta",
    nextAction: "Continuar revisión documental",
  },
  {
    id: "op-demo-3112",
    reference: "OP-DEM-3112",
    openedOn: "2026-10-05",
    kind: "Exportación",
    clientId: "client-demo-centro",
    client: "Cliente Demo Centro",
    responsible: "Equipo Expo B",
    modality: "Marítima",
    situation: "En seguimiento",
    updatedOn: "2026-10-11",
    alert: "Vencimiento",
    nextAction: "Confirmar próximo hito",
  },
  {
    id: "op-demo-3120",
    reference: "OP-DEM-3120",
    openedOn: "2026-09-10",
    kind: "Exportación",
    clientId: "client-demo-este",
    client: "Cliente Demo Este",
    responsible: "Equipo Expo A",
    modality: "Aérea",
    situation: "Pendiente documental",
    updatedOn: "2026-10-08",
    alert: "Sin alerta",
    nextAction: "Completar antecedentes del embarque",
  },
  {
    id: "op-demo-3133",
    reference: "OP-DEM-3133",
    openedOn: "2026-08-20",
    kind: "Exportación",
    clientId: "client-demo-sur",
    client: "Cliente Demo Sur",
    responsible: "Equipo Expo B",
    modality: "Terrestre",
    situation: "Requiere atención",
    updatedOn: "2026-10-06",
    alert: "Bloqueo",
    nextAction: "Revisar diferencia informada",
  },
  {
    id: "op-demo-2073",
    reference: "OP-DEM-2073",
    openedOn: "2026-10-03",
    kind: "Importación",
    clientId: "client-demo-este",
    client: "Cliente Demo Este",
    responsible: "Equipo Impo B",
    modality: "Marítima",
    situation: "Pre-embarque",
    updatedOn: "2026-10-03",
    alert: "Sin alerta",
    nextAction: "Controlar requisitos previos",
  },
  {
    id: "op-demo-3141",
    reference: "OP-DEM-3141",
    openedOn: "2026-09-01",
    kind: "Exportación",
    clientId: "client-demo-norte",
    client: "Cliente Demo Norte",
    responsible: "Equipo Expo A",
    modality: "Marítima",
    situation: "En seguimiento",
    updatedOn: "2026-09-30",
    alert: "Sin alerta",
    nextAction: "Consultar estado del proceso",
  },
]

let memoryDemoOperations: DemonstrationOperation[] | null = null

function isDemonstrationOperation(
  value: unknown
): value is DemonstrationOperation {
  if (!value || typeof value !== "object") return false
  const operation = value as Record<string, unknown>
  const origin = operation.origin
  const validOrigin =
    origin === undefined ||
    (typeof origin === "object" &&
      origin !== null &&
      ((origin as Record<string, unknown>).type === "direct" ||
        ((origin as Record<string, unknown>).type === "accepted-quote" &&
          typeof (origin as Record<string, unknown>).quoteId === "string" &&
          typeof (origin as Record<string, unknown>).quoteReference ===
            "string" &&
          Number.isInteger((origin as Record<string, unknown>).quoteVersion))))
  return (
    typeof operation.id === "string" &&
    /^op-demo-\d+$/.test(operation.id) &&
    typeof operation.reference === "string" &&
    /^OP-DEM-\d+$/.test(operation.reference) &&
    (operation.kind === "Importación" || operation.kind === "Exportación") &&
    typeof operation.clientId === "string" &&
    operation.clientId.trim().length > 0 &&
    typeof operation.client === "string" &&
    typeof operation.responsible === "string" &&
    ["Marítima", "Aérea", "Terrestre"].includes(String(operation.modality)) &&
    [
      "Pre-embarque",
      "En seguimiento",
      "Requiere atención",
      "Pendiente documental",
      "Lista para revisión",
    ].includes(String(operation.situation)) &&
    typeof operation.updatedOn === "string" &&
    ["Bloqueo", "Vencimiento", "Sin alerta"].includes(
      String(operation.alert)
    ) &&
    typeof operation.nextAction === "string" &&
    validHandoff(operation.handoff) &&
    (operation.responsibleId === undefined ||
      typeof operation.responsibleId === "string") &&
    (operation.openedOn === undefined ||
      (typeof operation.openedOn === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(operation.openedOn))) &&
    (operation.participantIds === undefined ||
      (Array.isArray(operation.participantIds) &&
        operation.participantIds.every(
          (id: unknown) => typeof id === "string"
        ))) &&
    validOrigin &&
    (operation.initialContext === undefined ||
      typeof operation.initialContext === "string")
  )
}

export function parseDemoOperations(raw: string | null) {
  if (!raw) return demonstrationOperations
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every(isDemonstrationOperation))
      return parsed
  } catch {
    return demonstrationOperations
  }
  return demonstrationOperations
}

export function loadDemoOperations() {
  if (typeof window === "undefined")
    return memoryDemoOperations ?? demonstrationOperations
  try {
    const stored = window.sessionStorage.getItem(operationStorageKey)
    memoryDemoOperations = stored
      ? parseDemoOperations(stored)
      : (memoryDemoOperations ?? demonstrationOperations)
    return memoryDemoOperations
  } catch {
    return memoryDemoOperations ?? demonstrationOperations
  }
}

export function saveDemoOperations(operations: DemonstrationOperation[]) {
  memoryDemoOperations = operations
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(
      operationStorageKey,
      JSON.stringify(operations)
    )
  } catch {
    // Keep this tab's module state available when session storage is blocked.
  }
  window.dispatchEvent(new Event("abt:demo-change"))
}

export function nextDemoOperationIdentity(
  operations: DemonstrationOperation[]
) {
  const maximum = operations.reduce((value, operation) => {
    const sequence = Number(operation.id.slice("op-demo-".length))
    return Number.isInteger(sequence) ? Math.max(value, sequence) : value
  }, 0)
  return {
    id: `op-demo-${maximum + 1}`,
    reference: `OP-DEM-${maximum + 1}`,
  }
}

export const operationSituations = [
  "Pre-embarque",
  "En seguimiento",
  "Requiere atención",
  "Pendiente documental",
  "Lista para revisión",
] as const

export type OperationListFilters = {
  q: string
  kind: "" | "importacion" | "exportacion"
  situation: string
  responsible: string
  from: string
  to: string
  sort:
    | ""
    | "reference"
    | "client"
    | "kind"
    | "situation"
    | "responsible"
    | "updatedOn"
  direction: "asc" | "desc"
  group: "" | "kind" | "situation" | "responsible"
  page: number
  error: "" | "lectura" | "sin-permiso"
}

export type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

export function parseOperationFilters(
  params: SearchParams
): OperationListFilters {
  const kind = first(params.tipo)
  const sort = first(params.orden)
  const direction = first(params.direccion)
  const group = first(params.agrupar)
  const page = Number(first(params.pagina))
  const error = first(params.error)
  return {
    q: first(params.q).trim(),
    kind: kind === "importacion" || kind === "exportacion" ? kind : "",
    situation:
      operationSituations.find((item) => item === first(params.situacion)) ??
      "",
    responsible:
      [
        "Equipo Impo A",
        "Equipo Impo B",
        "Equipo Expo A",
        "Equipo Expo B",
        "pending",
      ].includes(first(params.responsable)) ||
      /^(?:person-abt-\d{3}|member-local-\d+)$/.test(first(params.responsable))
        ? first(params.responsable)
        : "",
    from: /^\d{4}-\d{2}-\d{2}$/.test(first(params.desde))
      ? first(params.desde)
      : "",
    to: /^\d{4}-\d{2}-\d{2}$/.test(first(params.hasta))
      ? first(params.hasta)
      : "",
    sort:
      sort === "ninguno"
        ? ""
        : [
              "reference",
              "client",
              "kind",
              "situation",
              "responsible",
              "updatedOn",
            ].includes(sort)
          ? (sort as OperationListFilters["sort"])
          : "updatedOn",
    direction: direction === "asc" ? "asc" : "desc",
    group:
      group === "kind" || group === "situation" || group === "responsible"
        ? group
        : "",
    page: Number.isInteger(page) && page > 0 ? page : 1,
    error: error === "lectura" || error === "sin-permiso" ? error : "",
  }
}

export function filterOperations(
  items: DemonstrationOperation[],
  filters: OperationListFilters
) {
  const query = filters.q.toLocaleLowerCase("es-AR")
  return items
    .filter(
      (item) =>
        !filters.kind ||
        item.kind ===
          (filters.kind === "importacion" ? "Importación" : "Exportación")
    )
    .filter(
      (item) => !filters.situation || item.situation === filters.situation
    )
    .filter(
      (item) =>
        !filters.responsible ||
        (filters.responsible === "pending"
          ? !item.responsibleId
          : item.responsibleId === filters.responsible ||
            item.responsibleReference === filters.responsible ||
            item.responsible === filters.responsible)
    )
    .filter((item) => !filters.from || item.updatedOn >= filters.from)
    .filter((item) => !filters.to || item.updatedOn <= filters.to)
    .filter(
      (item) =>
        !query ||
        [item.reference, item.client, item.responsible, item.nextAction].some(
          (value) => value.toLocaleLowerCase("es-AR").includes(query)
        )
    )
    .sort((a, b) => {
      if (!filters.sort) return 0
      const result = a[filters.sort].localeCompare(b[filters.sort], "es-AR")
      return (
        (filters.direction === "asc" ? result : -result) ||
        a.id.localeCompare(b.id)
      )
    })
}

export function operationHref(
  filters: OperationListFilters,
  changes: Partial<OperationListFilters> = {}
) {
  const value = { ...filters, ...changes }
  const params = new URLSearchParams()
  if (value.q) params.set("q", value.q)
  if (value.kind) params.set("tipo", value.kind)
  if (value.situation) params.set("situacion", value.situation)
  if (value.responsible) params.set("responsable", value.responsible)
  if (value.from) params.set("desde", value.from)
  if (value.to) params.set("hasta", value.to)
  if (value.sort !== "updatedOn") params.set("orden", value.sort || "ninguno")
  if (value.direction !== "desc") params.set("direccion", value.direction)
  if (value.group) params.set("agrupar", value.group)
  if (value.page > 1) params.set("pagina", String(value.page))
  if (value.error) params.set("error", value.error)
  const query = params.toString()
  return `/operaciones${query ? `?${query}` : ""}`
}
