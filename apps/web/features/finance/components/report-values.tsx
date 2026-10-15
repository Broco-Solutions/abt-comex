import { money } from "../data/financial-records"
import type { valuationTotal } from "../data/management-rates"

export type ReportTotal = ReturnType<typeof valuationTotal>
export function ReportAmount({
  total,
  partialHistory = false,
}: {
  total?: ReportTotal
  partialHistory?: boolean
}) {
  if (!total) return <span>—</span>
  if (total.usd === undefined || (!total.complete && !total.usd))
    return (
      <span>
        Pendiente
        {total.pending ? (
          <span className="block text-xs font-normal text-muted-foreground">
            {total.pending} sin valoración completa
          </span>
        ) : null}
      </span>
    )
  return (
    <span className="tabular-nums">
      {money(total.usd, "USD")}
      {(!total.complete || partialHistory) && (
        <span className="block text-xs font-normal text-muted-foreground">
          Subtotal parcial
          {total.pending
            ? ` · ${total.pending} pendientes`
            : " · historia incompleta"}
        </span>
      )}
    </span>
  )
}
export function variation(
  current?: ReportTotal,
  previous?: ReportTotal,
  comparable = false
) {
  return comparable &&
    current?.complete &&
    previous?.complete &&
    current.usd !== undefined &&
    previous.usd !== undefined &&
    previous.usd > 0
    ? ((current.usd - previous.usd) / previous.usd) * 100
    : undefined
}
export function Variation({ value }: { value?: number }) {
  return (
    <span className="tabular-nums">
      {value === undefined
        ? "Sin base comparable"
        : `${value > 0 ? "+" : ""}${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(value)} %`}
    </span>
  )
}
