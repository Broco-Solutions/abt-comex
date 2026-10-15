"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import {
  buckets,
  money,
  type Currency,
  type FinancialRecord,
  type ChartBucket,
} from "../data/financial-records"

const config = {
  invoice: { label: "Facturación", color: "var(--chart-1)" },
  receipt: { label: "Cobros registrados", color: "var(--chart-2)" },
  value: { label: "Importe", color: "var(--chart-1)" },
}
export type Drill = (
  type: FinancialRecord["type"],
  dimension: "month" | "client" | "category" | "due",
  key: string
) => string

export function BillingChart({
  records,
  currency,
  drill,
}: {
  records: FinancialRecord[]
  currency: Currency
  drill: Drill
}) {
  const router = useRouter()
  const invoices = buckets(
    records.filter((r) => r.type === "invoice"),
    "month"
  )
  const receipts = buckets(
    records.filter((r) => r.type === "receipt"),
    "month"
  )
  const months = [
    ...new Set([...invoices, ...receipts].map((b) => b.key)),
  ].sort()
  const data = months.map((key) => ({
    key,
    label: new Intl.DateTimeFormat("es-AR", {
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    }).format(new Date(key + "-01")),
    invoice: invoices.find((b) => b.key === key)?.value ?? 0,
    receipt: receipts.find((b) => b.key === key)?.value ?? 0,
  }))
  return (
    <section
      className="min-w-0 space-y-3 border-t border-border pt-4"
      aria-labelledby="billing-chart-title"
    >
      <h2 id="billing-chart-title" className="text-base font-semibold">
        Facturación y cobranzas por mes
      </h2>
      {data.length ? (
        <>
          <ChartContainer
            config={config}
            role="img"
            aria-label={`Facturación y cobros registrados por mes, en ${currency}. Desglose accesible a continuación.`}
          >
            <BarChart
              data={data}
              accessibilityLayer
              margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                width={58}
                tickFormatter={(v) =>
                  new Intl.NumberFormat("es-AR", {
                    notation: "compact",
                  }).format(Number(v))
                }
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(v) => money(Number(v), currency)}
                  />
                }
              />
              <Legend />
              <Bar
            isAnimationActive={false}
                name="Facturación"
                dataKey="invoice"
                fill="var(--color-invoice)"
                onClick={(_, index) => {
                  const item = data[index]
                  if (item) router.push(drill("invoice", "month", item.key))
                }}
              />
              <Bar
            isAnimationActive={false}
                name="Cobros registrados"
                dataKey="receipt"
                fill="var(--color-receipt)"
                onClick={(_, index) => {
                  const item = data[index]
                  if (item) router.push(drill("receipt", "month", item.key))
                }}
              />
            </BarChart>
          </ChartContainer>
          <details>
            <summary className="cursor-pointer text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
              Ver valores y registros por mes
            </summary>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Facturación y cobranzas en {currency}
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 text-left">
                      Mes
                    </th>
                    <th scope="col" className="text-right">
                      Facturación
                    </th>
                    <th scope="col" className="text-right">
                      Cobros registrados
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.key} className="border-b border-border">
                      <th scope="row" className="py-2 text-left font-normal">
                        {item.label}
                      </th>
                      {(["invoice", "receipt"] as const).map((type) => (
                        <td key={type} className="py-2 text-right">
                          <Link
                            className="font-mono text-primary underline underline-offset-4"
                            href={drill(type, "month", item.key)}
                          >
                            {money(item[type], currency)}
                            <span className="sr-only">
                              {" "}
                              · {type === "invoice"
                                ? "Facturación"
                                : "Cobros"}{" "}
                              {item.label}
                            </span>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <p role="status" className="py-8 text-sm text-muted-foreground">
          Sin registros para este período y moneda.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        La diferencia entre series no representa deuda. Cada serie usa la fecha
        de su propio evento.
      </p>
    </section>
  )
}

export function DistributionChart({
  title,
  id,
  data,
  currency,
  href,
}: {
  title: string
  id: string
  data: ChartBucket[]
  currency: Currency
  href: (key: string) => string
}) {
  const router = useRouter()
  return (
    <section
      className="min-w-0 space-y-3 border-t border-border pt-4"
      aria-labelledby={id}
    >
      <h2 id={id} className="text-base font-semibold">
        {title}
      </h2>
      {data.length ? (
        <>
          <ChartContainer
            config={config}
            role="img"
            aria-label={`${title}, en ${currency}. Valores y enlaces debajo.`}
          >
            <BarChart
              data={data}
              layout="vertical"
              accessibilityLayer
              margin={{ left: 0, right: 12, top: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) =>
                  new Intl.NumberFormat("es-AR", {
                    notation: "compact",
                  }).format(Number(v))
                }
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={122}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) =>
                  String(v).replace("Cliente Demo ", "Cliente ")
                }
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(v) => money(Number(v), currency)}
                  />
                }
              />
              <Bar
            isAnimationActive={false}
                dataKey="value"
                name={title}
                fill="var(--color-value)"
                onClick={(_, index) => {
                  const item = data[index]
                  if (item) router.push(href(item.key))
                }}
              />
            </BarChart>
          </ChartContainer>
          <ul
            className="divide-y divide-border"
            aria-label={`Registros de ${title}`}
          >
            {data.map((item) => (
              <li key={item.key}>
                <Link
                  href={href(item.key)}
                  className="flex justify-between gap-3 py-2 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="min-w-0">{item.label}</span>
                  <span className="shrink-0 font-mono">
                    {money(item.value, currency)}
                    <span className="sr-only">
                      {" "}
                      · {item.ids.length} registros
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p role="status" className="py-8 text-sm text-muted-foreground">
          Sin registros con información disponible para estos filtros.
        </p>
      )}
    </section>
  )
}
