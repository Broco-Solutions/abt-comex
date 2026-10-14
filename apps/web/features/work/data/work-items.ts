import type {
  WorkFilters,
  WorkItem,
  WorkItemKind,
  WorkSummary,
} from "../types/work-item"
import type { ImportationScenario } from "@/features/importation/types/importation"

export const DEMO_DATE = "2026-10-14"
export const DEMO_PERSON = "Lucía Benítez (escenario ficticio)"

// Synthetic examples only. They model work shapes and relationships, not ABT records.
export const workItems: WorkItem[] = [
  {
    id: "wrk-imp-control-01",
    kind: "Control",
    title: "Segundo control previo a oficialización",
    reason:
      "La revisión debe completarla una persona distinta de quien preparó el caso.",
    origin: "Importación · operación de demostración",
    reference: "OP-DEM-2048",
    relatedOperationId: "op-demo-2048",
    owner: "Martín Ríos (escenario ficticio)",
    dueDate: "2026-10-14",
    blocking: true,
    assignedToDemoUser: true,
    source: "ABT Comex · fixture local",
    freshness: "Disponible",
    nextStep:
      "El contexto aduanero se completa en la etapa de Importación. No se puede oficializar desde esta bandeja.",
    visible: true,
    activity: "Se registró una revisión para una segunda persona.",
  },
  {
    id: "wrk-exp-post-embarque-02",
    kind: "Tarea",
    title: "Completar documentación de post-embarque",
    reason:
      "La facturación no cierra el seguimiento operativo ni el legajo documental.",
    origin: "Exportación · operación de demostración",
    reference: "OP-DEM-3107",
    relatedOperationId: "op-demo-3107",
    owner: "Lucía Benítez (escenario ficticio)",
    dueDate: "2026-10-16",
    timeBand: "Próximo",
    assignedToDemoUser: true,
    source: "ABT Comex · fixture local",
    freshness: "Disponible",
    nextStep:
      "El seguimiento de cumplido y post-embarque se completa en la etapa de Exportación.",
    visible: true,
    activity: "La operación continúa activa después del pase a Facturación.",
  },
  {
    id: "wrk-doc-review-03",
    kind: "Revisión",
    title: "Revisar requisito documental del cliente",
    reason:
      "La documentación depende de la configuración aplicable a esta operación.",
    origin: "Cliente · antecedente de demostración",
    reference: "CLI-DEM-018",
    dueDate: "2026-10-20",
    source: "ABT Comex · fixture local",
    freshness: "Disponible",
    nextStep:
      "La revisión documental se representa aquí; no modifica una carpeta real.",
    visible: true,
    activity: "Se agregó un antecedente para revisión.",
  },
  {
    id: "wrk-quote-review-04",
    kind: "Revisión",
    title: "Revisar versión antes del envío al cliente",
    reason:
      "La aprobación interna y la aceptación del cliente son eventos distintos.",
    origin: "Cotización · versión de demostración",
    reference: "COT-DEM-001 · v1",
    relatedQuoteId: "quote-demo-001",
    owner: "Lucía Benítez (escenario ficticio)",
    dueDate: "2026-10-13",
    timeBand: "Vencido",
    assignedToDemoUser: true,
    source: "ABT Comex · fixture local",
    freshness: "Disponible",
    nextStep:
      "Revisar la versión vigente antes de registrar el envío al cliente.",
    visible: true,
    activity:
      "La revisión interna continúa pendiente; no se envió una cotización.",
  },
  {
    id: "wrk-admin-no-operation-05",
    kind: "Tarea",
    title: "Completar referencia de una rendición",
    reason:
      "La tarea administrativa no tiene una operación vinculada en este escenario.",
    origin: "Administración · tarea sin operación",
    reference: "REN-DEM-014",
    owner: "Sofía Méndez (escenario ficticio)",
    source: "ABT Comex · fixture local",
    freshness: "Disponible",
    nextStep:
      "La relación con rendiciones se aborda en Administración. Este caso no contiene importes.",
    visible: true,
    activity: "Se identificó una tarea preliminar sin operación asociada.",
  },
  {
    id: "wrk-export-exception-06",
    kind: "Excepción",
    title: "Verificar diferencia documental de embarque",
    reason:
      "Hay una diferencia que requiere revisión antes de completar el expediente.",
    origin: "Exportación · documentación de demostración",
    reference: "OP-DEM-3112",
    relatedOperationId: "op-demo-3112",
    owner: "Martín Ríos (escenario ficticio)",
    dueDate: "2026-10-12",
    timeBand: "Vencido",
    source: "ABT Comex · fixture local",
    freshness: "Parcial",
    nextStep:
      "La evidencia y resolución se trabajan en el detalle de Exportación. No se simula una conformidad.",
    visible: true,
    activity: "La diferencia sigue abierta; su causa y evidencia se conservan.",
  },
  {
    id: "wrk-source-status-07",
    kind: "Tarea",
    title: "Verificar una novedad aduanera desactualizada",
    reason:
      "El último dato de referencia disponible no es reciente; verificá la fuente antes de actuar.",
    origin: "Importación · destinación de demostración",
    reference: "OP-DEM-2054",
    relatedOperationId: "op-demo-2054",
    dueDate: "2026-10-17",
    timeBand: "Próximo",
    source: "Alpha2000 (origen de referencia simulado; no conectado)",
    sourceUpdatedAt: "2026-10-11",
    freshness: "Desactualizado",
    nextStep:
      "No se puede consultar Alpha2000 desde este prototipo. La última fecha se muestra sólo como dato ficticio.",
    visible: true,
    activity:
      "La referencia simulada permanece desactualizada y no confirma el estado actual.",
  },
  {
    id: "wrk-commercial-restricted-08",
    kind: "Tarea",
    title: "Información comercial restringida",
    reason:
      "Este registro no está disponible para la capacidad de demostración actual.",
    origin: "Administración · contenido no autorizado",
    reference: "Se omite",
    source: "ABT Comex · fixture local",
    freshness: "Disponible",
    nextStep: "",
    visible: false,
    activity: "",
  },
]

