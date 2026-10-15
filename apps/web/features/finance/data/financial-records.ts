import { projectClients } from "@/features/organizations/data/organizations"
import { demonstrationClients } from "@/features/clients/data/clients"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { isIsoCalendarDate } from "@workspace/ui/lib/date"
export type Currency = "ARS" | "USD"
export type FinancialRecord = {
  id: string
  reference: string
  type: "invoice" | "receipt" | "expense"
  clientId: string
  date: string
  currency: Currency
  amount: number
  operationId?: string
  dueDate?: string
  openBalance?: number
  category?: string
  categoryId?: string
  partyId?: string
  operationIds?: string[]
  description?: string
  source?: string
}
export const FINANCIAL_CUTOFF = DEMONSTRATION_DATE
// URL filters are untrusted presentation input, not confirmed business dates.
export function isFinancialDate(value: string) {
  return isIsoCalendarDate(value)
}

export const financialRecords: FinancialRecord[] = [
  ...["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"].flatMap(
    (month, index): FinancialRecord[] =>
      ["ARS", "USD"].flatMap((currency, c): FinancialRecord[] => {
        const clientId =
          demonstrationClients[index % demonstrationClients.length]!.id
        const amount =
          currency === "ARS" ? 180000 + index * 34000 : 800 + index * 95
        return [
          {
            id: `invoice-${index}-${c}`,
            reference: `FAC-EVAL-${index + 1}-${currency}`,
            type: "invoice",
            clientId,
            date: `${month}-05`,
            currency: currency as Currency,
            amount,
            dueDate: `${month}-25`,
            openBalance:
              index < 3 ? 0 : Math.round(amount * (index === 5 ? 1 : 0.35)),
          },
          {
            id: `receipt-${index}-${c}`,
            reference: `COB-EVAL-${index + 1}-${currency}`,
            type: "receipt",
            clientId,
            date: `${month}-12`,
            currency: currency as Currency,
            amount: Math.round(amount * (0.6 + (index % 3) * 0.1)),
          },
          {
            id: `expense-${index}-${c}`,
            reference: `GAS-EVAL-${index + 1}-${currency}`,
            type: "expense",
            clientId,
            date: `${month}-08`,
            currency: currency as Currency,
            amount: Math.round(amount * 0.18),
            category: index % 2 ? "Documentación" : "Coordinación operativa",
          },
        ]
      })
  ),
  {
    id: "invoice-operation-3107",
    reference: "FAC-EVAL-3107",
    type: "invoice",
    clientId: "client-demo-norte",
    operationId: "op-demo-3107",
    date: "2026-10-10",
    currency: "ARS",
    amount: 275000,
    dueDate: "2026-10-14",
    openBalance: 275000,
  },
  {
    id: "invoice-operation-3133",
    reference: "FAC-EVAL-3133",
    type: "invoice",
    clientId: "client-demo-sur",
    operationId: "op-demo-3133",
    date: "2026-10-05",
    currency: "ARS",
    amount: 320000,
    dueDate: "2026-10-20",
    openBalance: 120000,
  },
  {
    id: "receipt-operation-3133",
    reference: "COB-EVAL-3133",
    type: "receipt",
    clientId: "client-demo-sur",
    operationId: "op-demo-3133",
    date: "2026-10-12",
    currency: "ARS",
    amount: 200000,
  },
  {
    id: "invoice-missing",
    reference: "FAC-EVAL-SIN-SALDO",
    type: "invoice",
    clientId: "client-demo-centro",
    date: "2026-10-07",
    currency: "ARS",
    amount: 95000,
    dueDate: "2026-10-13",
  },
]
export type FinancialFilters = {
  currency: Currency
  from: string
  to: string
  clientId: string
}
export function filterFinancialRecords(
  filters: FinancialFilters,
  records: FinancialRecord[] = financialRecords
) {
  return records.filter(
    (record) =>
      record.currency === filters.currency &&
      record.date >= filters.from &&
      record.date <= filters.to &&
      (!filters.clientId || record.clientId === filters.clientId)
  )
}
export function receivableBand(record: FinancialRecord) {
  return !record.dueDate
    ? "Sin fecha"
    : record.dueDate < FINANCIAL_CUTOFF
      ? "Vencido"
      : record.dueDate === FINANCIAL_CUTOFF
        ? "Vence hoy"
        : "Posterior al corte"
}
export type ChartBucket = {
  key: string
  label: string
  value: number
  ids: string[]
}
export function buckets(
  records: FinancialRecord[],
  dimension: "month" | "client" | "category" | "due"
): ChartBucket[] {
  const result = new Map<string, ChartBucket>()
  for (const record of records) {
    if (
      dimension === "due" &&
      (record.type !== "invoice" ||
        record.openBalance === undefined ||
        record.openBalance <= 0)
    )
      continue
    const key =
      dimension === "month"
        ? record.date.slice(0, 7)
        : dimension === "client"
          ? record.clientId
          : dimension === "category"
            ? (record.categoryId ?? record.category ?? "Sin categoría")
            : receivableBand(record)
    const label =
      dimension === "client"
        ? (projectClients().find((client) => client.id === key)?.name ?? key)
        : dimension === "category"
          ? (record.category ?? key)
          : key
    const bucket = result.get(key) ?? { key, label, value: 0, ids: [] }
    bucket.value =
      (Math.round(bucket.value * 100) +
        Math.round(
          (dimension === "due" ? record.openBalance! : record.amount) * 100
        )) /
      100
    bucket.ids.push(record.id)
    result.set(key, bucket)
  }
  return [...result.values()].sort((a, b) =>
    dimension === "month"
      ? a.key.localeCompare(b.key)
      : b.value - a.value || a.label.localeCompare(b.label)
  )
}
export const money = (value: number, currency: Currency) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)
