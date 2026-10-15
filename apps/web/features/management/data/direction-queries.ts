import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { formatDate, parseSpanishDate } from "@workspace/ui/lib/date"
import {
  presetPeriod,
  type AnalysisPreset,
} from "@workspace/ui/lib/analysis-period"
import { money } from "@/features/finance/data/financial-records"
import { valuationTotal } from "@/features/finance/data/management-rates"
import {
  canReportMetric,
  eventBuckets,
  reportDateError,
  reportingOperations,
  selectExecutiveReport,
  REPORT_HISTORY_START,
  type ReportInput,
  type ReportContext,
  type ReportEvent,
  type ReportObligation,
} from "@/features/finance/data/reporting"

export const directionQueryCatalog = {
  ranking: {
    example:
      "¿Cuáles fueron los principales clientes por facturación en este período?",
    definition:
      "Facturas de venta registradas, ordenadas de mayor a menor equivalente USD; no representa cobros.",
    date: "Fecha del comprobante",
    permission: "finance.billing",
  },
  billing: {
    example: "¿Cuánto facturamos en este período?",
    definition:
      "Suma de facturas de venta registradas; no incluye comprobantes preparados ni cobros.",
    date: "Fecha del comprobante",
    permission: "finance.billing",
  },
  clientBilling: {
    example: "¿Cuánto se facturó al cliente seleccionado en este período?",
    definition:
      "Facturas de venta del cliente, con relación explícita; no representa ingreso efectivo.",
    date: "Fecha del comprobante",
    permission: "finance.billing",
  },
  receipts: {
    example: "¿Cuánto se cobró del cliente seleccionado en este período?",
    definition:
      "Cobros registrados del cliente según su propia fecha. No se infiere una aplicación a factura.",
    date: "Fecha propia del cobro",
    permission: "finance.collections",
  },
  operations: {
    example: "¿Cuántas operaciones tiene el cliente seleccionado?",
    definition:
      "Operaciones del cliente en el escenario. Consulta de existencia actual: no aplica período ni moneda.",
    date: "Población actual del escenario, sin filtro temporal",
    permission: "operations.read",
  },
  balance: {
    example:
      "¿Qué saldo abierto de facturas tiene el cliente seleccionado al corte?",
    definition:
      "Saldos abiertos de facturas de venta con historia explícita y completa al corte. Nunca facturación menos cobros.",
    date: "Fecha de corte (Hasta)",
    permission: "finance.collections",
  },
  expenses: {
    example: "¿Qué gastos registrados hubo por categoría en este período?",
    definition:
      "Sólo registros clasificados como gastos; agrupados por categoría. No son pagos ni costos totales.",
    date: "Fecha del gasto",
    permission: "finance.expenses",
  },
} as const
export type DirectionIntent = keyof typeof directionQueryCatalog
export type QueryStatus =
  | "ok"
  | "unsupported"
  | "clarification"
  | "ambiguous-client"
  | "invalid-date"
  | "empty"
  | "incomplete"
  | "missing-rate"
  | "read-error"
  | "forbidden"