export const visibleWorkItems = () => workItems.filter((item) => item.visible)

// Completing a local control removes only that pending task, never officializes.
export function projectWorkItems(scenarios: ImportationScenario[]) {
  return visibleWorkItems().filter(
    (item) =>
      !(
        item.kind === "Control" &&
        scenarios.some(
          (scenario) =>
            scenario.operationId === item.relatedOperationId &&
            scenario.doubleControl.completed
        )
      )
  )
}

export function getWorkSummary(items: WorkItem[]): WorkSummary {
  return items.reduce<WorkSummary>(
    (summary, item) => {
      summary.total += 1
      if (item.blocking) summary.blocking += 1
      if (item.kind === "Control") summary.controls += 1
      if (item.timeBand === "Próximo") summary.upcoming += 1
      if (item.timeBand === "Vencido") summary.overdue += 1
      if (item.kind === "Revisión") summary.reviews += 1
      if (item.kind === "Excepción") summary.exceptions += 1
      return summary
    },
    {
      total: 0,
      blocking: 0,
      controls: 0,
      upcoming: 0,
      overdue: 0,
      reviews: 0,
      exceptions: 0,
    }
  )
}

const kindByKey: Record<string, WorkItemKind> = {
  control: "Control",
  revision: "Revisión",
  tarea: "Tarea",
  exception: "Excepción",
}

export function parseWorkFilters(
  params: Record<string, string | string[] | undefined>
): WorkFilters {
  const rawView = typeof params.vista === "string" ? params.vista : "all"
  const validViews = [
    "all",
    "mine",
    "upcoming",
    "overdue",
    "reviews",
    "controls",
    "exceptions",
  ] as const
  const view = validViews.find((candidate) => candidate === rawView) ?? "all"
  const rawKind = typeof params.tipo === "string" ? params.tipo : ""
  const query = typeof params.q === "string" ? params.q.trim() : ""

  return { query, kind: kindByKey[rawKind] ?? "", view }
}

export function filterWorkItems(
  items: WorkItem[],
  filters: WorkFilters
): WorkItem[] {
  const query = filters.query.toLocaleLowerCase("es-AR")
  return items.filter((item) => {
    if (!item.visible) return false
    if (filters.kind && item.kind !== filters.kind) return false
    if (filters.view === "mine" && !item.assignedToDemoUser) return false
    if (filters.view === "upcoming" && item.timeBand !== "Próximo") return false
    if (filters.view === "overdue" && item.timeBand !== "Vencido") return false
    if (filters.view === "reviews" && item.kind !== "Revisión") return false
    if (filters.view === "controls" && item.kind !== "Control") return false
    if (filters.view === "exceptions" && item.kind !== "Excepción") return false
    if (!query) return true
    const searchable = [
      item.title,
      item.reason,
      item.origin,
      item.reference,
      item.owner,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("es-AR")
    return searchable.includes(query)
  })
}

export const workViewLabels = {
  all: "Todo el trabajo",
  mine: "Asignado a mí · demo",
  upcoming: "Próximos",
  overdue: "Vencidos",
  reviews: "Revisiones",
  controls: "Controles",
  exceptions: "Excepciones",
} satisfies Record<WorkFilters["view"], string>
