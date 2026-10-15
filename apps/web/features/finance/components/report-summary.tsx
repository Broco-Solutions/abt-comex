import Link from "next/link"
import { formatDate } from "@workspace/ui/lib/date"
import {
  reportMetricLabels,
  obligationTotal,
  type ExecutiveReport,
  type ReportMetric,
} from "../data/reporting"
import { ReportAmount, Variation, variation } from "./report-values"

export function ReportSummary({
  report,
  previous,
  comparable,
  cut,
  metricHref,
  obligationHref,
}: {
  report: ExecutiveReport
  previous?: ExecutiveReport
  comparable: boolean
  cut: string
  metricHref: (metric: ReportMetric) => string
  obligationHref: (side: "cobrar" | "pagar", band?: string) => string
}) {
  const canCompare =
    comparable && report.completeHistory && !!previous?.completeHistory
  return (
    <section
      aria-label="Situación económico-financiera"
      className="workspace-surface space-y-4 p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold">Situación del período · USD</h2>
        <p className="text-xs text-muted-foreground">
          Saldos al {formatDate(cut)}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-5 lg:grid-cols-3 xl:grid-cols-6">
        {(["invoice", "receipt", "expense", "payment"] as const)
          .filter((metric) => report.totals[metric])
          .map((metric) => (
            <div key={metric}>
              <dt className="text-xs text-muted-foreground">
                <Link
                  href={metricHref(metric)}
                  className="inline-flex min-h-8 items-center text-primary underline"
                >
                  {reportMetricLabels[metric]}
                </Link>
              </dt>
              <dd className="mt-1 text-base font-semibold">
                <ReportAmount
                  total={report.totals[metric]}
                  partialHistory={!report.completeHistory}
                />
              </dd>
              {canCompare && (
                <dd className="mt-1 text-xs text-muted-foreground">
                  <Variation
                    value={variation(
                      report.totals[metric],
                      previous?.totals[metric],
                      canCompare
                    )}
                  />
                </dd>
              )}
            </div>
          ))}
        {(
          [
            ["cobrar", "Cuentas por cobrar", report.receivables],
            ["pagar", "Cuentas por pagar", report.payables],
          ] as const
        )
          .filter(([, , total]) => total)
          .map(([side, label, total]) => (
            <div key={side}>
              <dt className="text-xs text-muted-foreground">
                <Link
                  href={obligationHref(side)}
                  className="inline-flex min-h-8 items-center text-primary underline"
                >
                  {label}
                </Link>
              </dt>
              <dd className="mt-1 text-base font-semibold">
                <ReportAmount total={total} />
              </dd>
            </div>
          ))}
      </dl>
      {(report.receivables || report.payables) && (
        <div className="grid gap-3 border-t border-border pt-3 text-sm sm:grid-cols-2">
          {(
            [
              ["Cobrar", "cobrar", "Por cobrar"],
              ["Pagar", "pagar", "Por pagar"],
            ] as const
          )
            .filter(([side]) =>
              side === "Cobrar" ? report.receivables : report.payables
            )
            .map(([side, key, label]) => (
              <div key={side}>
                <p className="text-xs text-muted-foreground">
                  {label} · vencimientos al corte
                </p>
                <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2">
                  <Link
                    href={obligationHref(key, "vencido")}
                    className="text-primary underline"
                  >
                    Vencido:{" "}
                    <ReportAmount
                      total={obligationTotal(
                        report.obligations.filter((row) => row.side === side),
                        "Vencido"
                      )}
                    />
                  </Link>
                  <Link
                    href={obligationHref(key, "proximo")}
                    className="text-primary underline"
                  >
                    Próximos 30 días:{" "}
                    <ReportAmount
                      total={obligationTotal(
                        report.obligations.filter((row) => row.side === side),
                        ["Vence hoy", "Próximos 30 días"]
                      )}
                    />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  )
}
