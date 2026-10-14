import { demonstrationClients } from "@/features/clients/data/clients"

import type {
  DemonstrationQuote,
  DemoQuoteWorkflow,
  QuoteCurrency,
  QuoteLine,
  QuoteVersion,
} from "../types/quote"

const storageKey = "abt-comex:demo:quotes:v1"
let memoryDemoQuotes: DemonstrationQuote[] | null = null

// All values, clients, references and workflow events are invented for the demo.
export const initialDemoQuotes: DemonstrationQuote[] = [
  {
    id: "quote-demo-001",
    reference: "COT-DEM-001",
    clientId: "client-demo-norte",
    responsible: "Equipo Comercial A",
    versions: [
      {
        number: 1,
        updatedOn: "2026-10-14",
        service: "Servicio de coordinación de ejemplo",
        context: "Solicitud ficticia para escenario de demostración.",
        currency: "ARS",
        lines: [
          {
            id: "quote-demo-001-line-1",
            description: "Gestión demostrativa",
            quantity: 1,
            unitPrice: 24000,
          },
        ],
        conditions:
          "Condición ilustrativa; requiere definición comercial de ABT.",
        workflow: {
          internalApproval: "Pendiente",
          send: "No enviado",
          clientResponse: "Sin respuesta",
        },
      },
    ],
  },
  {
    id: "quote-demo-002",
    reference: "COT-DEM-002",
    clientId: "client-demo-centro",
    responsible: "Equipo Comercial B",
    versions: [
      {
        number: 1,
        updatedOn: "2026-10-12",
        service: "Servicio marítimo ficticio",
        context: "Ejemplo con aprobación interna todavía no enviada.",
        currency: "USD",
        lines: [
          {
            id: "quote-demo-002-line-1",
            description: "Coordinación de ejemplo",
            quantity: 2,
            unitPrice: 125,
          },
        ],
        conditions: "Condición ficticia; no representa una oferta vigente.",
        workflow: {
          internalApproval: "Aprobación simulada",
          send: "No enviado",
          clientResponse: "Sin respuesta",
        },
      },
    ],
  },
  {
    id: "quote-demo-003",
    reference: "COT-DEM-003",
    clientId: "client-demo-sur",
    responsible: "Equipo Comercial A",
    versions: [
      {
        number: 1,
        updatedOn: "2026-10-10",
        service: "Servicio de exportación ficticio",
        context: "Ejemplo de versión que recibió aceptación simulada.",
        currency: "ARS",
        lines: [
          {
            id: "quote-demo-003-line-1",
            description: "Revisión documental demostrativa",
            quantity: 3,
            unitPrice: 8500,
          },
        ],
        conditions: "Condición de muestra, sin vigencia comercial.",
        workflow: {
          internalApproval: "Aprobación simulada",
          send: "Envío simulado",
          clientResponse: "Aceptación simulada",
        },
      },
    ],
  },
  {
    id: "quote-demo-004",
    reference: "COT-DEM-004",
    clientId: "client-demo-este",
    responsible: "Equipo Comercial B",
    versions: [
      {
        number: 1,
        updatedOn: "2026-10-08",
        service: "Servicio aéreo ficticio",
        context: "Ejemplo de respuesta negativa simulada.",
        currency: "USD",
        lines: [
          {
            id: "quote-demo-004-line-1",
            description: "Coordinación de muestra",
            quantity: 1,
            unitPrice: 300,
          },
        ],
        conditions: "Condición de muestra, sin vigencia comercial.",
        workflow: {
          internalApproval: "Aprobación simulada",
          send: "Envío simulado",
          clientResponse: "Rechazo simulado",
        },
      },
    ],
  },
]

export type QuoteSearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

export function parseQuoteListState(params: QuoteSearchParams) {
  const requestedStatus = first(params.estado)
  const status = [
    "borrador",
    "pendiente-aprobacion",
    "pendiente-envio",
    "aceptada",
    "rechazada",
  ].includes(requestedStatus)
    ? requestedStatus
    : ""
  const error = first(params.error)
  const clientId = demonstrationClients.some(
    (client) => client.id === first(params.cliente)
  )
    ? first(params.cliente)
    : ""
  return {
    query: first(params.q).trim(),
    status,
    clientId,
    error: error === "lectura" || error === "sin-permiso" ? error : "",
  }
}

