"use client"

import Link from "next/link"
import { ArrowRight, CircleAlert, Clock3, ShieldCheck } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { getWorkSummary } from "../../work/data/work-items"

import { useWorkItems } from "@/features/work/state/use-work-items"
import { formatDate } from "@workspace/ui/lib/date"

const viewHref = (view: string) => `/mi-trabajo?vista=${view}`

export function HomeOverview() {
  const items = useWorkItems()
  const summary = getWorkSummary(items)
  const attention = items
    .filter(
      (item) =>
        item.blocking ||
        item.timeBand === "Vencido" ||
        item.kind === "Excepción"
    )
    .slice(0, 3)
  const staleSource = items.find((item) => item.freshness === "Desactualizado")

  return (
    <div className="space-y-6">
      <PageHeader title="Inicio" />

      <section aria-labelledby="home-attention-title" className="max-w-5xl">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="home-attention-title"
              className="mt-1 text-lg font-semibold"
            >
              Requiere atención
            </h2>
          </div>
          <Link
            href={viewHref("all")}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Ver todo en Mi trabajo <ArrowRight aria-hidden="true" />
          </Link>
        </div>

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
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.blocking ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                      <ShieldCheck aria-hidden="true" className="size-3.5" />{" "}
                      Control bloqueante
                    </span>
                  ) : item.timeBand === "Vencido" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                      <Clock3 aria-hidden="true" className="size-3.5" /> Vencido
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <CircleAlert aria-hidden="true" className="size-3.5" />{" "}
                      Excepción
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.origin} <span aria-hidden="true">·</span>{" "}
                  {item.reference}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.reason}
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
      </section>

      <section
        aria-labelledby="home-work-summary"
        className="max-w-5xl border-y border-border py-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="home-work-summary" className="text-base font-semibold">
              Situación del escenario
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {items.length} elementos sintéticos
          </span>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
          <SummaryLink
            href={viewHref("all")}
            label="Trabajo visible"
            value={summary.total}
          />
          <SummaryLink
            href={viewHref("controls")}
            label="Controles"
            value={summary.controls}
          />
          <SummaryLink
            href={viewHref("upcoming")}
            label="Próximos"
            value={summary.upcoming}
          />
          <SummaryLink
            href={viewHref("overdue")}
            label="Vencidos"
            value={summary.overdue}
          />
          <SummaryLink
            href={viewHref("reviews")}
            label="Revisiones"
            value={summary.reviews}
          />
        </dl>
      </section>

      <section aria-labelledby="home-data-state" className="max-w-5xl">
        <h2 id="home-data-state" className="text-base font-semibold">
          Procedencia y actualización
        </h2>

        {staleSource ? (
          <div className="mt-3 border-l-2 border-warning bg-muted/40 px-4 py-3 text-sm">
            <p className="font-medium">Dato de referencia desactualizado</p>
            <p className="mt-1 text-muted-foreground">
              {staleSource.reference}: {staleSource.source}; última fecha
              simulada{" "}
              {staleSource.sourceUpdatedAt
                ? formatDate(staleSource.sourceUpdatedAt)
                : "Sin fecha"}
              . No confirma el estado actual.
            </p>
          </div>
        ) : null}
        <Link
          href={viewHref("all")}
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "mt-3 px-0"
          )}
        >
          Revisar trabajo y contexto en Mi trabajo
        </Link>
      </section>
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
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xl font-semibold tabular-nums">
        <Link
          href={href}
          className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {value}
          <span className="sr-only">, ver en Mi trabajo</span>
        </Link>
      </dd>
    </div>
  )
}