export type DirectionAnswer = {
  status: QueryStatus
  message: string
  intent?: DirectionIntent
  context?: ReportContext
  events?: ReportEvent[]
  obligations?: ReportObligation[]
  operations?: ReturnType<typeof reportingOperations>
  ranking?: { key: string; label: string; value: number; ids: string[] }[]
  options?: { label: string; question: string; clientId?: string }[]
}
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[¿?.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
export function directionQueryPreset(
  question: string,
  fallback: AnalysisPreset
): AnalysisPreset {
  const text = normalize(question)
  if (/este mes/.test(text)) return "this-month"
  if (/mes (anterior|pasado)/.test(text)) return "previous-month"
  if (/este trimestre/.test(text)) return "this-quarter"
  if (/este ano/.test(text)) return "this-year"
  if (
    /\d|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/.test(
      text
    )
  )
    return "custom"
  return fallback
}
export function recognizeDirectionIntent(
  question: string
): DirectionIntent | undefined {
  const text = normalize(question)
  if (
    /\b(margen(?:es)?|rentabilidad|resultados?|impuestos?|liquidez|bancos?|echeqs?|proveedores?|pagar|pagos?|pagamos|compras?|costos?|neto|promedio|variacion|proyeccion|sin|excepto|excluir|menos|restar)\b/.test(
      text
    )
  )
    return undefined
  if (
    /factur/.test(text) &&
    /cobro|cobramos|cobrado/.test(text) &&
    /\by\b/.test(text)
  )
    return undefined
  if (/gastos?/.test(text) && /categoria/.test(text)) return "expenses"
  if (/saldo/.test(text) && /factura/.test(text)) return "balance"
  if (/(cuantas|cantidad|numero|contar).*operaciones/.test(text))
    return "operations"
  if (
    /(principales|ranking|mayor|mejores).*clientes/.test(text) &&
    /factura/.test(text)
  )
    return "ranking"
  if (
    /(cuanto|total|importe).*\b(cobro|cobros|cobrado|cobramos|cobro|cobranza)/.test(
      text
    ) ||
    /cuanto se cobro/.test(text)
  )
    return "receipts"
  if (/(cuanto|total|importe).*(factur|facturas)/.test(text))
    return /\b(a|al)\b|cliente/.test(text) && !/facturamos/.test(text)
      ? "clientBilling"
      : "billing"
  return undefined
}
function resolvedPeriod(question: string, base: ReportContext): ReportContext {
  const dates = question.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g)
  if (dates)
    return {
      ...base,
      from:
        dates.length === 2
          ? (parseSpanishDate(dates[0]!) ?? "invalid")
          : "invalid",
      to:
        dates.length === 2
          ? (parseSpanishDate(dates[1]!) ?? "invalid")
          : "invalid",
    }
  const text = normalize(question)
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]
  const month = months.findIndex((name) =>
    new RegExp(`\\b${name}\\b`).test(text)
  )
  if (
    months.filter((name) => new RegExp(`\\b${name}\\b`).test(text)).length > 1
  )
    return { ...base, from: "invalid", to: "invalid" }
  if (month >= 0) {
    const years = text.match(/\b20\d{2}\b/g)
    if (years && years.length !== 1)
      return { ...base, from: "invalid", to: "invalid" }
    const year = years?.[0] ?? DEMONSTRATION_DATE.slice(0, 4),
      from = `${year}-${String(month + 1).padStart(2, "0")}-01`,
      end = new Date(Date.UTC(Number(year), month + 1, 0))
        .toISOString()
        .slice(0, 10)
    return {
      ...base,
      from,
      to:
        from.slice(0, 7) === DEMONSTRATION_DATE.slice(0, 7)
          ? DEMONSTRATION_DATE
          : end,
    }
  }
  const preset = /este mes/.test(text)
    ? "this-month"
    : /mes (anterior|pasado)/.test(text)
      ? "previous-month"
      : /este trimestre/.test(text)
        ? "this-quarter"
        : /este ano/.test(text)
          ? "this-year"
          : undefined
  if (
    !preset &&
    /\b(20\d{2}|ayer|hoy|manana|proxim[oa]s?|siguiente|ultim[oa]s?|hace|semanas?|dias?)\b|\d{1,2}[-/]\d{1,2}/.test(
      text
    )
  )
    return { ...base, from: "invalid", to: "invalid" }
  return preset
    ? { ...base, ...presetPeriod(preset, DEMONSTRATION_DATE) }
    : { ...base }
}
/** Closed, local catalog. No model/provider, audit or parallel financial calculation. */
export function answerDirectionQuestion(
  question: string,
  input: ReportInput,
  base: ReportContext,
  readError = false,
  interpretPeriod = true
): DirectionAnswer {
  const forbidden = (): DirectionAnswer => ({
    status: "forbidden",
    message:
      "Esta perspectiva no permite consultar esta información. No se confirma la existencia de registros ni métricas.",
  })
  if (
    input.scenario.id === "client" ||
    !hasCapability(input.scenario, "management.read")
  )
    return forbidden()
  if (readError)
    return {
      status: "read-error",
      message:
        "No se pudo leer la fuente local. No se confirma ningún importe ni conteo. Conservá la consulta y reintentá.",
    }
  const text = normalize(question),
    intent = recognizeDirectionIntent(question)
  if (
    !intent &&
    (/\bingresos\b/.test(text) || /principales clientes/.test(text))
  )
    return {
      status: "clarification",
      message:
        "¿Qué indicador querés consultar? Facturación, cobros y cantidad de operaciones son métricas diferentes.",
      options: ["billing", "receipts", "operations"]
        .filter((key) =>
          hasCapability(
            input.scenario,
            directionQueryCatalog[key as DirectionIntent].permission
          )
        )
        .map((key) => ({
          label:
            key === "billing"
              ? "Facturación"
              : key === "receipts"
                ? "Cobros de un cliente"
                : "Cantidad de operaciones",
          question: directionQueryCatalog[key as DirectionIntent].example,
        })),
    }
  if (!intent)
    return {
      status: "unsupported",
      message:
        "La demo reconoce siete consultas concretas y algunas reformulaciones. Probá uno de los ejemplos; no interpreta preguntas generales ni calcula resultados o rentabilidad.",
    }
  if (
    !hasCapability(input.scenario, directionQueryCatalog[intent].permission) ||
    (intent === "expenses" && !canReportMetric(input.scenario, "expense"))
  )
    return forbidden()
  const context = interpretPeriod
      ? resolvedPeriod(question, base)
      : { ...base },
    error = reportDateError(context)
  if (error) return { status: "invalid-date", message: error, intent, context }
  const clients = input.organizations.filter((org) =>
    org.roles.some((role) => role.role === "client")
  )
  const selectedPhrase = /cliente seleccionado/.test(text)
  const exact = clients.filter((org) => text.includes(normalize(org.name)))
  const fragment =
    !selectedPhrase && !exact.length
      ? text
          .match(
            /\b(?:al|a|de|del|tiene)\s+(?:el\s+)?((?:cliente\s+)?[a-z][a-z\s-]*?)(?=\s+(?:en|entre|al corte|este|el mes)|$)/
          )?.[1]
          ?.replace(/^cliente\s+/, "")
          .trim()
      : ""
  const matches = exact.length
    ? exact
    : fragment
      ? clients.filter((org) => normalize(org.name).includes(fragment))
      : []
  const needsClient = [
    "clientBilling",
    "receipts",
    "operations",
    "balance",
  ].includes(intent)
  if (matches.length > 1)
    return {
      status: "ambiguous-client",
      intent,
      context,
      message:
        "El nombre coincide con más de un cliente. Elegí uno para continuar.",
      options: matches.map((org) => ({
        label: org.name,
        clientId: org.id,
        question: directionQueryCatalog[intent].example,
      })),
    }
  if (matches.length === 1) context.clientId = matches[0]!.id
  else if (needsClient && fragment && !selectedPhrase)
    return {
      status: "incomplete",
      intent,
      context,
      message:
        "No pude identificar ese cliente en el catálogo autorizado. Elegilo en el filtro Cliente y usá el ejemplo de cliente seleccionado.",
    }
  if (needsClient && !context.clientId)
    return {
      status: "incomplete",
      intent,
      context,
      message:
        "Elegí un cliente en el filtro o escribí su nombre completo. No se calculó un total sin identificarlo.",
    }
  const clientName =
    clients.find((org) => org.id === context.clientId)?.name ?? "el cliente"
  if (intent === "operations") {
    const operations = reportingOperations(input).filter(
      (operation) =>
        operation.clientId === context.clientId &&
        (!context.kind || operation.kind === context.kind)
    )
    return {
      status: operations.length ? "ok" : "empty",
      intent,
      context,
      operations,
      message: operations.length
        ? `${clientName} tiene ${operations.length} operaciones en el escenario. No se aplicó un filtro temporal.`
        : "No hay operaciones para el cliente y tipo seleccionados. No se aplica período a esta consulta.",
    }
  }
  const report = selectExecutiveReport(input, context)
  if (intent === "balance") {
    const obligations = report.obligations.filter(
      (row) =>
        row.side === "Cobrar" &&
        input.vouchers.documents.some(
          (doc) => doc.id === row.id && doc.kind === "Factura"
        )
    )
    if (obligations.some((row) => row.balance === undefined))
      return {
        status: "incomplete",
        intent,
        context,
        obligations,
        message:
          "Hay facturas sin saldo explícito completo al corte. No se puede confirmar el saldo total del cliente.",
      }
    const total = valuationTotal(obligations)
    return {
      status: !obligations.length
        ? "empty"
        : !total.complete
          ? "missing-rate"
          : "ok",
      intent,
      context,
      obligations,
      message: !obligations.length
        ? "Sin facturas abiertas registradas para ese cliente al corte; no equivale a certificar ausencia de deuda real."
        : !total.complete
          ? "Falta una referencia de cambio válida al corte. No se publica un total USD parcial."
          : `${clientName} tiene ${money(total.usd!, "USD")} de saldo abierto de facturas al ${formatDate(context.to)}.`,
    }
  }
  const metric =
    intent === "receipts"
      ? "receipt"
      : intent === "expenses"
        ? "expense"
        : "invoice"
  const events = report.events.filter((event) => event.metric === metric)
  if (context.from < REPORT_HISTORY_START)
    return {
      status: "incomplete",
      intent,
      context,
      events,
      message:
        "El período excede la historia sintética disponible desde el 01/05/2026. No se confirma un total completo.",
    }
  if (!events.length)
    return {
      status: "empty",
      intent,
      context,
      events,
      message:
        "No hay registros del indicador para el período y los filtros aplicados. No se informa un cero como dato económico completo.",
    }
  if (
    events.some((event) => !Number.isFinite(event.amount) || event.amount < 0)
  )
    return {
      status: "incomplete",
      intent,
      context,
      events,
      message: "Hay importes incompletos o inválidos. No se confirma el total.",
    }
  const total = valuationTotal(events)
  if (!total.complete)
    return {
      status: "missing-rate",
      intent,
      context,
      events,
      message:
        "Hay registros sin equivalente USD válido. Revisá su importe y la referencia histórica de cambio; no se publica un total parcial.",
    }
  if (
    intent === "ranking" &&
    events.some((event) => event.clientIds.length !== 1)
  )
    return {
      status: "incomplete",
      intent,
      context,
      events,
      message:
        "Hay facturas sin una única relación de cliente verificable. No se puede confirmar un ranking completo.",
    }
  const ranking =
    intent === "ranking" || intent === "expenses"
      ? eventBuckets(
          events,
          intent === "ranking" ? "client" : "category",
          input.organizations
        )
      : undefined
  const range = `${formatDate(context.from)} al ${formatDate(context.to)}`
  return {
    status: "ok",
    intent,
    context,
    events,
    ranking,
    message:
      intent === "ranking"
        ? `El principal cliente por facturación es ${ranking![0]!.label}, con ${money(ranking![0]!.value, "USD")}, del ${range}. Orden: facturación USD descendente.`
        : intent === "expenses"
          ? `Se registraron ${money(total.usd!, "USD")} de gastos del ${range}, agrupados por categoría.`
          : intent === "receipts"
            ? `Se cobraron ${money(total.usd!, "USD")} de ${clientName} del ${range}.`
            : `Se facturaron ${money(total.usd!, "USD")}${context.clientId ? ` a ${clientName}` : ""} del ${range}.`,
  }
}