export function getCurrentQuoteVersion(quote: DemonstrationQuote) {
  return quote.versions.reduce((current, version) =>
    version.number > current.number ? version : current
  )
}

export function calculateQuoteTotal(lines: QuoteLine[]) {
  return lines.reduce(
    (total, line) => total + line.quantity * line.unitPrice,
    0
  )
}

export function formatQuoteAmount(amount: number, currency: QuoteCurrency) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function quoteStatus(quote: DemonstrationQuote) {
  const workflow = getCurrentQuoteVersion(quote).workflow
  if (workflow.clientResponse === "Aceptación simulada")
    return "Aceptada (demo)"
  if (workflow.clientResponse === "Rechazo simulado") return "Rechazada (demo)"
  if (workflow.send === "Envío simulado") return "Enviada (demo)"
  if (workflow.internalApproval === "Aprobación simulada") {
    return "Pendiente de envío"
  }
  return "Borrador"
}

export function transitionDemoQuote(
  quote: DemonstrationQuote,
  action: "approve" | "send" | "accept" | "reject"
): DemonstrationQuote | null {
  const currentVersion = getCurrentQuoteVersion(quote)
  const workflow = currentVersion.workflow
  if (action === "approve") {
    if (
      workflow.internalApproval !== "Pendiente" ||
      workflow.send !== "No enviado"
    )
      return null
    return {
      ...quote,
      versions: quote.versions.map((version) =>
        version.number === currentVersion.number
          ? {
              ...version,
              workflow: {
                ...workflow,
                internalApproval: "Aprobación simulada",
              },
            }
          : version
      ),
    }
  }
  if (action === "send") {
    if (
      workflow.internalApproval !== "Aprobación simulada" ||
      workflow.send !== "No enviado"
    )
      return null
    return {
      ...quote,
      versions: quote.versions.map((version) =>
        version.number === currentVersion.number
          ? { ...version, workflow: { ...workflow, send: "Envío simulado" } }
          : version
      ),
    }
  }
  if (
    workflow.send !== "Envío simulado" ||
    workflow.clientResponse !== "Sin respuesta"
  )
    return null
  return {
    ...quote,
    versions: quote.versions.map((version) =>
      version.number === currentVersion.number
        ? {
            ...version,
            workflow: {
              ...workflow,
              clientResponse:
                action === "accept"
                  ? "Aceptación simulada"
                  : "Rechazo simulado",
            },
          }
        : version
    ),
  }
}

export function filterDemoQuotes(
  quotes: DemonstrationQuote[],
  state: ReturnType<typeof parseQuoteListState>
) {
  const normalizedQuery = state.query.toLocaleLowerCase("es-AR")
  return quotes.filter((quote) => {
    if (state.clientId && quote.clientId !== state.clientId) return false
    const status = quoteStatus(quote)
    const statusMatches =
      !state.status ||
      (state.status === "borrador" && status === "Borrador") ||
      (state.status === "pendiente-aprobacion" &&
        getCurrentQuoteVersion(quote).workflow.internalApproval ===
          "Pendiente") ||
      (state.status === "pendiente-envio" && status === "Pendiente de envío") ||
      (state.status === "aceptada" &&
        getCurrentQuoteVersion(quote).workflow.clientResponse ===
          "Aceptación simulada") ||
      (state.status === "rechazada" &&
        getCurrentQuoteVersion(quote).workflow.clientResponse ===
          "Rechazo simulado")
    if (!statusMatches) return false
    const version = getCurrentQuoteVersion(quote)
    const clientName =
      demonstrationClients.find((item) => item.id === quote.clientId)?.name ??
      ""
    return [
      quote.reference,
      clientName,
      version.service,
      quote.responsible,
    ].some((value) =>
      value.toLocaleLowerCase("es-AR").includes(normalizedQuery)
    )
  })
}

export function quoteListHref(query: string, status = "", clientId = "") {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (status) params.set("estado", status)
  if (clientId) params.set("cliente", clientId)
  const search = params.toString()
  return `/cotizaciones${search ? `?${search}` : ""}`
}

