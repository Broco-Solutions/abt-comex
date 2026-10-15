import { hasCapability } from "@/features/demo/data/capabilities"
import {
  DEMONSTRATION_DATE,
  scenarioKind,
  type Scenario,
} from "@/features/demo/data/scenarios"
import {
  projectAdministrativeFinancialRecords,
  movementDirection,
  type AdministrativeLedger,
  type MovementNature,
} from "@/features/administration/data/administrative-ledger"
import {
  portfolio,
  type VoucherState,
} from "@/features/administration/data/vouchers"
import {
  isFinancialDate,
  type Currency,
  type ChartBucket,
} from "@/features/finance/data/financial-records"
import {
  valueInUsd,
  valuationTotal,
  type RateBook,
  type UsdValuation,
} from "@/features/finance/data/management-rates"
import type { Organization } from "@/features/organizations/data/organizations"
import type {
  DemonstrationOperation,
  OperationKind,
} from "@/features/operations/types/operation"

export const REPORT_HISTORY_START = "2026-05-01"
export const reportMetricLabels = {
  invoice: "Facturación",
  receipt: "Cobros",
  expense: "Gastos registrados",
  payment: "Pagos",
  purchase: "Compras referenciadas",
  income: "Otros ingresos",
  outflow: "Otros egresos",
  "advance-in": "Anticipos recibidos",
  "advance-out": "Anticipos entregados",
  refund: "Devoluciones de anticipo",
} as const
export type ReportMetric = keyof typeof reportMetricLabels
export type ReportInput = {
  ledger: AdministrativeLedger
  vouchers: VoucherState
  organizations: Organization[]
  operations: DemonstrationOperation[]
  book: RateBook
  scenario: Scenario
}
export type ReportContext = {
  from: string
  to: string
  clientId?: string
  supplierId?: string
  kind?: OperationKind
  sourceCurrency?: Currency
  query?: string
  partyScope?: "client" | "supplier"
}
export type ReportEvent = {
  id: string
  reference: string
  metric: ReportMetric
  date: string
  amount: number
  currency: Currency
  partyId: string
  clientIds: string[]
  operationIds: string[]
  href: string
  categoryId?: string
  category?: string
  valuation?: UsdValuation
}
export type ReportObligation = {
  id: string
  reference: string
  side: "Cobrar" | "Pagar"
  partyId: string
  clientIds: string[]
  operationIds: string[]
  issuedOn: string
  dueOn: string
  amount: number
  currency: Currency
  balance?: number
  valuation?: UsdValuation
  band: "Vencido" | "Vence hoy" | "Próximos 30 días" | "Posterior" | "Sin fecha"
}
export function canReportMetric(scenario: Scenario, metric: ReportMetric) {
  if (scenario.id === "client") return false
  if (metric === "invoice") return hasCapability(scenario, "finance.billing")
  if (metric === "expense")
    return (
      hasCapability(scenario, "finance.expenses") &&
      hasCapability(scenario, "costs.internal")
    )
  return hasCapability(
    scenario,
    ["receipt", "income", "advance-in", "refund"].includes(metric)
      ? "finance.collections"
      : "finance.treasury"
  )
}
export function reportDateError(context: Pick<ReportContext, "from" | "to">) {
  return !isFinancialDate(context.from) || !isFinancialDate(context.to)
    ? "El período contiene una fecha inválida. Usá DD/MM/AAAA; no se confirman importes ni conteos."
    : context.from > context.to
      ? "La fecha Desde debe ser anterior o igual a Hasta. El rango no se aplicó."
      : context.to > DEMONSTRATION_DATE
        ? `Hasta supera la fecha de referencia del escenario (${DEMONSTRATION_DATE}).`
        : ""
}
const normalized = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-AR")
export function reportingOperations(input: ReportInput) {
  const kind = scenarioKind(input.scenario)
  return input.scenario.id === "client" ||
    !hasCapability(input.scenario, "operations.read")
    ? []
    : input.operations.filter((operation) => !kind || operation.kind === kind)
}
function relations(input: ReportInput, ids: string[], explicitClient = "") {
  const operations = reportingOperations(input).filter((operation) =>
    ids.includes(operation.id)
  )
  return {
    operationIds: operations.map((operation) => operation.id),
    clientIds: [
      ...new Set(
        [
          explicitClient,
          ...operations.map((operation) => operation.clientId),
        ].filter(Boolean)
      ),
    ],
  }
}
export function reportingEvents(input: ReportInput): ReportEvent[] {
  if (input.scenario.id === "client") return []
  const events = projectAdministrativeFinancialRecords(
    input.ledger,
    input.vouchers
  )
    .filter((record) => canReportMetric(input.scenario, record.type))
    .map(
      (record): ReportEvent => ({
        id: record.id,
        reference: record.reference,
        metric: record.type,
        date: record.date,
        amount: record.amount,
        currency: record.currency,
        partyId:
          record.partyId || (record.type !== "expense" ? record.clientId : ""),
        ...relations(
          input,
          record.operationIds ??
            (record.operationId ? [record.operationId] : []),
          record.clientId
        ),
        href: `/administracion/${record.type === "invoice" ? "comprobantes" : record.type === "receipt" ? "movimientos" : "gastos"}/${record.id}`,
        categoryId: record.categoryId,
        category: record.category,
        valuation: valueInUsd(
          record.amount,
          record.currency,
          record.date,
          input.book
        ),
      })
    )
  const natures: Record<MovementNature, ReportMetric> = {
    Cobro: "receipt",
    Pago: "payment",
    "Anticipo recibido": "advance-in",
    "Anticipo entregado": "advance-out",
    "Devolución de anticipo": "refund",
    "Otro ingreso": "income",
    "Otro egreso": "outflow",
  }
  for (const record of input.ledger.movements) {
    const metric = natures[record.nature]
    if (metric === "receipt" || !canReportMetric(input.scenario, metric))
      continue
    events.push({
      id: record.id,
      reference: record.reference,
      metric,
      date: record.date,
      amount: record.amount,
      currency: record.currency,
      partyId: record.partyId,
      ...relations(
        input,
        record.operationIds,
        movementDirection(record.nature) === "Ingreso" &&
          input.organizations.some(
            (org) =>
              org.id === record.partyId &&
              org.roles.some((entry) => entry.role === "client")
          )
          ? record.partyId
          : ""
      ),
      href: `/administracion/movimientos/${record.id}`,
      categoryId: record.categoryId,
      category: input.ledger.categories.find(
        (category) => category.id === record.categoryId
      )?.name,
      valuation: valueInUsd(
        record.amount,
        record.currency,
        record.date,
        input.book
      ),
    })
  }
  if (canReportMetric(input.scenario, "purchase"))
    for (const record of input.vouchers.documents.filter(
      (document) =>
        document.side === "Pagar" &&
        document.kind === "Factura" &&
        document.stage === "Referencia de evaluación"
    )) {
      events.push({
        id: record.id,
        reference: record.reference,
        metric: "purchase",
        date: record.issuedOn,
        amount: record.amount,
        currency: record.currency,
        partyId: record.partyId,
        ...relations(input, record.operationIds),
        href: `/administracion/comprobantes/${record.id}`,
        valuation: valueInUsd(
          record.amount,
          record.currency,
          record.issuedOn,
          input.book
        ),
      })
    }
  return events
}
function matchesContext(
  input: ReportInput,
  context: ReportContext,
  item: {
    partyId: string
    clientIds: string[]
    operationIds: string[]
    currency?: Currency
  }
) {
  if (context.sourceCurrency && item.currency !== context.sourceCurrency)
    return false
  if (context.clientId && !item.clientIds.includes(context.clientId))
    return false
  if (context.supplierId && item.partyId !== context.supplierId) return false
  if (
    context.kind &&
    !reportingOperations(input).some(
      (operation) =>
        item.operationIds.includes(operation.id) &&
        operation.kind === context.kind
    )
  )
    return false
  if (context.query) {
    const role = context.partyScope === "supplier" ? "abt-supplier" : "client"
    const ids = input.organizations
      .filter(
        (organization) =>
          organization.roles.some((entry) => entry.role === role) &&
          normalized(organization.name).includes(normalized(context.query!))
      )
      .map((organization) => organization.id)
    if (
      context.partyScope === "supplier"
        ? !ids.includes(item.partyId)
        : !item.clientIds.some((id) => ids.includes(id))
    )
      return false
  }
  return true
}
export function reportObligations(
  input: ReportInput,
  context: ReportContext
): ReportObligation[] {
  if (input.scenario.id === "client" || reportDateError(context)) return []
  const rows: ReportObligation[] = []
  for (const side of ["Cobrar", "Pagar"] as const) {
    if (
      !hasCapability(
        input.scenario,
        side === "Cobrar" ? "finance.collections" : "finance.treasury"
      )
    )
      continue
    for (const currency of ["ARS", "USD"] as const)
      for (const { document, balance } of portfolio(
        input.vouchers,
        side,
        context.to,
        currency
      )) {
        const relation = relations(
          input,
          document.operationIds,
          side === "Cobrar" ? document.partyId : ""
        )
        if (
          !matchesContext(input, context, {
            ...relation,
            partyId: document.partyId,
            currency,
          })
        )
          continue
        const days = isFinancialDate(document.dueOn)
          ? (Date.parse(document.dueOn) - Date.parse(context.to)) / 86400000
          : undefined
        rows.push({
          id: document.id,
          reference: document.reference,
          side,
          partyId: document.partyId,
          ...relation,
          issuedOn: document.issuedOn,
          dueOn: document.dueOn,
          amount: document.amount,
          currency,
          balance,
          valuation: valueInUsd(balance, currency, context.to, input.book),
          band:
            days === undefined
              ? "Sin fecha"
              : days < 0
                ? "Vencido"
                : days === 0
                  ? "Vence hoy"
                  : days <= 30
                    ? "Próximos 30 días"
                    : "Posterior",
        })
      }
  }
  return rows
}
export function selectExecutiveReport(
  input: ReportInput,
  context: ReportContext
) {
  const error = reportDateError(context)
  const events = error
    ? []
    : reportingEvents(input).filter(
        (event) =>
          event.date >= context.from &&
          event.date <= context.to &&
          matchesContext(input, context, event)
      )
  const obligations = reportObligations(input, context)
  const operationsInScope = error
    ? []
    : reportingOperations(input).filter(
        (operation) =>
          (!context.clientId || operation.clientId === context.clientId) &&
          (!context.kind || operation.kind === context.kind) &&
          (!context.query ||
            context.partyScope === "supplier" ||
            normalized(operation.client).includes(normalized(context.query)))
      )
  const operations = operationsInScope.filter(
    (operation) =>
      operation.openedOn &&
      operation.openedOn >= context.from &&
      operation.openedOn <= context.to
  )
  return {
    error,
    events,
    obligations,
    operations,
    undatedOperations: operationsInScope.filter(
      (operation) => !operation.openedOn
    ).length,
    completeHistory:
      !error &&
      context.from >= REPORT_HISTORY_START &&
      context.to <= DEMONSTRATION_DATE,
    totals: Object.fromEntries(
      Object.keys(reportMetricLabels)
        .filter(
          (metric) =>
            !error && canReportMetric(input.scenario, metric as ReportMetric)
        )
        .map((metric) => [
          metric,
          valuationTotal(events.filter((event) => event.metric === metric)),
        ])
    ) as Partial<Record<ReportMetric, ReturnType<typeof valuationTotal>>>,
    receivables:
      !error &&
      hasCapability(input.scenario, "finance.collections") &&
      input.scenario.id !== "client"
        ? valuationTotal(obligations.filter((item) => item.side === "Cobrar"))
        : undefined,
    payables:
      !error &&
      hasCapability(input.scenario, "finance.treasury") &&
      input.scenario.id !== "client"
        ? valuationTotal(obligations.filter((item) => item.side === "Pagar"))
        : undefined,
  }
}
export type ExecutiveReport = ReturnType<typeof selectExecutiveReport>
export function eventBuckets(
  events: ReportEvent[],
  dimension: "month" | "client" | "supplier" | "category",
  organizations: Organization[]
): ChartBucket[] {
  const groups = new Map<
    string,
    { label: string; micros: number; ids: string[]; pending: boolean }
  >()
  for (const event of events) {
    // Client attribution requires a single verified client, never an arbitrary first relation.
    const key =
      dimension === "month"
        ? event.date.slice(0, 7)
        : dimension === "category"
          ? event.categoryId || "uncategorized"
          : dimension === "supplier"
            ? event.partyId
            : event.clientIds.length === 1
              ? event.clientIds[0]!
              : ""
    if (!key) continue
    const label =
      dimension === "category"
        ? event.category || "Sin categoría"
        : (organizations.find((organization) => organization.id === key)
            ?.name ?? key)
    const current = groups.get(key) ?? {
      label,
      micros: 0,
      ids: [],
      pending: false,
    }
    current.pending ||= !event.valuation
    current.micros += event.valuation?.usdMicros ?? 0
    current.ids.push(event.id)
    groups.set(key, current)
  }
  return [...groups.entries()]
    .filter(([, value]) => !value.pending && Number.isSafeInteger(value.micros))
    .map(([key, value]) => ({
      key,
      label: value.label,
      value: value.micros / 1_000_000,
      ids: value.ids,
    }))
    .sort((a, b) =>
      dimension === "month"
        ? a.key.localeCompare(b.key)
        : b.value - a.value || a.label.localeCompare(b.label)
    )
}
export function billingSeries(events: ReportEvent[]) {
  return [
    ...new Set(
      events
        .filter(
          (event) => event.metric === "invoice" || event.metric === "receipt"
        )
        .map((event) => event.date.slice(0, 7))
    ),
  ]
    .sort()
    .map((key) => {
      const invoice = valuationTotal(
        events.filter(
          (event) => event.metric === "invoice" && event.date.startsWith(key)
        )
      )
      const receipt = valuationTotal(
        events.filter(
          (event) => event.metric === "receipt" && event.date.startsWith(key)
        )
      )
      return {
        key,
        label: new Intl.DateTimeFormat("es-AR", {
          month: "short",
          year: "2-digit",
          timeZone: "UTC",
        }).format(new Date(`${key}-01`)),
        invoice: invoice.complete ? invoice.usd! : null,
        receipt: receipt.complete ? receipt.usd! : null,
      }
    })
}
export function obligationTotal(
  rows: ReportObligation[],
  band?: ReportObligation["band"] | ReportObligation["band"][]
) {
  return valuationTotal(
    band
      ? rows
          .filter(
            (row) =>
              (Array.isArray(band)
                ? band.includes(row.band)
                : row.band === band) || row.band === "Sin fecha"
          )
          .map((row) =>
            row.band === "Sin fecha" ? { ...row, valuation: undefined } : row
          )
      : rows
  )
}
export function obligationBuckets(rows: ReportObligation[]): ChartBucket[] {
  const bands = [...new Set(rows.map((row) => row.band))]
  return bands.flatMap((key) => {
    const selected = rows.filter((row) => row.band === key)
    const total = valuationTotal(selected)
    return total.complete && total.usd !== undefined
      ? [
          {
            key,
            label: key,
            value: total.usd,
            ids: selected.map((row) => row.id),
          },
        ]
      : []
  })
}
export function reportParties(
  input: ReportInput,
  context: ReportContext,
  role: "client" | "abt-supplier"
) {
  if (input.scenario.id === "client") return []
  const report = selectExecutiveReport(input, context)
  const allowed =
    role === "client"
      ? hasCapability(input.scenario, "operations.read") ||
        canReportMetric(input.scenario, "invoice") ||
        canReportMetric(input.scenario, "receipt")
      : canReportMetric(input.scenario, "expense") ||
        canReportMetric(input.scenario, "purchase")
  if (!allowed || report.error) return []
  const client = role === "client"
  return input.organizations
    .filter(
      (organization) =>
        organization.roles.some((entry) => entry.role === role) &&
        (!context.query ||
          normalized(organization.name).includes(normalized(context.query))) &&
        (!context.clientId ||
          !client ||
          organization.id === context.clientId) &&
        (!context.supplierId ||
          client ||
          organization.id === context.supplierId)
    )
    .map((organization) => {
      const events = report.events.filter((event) =>
        client
          ? ["invoice", "receipt"].includes(event.metric) &&
            event.partyId === organization.id
          : ["purchase", "expense", "payment"].includes(event.metric) &&
            event.partyId === organization.id
      )
      const obligations = report.obligations.filter(
        (item) =>
          item.partyId === organization.id &&
          item.side === (client ? "Cobrar" : "Pagar")
      )
      const operations = client
        ? report.operations.filter(
            (operation) => operation.clientId === organization.id
          )
        : []
      const activity = [
        ...events.map((event) => event.date),
        ...operations.flatMap((operation) =>
          operation.openedOn ? [operation.openedOn] : []
        ),
      ]
        .sort()
        .at(-1)
      const canBalance = hasCapability(
        input.scenario,
        client ? "finance.collections" : "finance.treasury"
      )
      const canDocuments = client
        ? hasCapability(input.scenario, "finance.billing") || canBalance
        : canBalance
      const documentCount = canDocuments
        ? input.vouchers.documents.filter(
            (document) =>
              document.partyId === organization.id &&
              document.side === (client ? "Cobrar" : "Pagar") &&
              document.stage === "Referencia de evaluación" &&
              document.issuedOn >= context.from &&
              document.issuedOn <= context.to &&
              matchesContext(input, context, {
                partyId: document.partyId,
                currency: document.currency,
                ...relations(
                  input,
                  document.operationIds,
                  client ? document.partyId : ""
                ),
              })
          ).length
        : undefined
      return {
        organization,
        events,
        obligations,
        operations,
        activity,
        metrics: Object.fromEntries(
          (client ? ["invoice", "receipt"] : ["purchase", "expense", "payment"])
            .filter((metric) =>
              canReportMetric(input.scenario, metric as ReportMetric)
            )
            .map((metric) => [
              metric,
              valuationTotal(events.filter((event) => event.metric === metric)),
            ])
        ) as Partial<Record<ReportMetric, ReturnType<typeof valuationTotal>>>,
        balance: canBalance ? valuationTotal(obligations) : undefined,
        overdue: canBalance
          ? obligationTotal(obligations, "Vencido")
          : undefined,
        documentCount,
        concentration:
          client &&
          report.totals.invoice?.complete &&
          report.totals.invoice.usd &&
          valuationTotal(events.filter((event) => event.metric === "invoice"))
            .complete
            ? valuationTotal(
                events.filter((event) => event.metric === "invoice")
              ).usd! / report.totals.invoice.usd
            : undefined,
      }
    })
}
