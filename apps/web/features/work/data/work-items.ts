import type {
  WorkFilters,
  WorkItem,
  WorkItemKind,
  WorkSummary,
} from "../types/work-item"
import type { ImportationScenario } from "@/features/importation/types/importation"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"

import {
  initialDemoQuotes,
  getCurrentQuoteVersion,
} from "@/features/quotes/data/quotes"
import type { DemonstrationQuote } from "@/features/quotes/types/quote"
import {
  loadAdministrativeLedger,
  renditionSummary,
} from "@/features/administration/data/administrative-ledger"

export const DEMO_DATE = DEMONSTRATION_DATE
export const DEMO_PERSON = "Escenario de evaluación"

// Synthetic examples only. They model work shapes and relationships, not ABT records.
export const workItems: WorkItem[] = [
  {
    id: "wrk-imp-control-01",
    kind: "Control",
    title: "Segundo control previo a oficialización",
    reason:
      "La revisión debe completarla una persona distinta de quien preparó el caso.",
    origin: "Importación",
    reference: "OP-DEM-2048",
    relatedOperationId: "op-demo-2048",
    owner: "Sin asignación individual · Importación",
    dueDate: "2026-10-14",
    blocking: true,
    assignedToDemoUser: true,
    source: "ABT Comex · registro local",
    freshness: "Disponible",
    nextStep:
      "Abrí el espacio de Importación para revisar el control pendiente. La oficialización se realiza externamente.",
    visible: true,
    activity: "Se registró una revisión para una segunda persona.",
  },
  {
    id: "wrk-exp-post-embarque-02",
    kind: "Tarea",
    title: "Completar documentación de post-embarque",
    reason:
      "La facturación no cierra el seguimiento operativo ni el legajo documental.",
    origin: "Exportación",
    reference: "OP-DEM-3107",
    relatedOperationId: "op-demo-3107",
    owner: "Sin asignación individual · Exportación",
    dueDate: "2026-10-16",
    timeBand: "Próximo",
    assignedToDemoUser: true,
    source: "ABT Comex · registro local",
    freshness: "Disponible",
    nextStep:
      "Revisá originales, cumplido y documentación en el espacio de Exportación.",
    visible: true,
    activity: "La operación continúa activa después del pase a Facturación.",
  },
  {
    id: "wrk-doc-review-03",
    kind: "Revisión",
    title: "Revisar requisito documental del cliente",
    reason:
      "La documentación depende de la configuración aplicable a esta operación.",
    origin: "Cliente",
    reference: "CLI-DEM-018",
    dueDate: "2026-10-20",
    source: "ABT Comex · registro local",
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
    origin: "Cotización",
    reference: "COT-DEM-001 · v1",
    relatedQuoteId: "quote-demo-001",
    owner: "Sin asignación individual · Comercial",
    dueDate: "2026-10-13",
    timeBand: "Vencido",
    assignedToDemoUser: true,
    source: "ABT Comex · registro local",
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
    owner: "Sin asignación individual · Administración",
    source: "ABT Comex · registro local",
    freshness: "Disponible",
    nextStep:
      "Revisá la referencia pendiente en Administración; no se ha vinculado una operación.",
    visible: true,
    activity: "Se identificó una tarea preliminar sin operación asociada.",
  },
  {
    id: "wrk-export-exception-06",
    kind: "Excepción",
    title: "Verificar diferencia documental de embarque",
    reason:
      "Hay una diferencia que requiere revisión antes de completar el expediente.",
    origin: "Exportación",
    reference: "OP-DEM-3112",
    relatedOperationId: "op-demo-3112",
    owner: "Sin asignación individual · Exportación",
    dueDate: "2026-10-12",
    timeBand: "Vencido",
    source: "ABT Comex · registro local",
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
    origin: "Importación",
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
    source: "ABT Comex · registro local",
    freshness: "Disponible",
    nextStep: "",
    visible: false,
    activity: "",
  },
]

export const visibleWorkItems = () => workItems.filter((item) => item.visible)

// Completing a local control removes only that pending task, never officializes.
export function projectWorkItems(
  scenarios: ImportationScenario[],
  quotes: DemonstrationQuote[] = initialDemoQuotes
) {
  const administrative = loadAdministrativeLedger()
  const rendition = administrative.renditions.find(
    (item) => item.id === "rendition-demo-014"
  )
  return visibleWorkItems()
    .filter(
      (item) =>
        item.id !== "wrk-admin-no-operation-05" ||
        !rendition ||
        !rendition.expenseIds.length ||
        renditionSummary(rendition, administrative).missing > 0
    )
    .filter(
      (item) =>
        !item.relatedQuoteId ||
        quotes.some(
          (quote) =>
            quote.id === item.relatedQuoteId &&
            getCurrentQuoteVersion(quote).workflow.internalApproval ===
              "Pendiente"
        )
    )
    .map((item) => {
      const quote = quotes.find((quote) => quote.id === item.relatedQuoteId)
      return quote
        ? {
            ...item,
            reference:
              quote.reference + " · v" + getCurrentQuoteVersion(quote).number,
          }
        : item
    })
    .filter(
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
  mine: "Asignado a mí",
  upcoming: "Próximos",
  overdue: "Vencidos",
  reviews: "Revisiones",
  controls: "Controles",
  exceptions: "Excepciones",
} satisfies Record<WorkFilters["view"], string>