function isQuoteWorkflow(value: unknown): value is DemoQuoteWorkflow {
  if (!value || typeof value !== "object") return false
  const workflow = value as Record<string, unknown>
  return (
    ["Pendiente", "Aprobación simulada"].includes(
      String(workflow.internalApproval)
    ) &&
    ["No enviado", "Envío simulado"].includes(String(workflow.send)) &&
    ["Sin respuesta", "Aceptación simulada", "Rechazo simulado"].includes(
      String(workflow.clientResponse)
    )
  )
}

function isQuoteVersion(value: unknown): value is QuoteVersion {
  if (!value || typeof value !== "object") return false
  const version = value as Record<string, unknown>
  return (
    Number.isInteger(version.number) &&
    Number(version.number) > 0 &&
    typeof version.updatedOn === "string" &&
    typeof version.service === "string" &&
    typeof version.context === "string" &&
    (version.currency === "ARS" || version.currency === "USD") &&
    typeof version.conditions === "string" &&
    isQuoteWorkflow(version.workflow) &&
    Array.isArray(version.lines) &&
    version.lines.every(
      (line) =>
        !!line &&
        typeof line === "object" &&
        typeof line.id === "string" &&
        typeof line.description === "string" &&
        Number.isSafeInteger(line.quantity) &&
        Number(line.quantity) > 0 &&
        Number.isSafeInteger(line.unitPrice) &&
        Number(line.unitPrice) >= 0
    )
  )
}

function isDemonstrationQuote(value: unknown): value is DemonstrationQuote {
  if (!value || typeof value !== "object") return false
  const quote = value as Record<string, unknown>
  return (
    typeof quote.id === "string" &&
    /^quote-demo-\d{3}$/.test(quote.id) &&
    typeof quote.reference === "string" &&
    demonstrationClients.some((client) => client.id === quote.clientId) &&
    typeof quote.responsible === "string" &&
    Array.isArray(quote.versions) &&
    quote.versions.length > 0 &&
    quote.versions.every(isQuoteVersion)
  )
}

export function parseDemoQuotes(raw: string | null) {
  if (!raw) return initialDemoQuotes
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every(isDemonstrationQuote))
      return parsed
  } catch {
    return initialDemoQuotes
  }
  return initialDemoQuotes
}

export function loadDemoQuotes() {
  if (typeof window === "undefined")
    return memoryDemoQuotes ?? initialDemoQuotes
  try {
    const stored = window.sessionStorage.getItem(storageKey)
    memoryDemoQuotes = stored
      ? parseDemoQuotes(stored)
      : (memoryDemoQuotes ?? initialDemoQuotes)
    return memoryDemoQuotes
  } catch {
    return memoryDemoQuotes ?? initialDemoQuotes
  }
}

export function saveDemoQuotes(quotes: DemonstrationQuote[]) {
  memoryDemoQuotes = quotes
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(quotes))
  } catch {
    // In-memory state remains available when browser session storage is denied.
  }
}

export function createDemoWorkflow(): DemoQuoteWorkflow {
  return {
    internalApproval: "Pendiente",
    send: "No enviado",
    clientResponse: "Sin respuesta",
  }
}

export function createDemoQuoteVersion(args: {
  number: number
  service: string
  context: string
  currency: QuoteCurrency
  lines: QuoteLine[]
  conditions: string
  workflow?: DemoQuoteWorkflow
}): QuoteVersion {
  return {
    ...args,
    updatedOn: "2026-10-14",
    workflow: args.workflow ?? createDemoWorkflow(),
  }
}

export function nextDemoQuoteReference(quotes: DemonstrationQuote[]) {
  const maximum = quotes.reduce((value, quote) => {
    const sequence = Number(quote.id.slice("quote-demo-".length))
    return Number.isInteger(sequence) ? Math.max(value, sequence) : value
  }, 0)
  return {
    id: `quote-demo-${String(maximum + 1).padStart(3, "0")}`,
    reference: `COT-DEM-${String(maximum + 1).padStart(3, "0")}`,
  }
}
