"use client"

import Link from "next/link"
import { OperationSituationChart } from "./operation-situation-chart"
import { ArrowRight, CircleAlert, Clock3, Plus, Search } from "lucide-react"
import { PageHeader } from "@/components/navigation/page-header"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { formatDate } from "@workspace/ui/lib/date"
import { getWorkSummary } from "@/features/work/data/work-items"
import { useWorkItems } from "@/features/work/state/use-work-items"
import { useScenario } from "@/features/demo/state/scenario-provider"

const viewHref = (view: string) => `/mi-trabajo?vista=${view}`

export function HomeOverview() {
  const items = useWorkItems()
  const { scenario } = useScenario()
  const summary = getWorkSummary(items)
  const attention = items
    .filter(
      (item) =>
        item.blocking ||
        item.timeBand === "Vencido" ||
        item.kind === "Excepción"
    )
    .slice(0, 3)
  const upcoming = items
    .filter((item) => item.dueDate && item.timeBand !== "Vencido")
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))
    .slice(0, 4)
  const stale = items.find((item) => item.freshness === "Desactualizado")
  const actions = scenario.executive
    ? ([
        ["/gestion", "Ver análisis", Search],
        ["/cotizaciones/nueva", "Nueva cotización", Plus],
        ["/operaciones", "Buscar operación", Search],
      ] as const)
    : scenario.financial
      ? ([
          ["/administracion", "Revisar pases", Search],
          ["/mi-trabajo?vista=mine", "Mis pendientes", ArrowRight],
          ["/administracion/finanzas", "Ver finanzas", Search],
        ] as const)
      : ([
          ["/operaciones/nueva", "Nueva operación", Plus],
          ["/mi-trabajo?vista=mine", "Mis pendientes", ArrowRight],
          ["/operaciones", "Buscar operación", Search],
        ] as const)

  return (
    <div className="space-y-6">
      <PageHeader title="Inicio" />
      <section aria-labelledby="home-attention-title">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <h2 id="home-attention-title" className="text-lg font-semibold">
            Requiere atención
          </h2>
          <Link
            href={viewHref("all")}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Ver todo en Mi trabajo <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        {attention.length ? (
          <ul
            className="divide-y divide-border"
            aria-label="Casos que requieren atención"
          >
            {attention.map((item) => (
              <li
                key={item.id}
                className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{item.title}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        item.blocking ? "text-destructive" : "text-warning"
                      )}
                    >
                      <CircleAlert aria-hidden="true" className="size-3.5" />
                      {item.blocking
                        ? "Control bloqueante"
                        : item.timeBand === "Vencido"
                          ? "Vencido"
                          : "Excepción"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.reference} · {item.reason}
                  </p>
                </div>
                <Link
                  href={`/mi-trabajo?trabajo=${encodeURIComponent(item.id)}#${encodeURIComponent(item.id)}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "w-fit"
                  )}
                >
                  Ver contexto <ArrowRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="py-4 text-sm text-muted-foreground">
            No hay casos que requieran atención.
          </p>
        )}
      </section>

      <nav aria-label="Acciones rápidas" className="flex flex-wrap gap-2">
        {actions.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Icon aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section
          aria-labelledby="home-work-summary"
          className="border-t border-border pt-4"
        >
          <h2 id="home-work-summary" className="text-base font-semibold">
            Situación de trabajo
          </h2>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            <SummaryLink
              href={viewHref("all")}
              label="Pendientes"
              value={summary.total}
            />
            <SummaryLink
              href={viewHref("overdue")}
              label="Vencidos"
              value={summary.overdue}
            />
            <SummaryLink
              href={viewHref("controls")}
              label="Controles"
              value={summary.controls}
            />
          </dl>
        </section>
        <section
          aria-labelledby="home-dates"
          className="border-t border-border pt-4"
        >
          <h2 id="home-dates" className="text-base font-semibold">
            Próximos vencimientos
          </h2>
          {upcoming.length ? (
            <ul className="mt-2 divide-y divide-border">
              {upcoming.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/mi-trabajo?trabajo=${encodeURIComponent(item.id)}#${encodeURIComponent(item.id)}`}
                    className="flex items-start gap-3 py-3 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <Clock3
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{item.reference}</span>
                      <span className="block text-muted-foreground">
                        {item.title}
                      </span>
                    </span>
                    <time
                      className="shrink-0 font-mono text-xs"
                      dateTime={item.dueDate}
                    >
                      {formatDate(item.dueDate!)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Sin vencimientos próximos registrados.
            </p>
          )}
        </section>
      </div>
      <OperationSituationChart />
      {stale ? (
        <aside
          className="border-l-2 border-warning bg-muted/40 px-4 py-3 text-sm"
          aria-label="Dato desactualizado"
        >
          <p className="font-medium">
            {stale.reference} · Referencia desactualizada
          </p>
          <p className="mt-1 text-muted-foreground">
            {stale.source}; actualización{" "}
            {stale.sourceUpdatedAt
              ? formatDate(stale.sourceUpdatedAt)
              : "sin fecha"}
            . No confirma el estado actual.
          </p>
        </aside>
      ) : null}
    </div>
  )
}

function SummaryLink({
  href,
  label,
  value,
}: {
  href: string
  label: string
  value: number
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1">
        <Link
          href={href}
          className="text-2xl font-semibold tabular-nums underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {value}
          <span className="sr-only"> {label}</span>
        </Link>
      </dd>
    </div>
  )
}
