import type { DemonstrationOperation } from "../types/operation"

// Fictional, stable examples. They do not represent ABT records or live sources.
export const demonstrationOperations: DemonstrationOperation[] = [
  {
    id: "op-demo-2048",
    reference: "OP-DEM-2048",
    kind: "Importación",
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
    kind: "Importación",
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
    kind: "Importación",
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
    kind: "Exportación",
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
    kind: "Exportación",
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
    kind: "Exportación",
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
    kind: "Exportación",
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
    kind: "Importación",
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
    kind: "Exportación",
    client: "Cliente Demo Norte",
    responsible: "Equipo Expo A",
    modality: "Marítima",
    situation: "En seguimiento",
    updatedOn: "2026-09-30",
    alert: "Sin alerta",
    nextAction: "Consultar estado del proceso",
  },
]

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
    | "reference"
    | "client"
    | "kind"
    | "situation"
    | "responsible"
    | "updatedOn"
  direction: "asc" | "desc"
  group: "" | "kind" | "situation" | "responsible"
  page: number
  operation: string
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
      ["Equipo Impo A", "Equipo Impo B", "Equipo Expo A", "Equipo Expo B"].find(
        (item) => item === first(params.responsable)
      ) ?? "",
    from: /^\d{4}-\d{2}-\d{2}$/.test(first(params.desde))
      ? first(params.desde)
      : "",
    to: /^\d{4}-\d{2}-\d{2}$/.test(first(params.hasta))
      ? first(params.hasta)
      : "",
    sort: [
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
    operation: first(params.operacion),
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
      (item) => !filters.responsible || item.responsible === filters.responsible
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
  if (value.sort !== "updatedOn") params.set("orden", value.sort)
  if (value.direction !== "desc") params.set("direccion", value.direction)
  if (value.group) params.set("agrupar", value.group)
  if (value.page > 1) params.set("pagina", String(value.page))
  if (value.operation) params.set("operacion", value.operation)
  if (value.error) params.set("error", value.error)
  const query = params.toString()
  return `/operaciones${query ? `?${query}` : ""}`
}
