"use client"

import Link from "next/link"
import { ChevronDown, CircleAlert, Clock3, ShieldCheck } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { demonstrationOperations } from "@/features/operations/data/operations"

import {
  filterWorkItems,
  getWorkSummary,
  parseWorkFilters,
  workViewLabels,
} from "../data/work-items"
import type {
  WorkFilters,
  WorkItem,
  WorkItemKind,
  WorkView,
} from "../types/work-item"

import { useWorkItems } from "../state/use-work-items"
import { formatDate } from "@workspace/ui/lib/date"

const views: WorkView[] = [
  "all",
  "mine",
  "upcoming",
  "overdue",
  "reviews",
  "controls",
  "exceptions",
]
const kinds: Array<[string, WorkItemKind | "", string]> = [
  ["", "", "Todos los tipos"],
  ["control", "Control", "Control"],
  ["revision", "Revisión", "Revisión"],
  ["tarea", "Tarea", "Tarea"],
  ["exception", "Excepción", "Excepción"],
]

function queryHref(filters: WorkFilters, view: WorkView, itemId?: string) {
  const params = new URLSearchParams()
  if (filters.query) params.set("q", filters.query)
  if (filters.kind) {
    const kindParam = kinds.find(([, kind]) => kind === filters.kind)?.[0]
    if (kindParam) params.set("tipo", kindParam)
  }
  if (view !== "all") params.set("vista", view)
  if (itemId) params.set("trabajo", itemId)
  const search = params.toString()
  return `/mi-trabajo${search ? `?${search}` : ""}${itemId ? `#${itemId}` : ""}`
}

export function Worklist({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const filters = parseWorkFilters(searchParams)
  const visible = useWorkItems()
  const items = filterWorkItems(visible, filters)
  const summary = getWorkSummary(visible)
  const selectedId =
    typeof searchParams.trabajo === "string" ? searchParams.trabajo : ""
  const readError = searchParams.error === "lectura"
  const noAccess = searchParams.error === "sin-permiso"
  const visibleIds = new Set(items.map((item) => item.id))
  const missingContext = selectedId.length > 0 && !visibleIds.has(selectedId)
  const filterCount =
    Number(Boolean(filters.query)) +
    Number(Boolean(filters.kind)) +
    Number(filters.view !== "all")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi trabajo"
        description="Revisá pendientes y su contexto. Las acciones que pertenecen a módulos aún no disponibles se describen, pero no se simulan."
      />

      <section aria-label="Alcance de la bandeja" className="max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">
            {readError || noAccess ? (
              "Este estado no confirma conteos; se conservan tus filtros."
            ) : (
              <>
                <span className="font-medium text-foreground">
                  {items.length}
                </span>{" "}
                de {summary.total} elementos visibles en este escenario ficticio
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Los conteos omiten información fuera de la capacidad de
            demostración.
          </p>
        </div>

        <div
          className="flex gap-2 overflow-x-auto py-3"
          aria-label="Vistas de trabajo"
        >
          {views.map((view) => {
            const active = filters.view === view
            const href = queryHref(filters, view)
            return (
              <Link
                key={view}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: active ? "secondary" : "outline",
                    size: "sm",
                  }),
                  "min-h-9 shrink-0"
                )}
              >
                {workViewLabels[view]}
              </Link>
            )
          })}
        </div>

        <form
          action="/mi-trabajo"
          method="get"
          className="grid gap-3 border-y border-border py-3 sm:grid-cols-[minmax(12rem,1fr)_12rem_auto] sm:items-end"
        >
          {filters.view !== "all" ? (
            <input type="hidden" name="vista" value={filters.view} />
          ) : null}
          {selectedId ? (
            <input type="hidden" name="trabajo" value={selectedId} />
          ) : null}
          <div className="min-w-0">
            <label
              htmlFor="work-search"
              className="mb-1 block text-xs font-medium"
            >
              Buscar en título, origen o referencia
            </label>
            <Input
              id="work-search"
              name="q"
              type="search"
              defaultValue={filters.query}
              placeholder="Ej.: post-embarque"
            />
          </div>
          <div>
            <label
              htmlFor="work-kind"
              className="mb-1 block text-xs font-medium"
            >
              Tipo
            </label>
            <select
              id="work-kind"
              name="tipo"
              defaultValue={
                kinds.find(([, kind]) => kind === filters.kind)?.[0] ?? ""
              }
              className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {kinds.map(([key, , label]) => (
                <option key={key || "all"} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">
              Aplicar filtros
            </Button>
            {filterCount > 0 ? (
              <Link
                href="/mi-trabajo"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Limpiar
              </Link>
            ) : null}
          </div>
        </form>

        {readError ? (
          <section
            role="alert"
            aria-labelledby="work-read-error"
            className="mt-4 max-w-2xl border-l-2 border-destructive bg-background px-5 py-5"
          >
            <h2 id="work-read-error" className="text-base font-semibold">
              No pudimos cargar tus pendientes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Este es un estado de error recuperable de la demostración.
              Conservamos la búsqueda, el tipo y la vista; no se muestra un
              conteo que no pudimos confirmar.
            </p>
            <Link
              href={queryHref(filters, filters.view)}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3"
              )}
            >
              Reintentar lectura
            </Link>
          </section>
        ) : null}

        {noAccess ? (
          <section
            role="status"
            aria-labelledby="work-no-access"
            className="mt-4 max-w-2xl border-l-2 border-border bg-background px-5 py-5"
          >
            <h2 id="work-no-access" className="text-base font-semibold">
              No hay información disponible en esta vista
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              La capacidad de demostración no permite mostrar elementos ni
              confirmar si hay otros pendientes. No se publican conteos ni
              referencias restringidas.
            </p>
            <Link
              href="/inicio"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3"
              )}
            >
              Volver a Inicio
            </Link>
          </section>
        ) : null}

        {!readError && !noAccess && missingContext ? (
          <div
            role="status"
            className="mt-4 border-l-2 border-warning bg-muted/40 px-4 py-3 text-sm"
          >
            <p className="font-medium">
              No encontramos ese contexto dentro de los resultados actuales.
            </p>
            <p className="mt-1 text-muted-foreground">
              Se conservaron tus filtros y no se mostraron datos restringidos.
            </p>
          </div>
        ) : null}

        {!readError && !noAccess ? (
          items.length === 0 ? (
            <section
              aria-labelledby="work-empty-title"
              className="max-w-2xl border-l-2 border-border px-5 py-6"
            >
              <h2 id="work-empty-title" className="text-base font-semibold">
                {filterCount
                  ? "No hay resultados con estos filtros"
                  : "No hay trabajo pendiente en este escenario"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                La bandeja conserva el estado de búsqueda y tipo en la URL. No
                se muestran elementos no autorizados.
              </p>
              {filterCount ? (
                <Link
                  href="/mi-trabajo"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-3"
                  )}
                >
                  Limpiar filtros
                </Link>
              ) : null}
            </section>
          ) : (
            <ul
              className="divide-y divide-border"
              aria-label="Pendientes visibles"
            >
              {items.map((item) => (
                <WorkRow
                  key={item.id}
                  item={item}
                  selected={item.id === selectedId}
                  filters={filters}
                />
              ))}
            </ul>
          )
        ) : null}
      </section>
    </div>
  )
}

function WorkRow({
  item,
  selected,
  filters,
}: {
  item: WorkItem
  selected: boolean
  filters: WorkFilters
}) {
  const contextHref = queryHref(filters, filters.view, item.id)
  const closeHref = queryHref(filters, filters.view)
  const relatedOperation = item.relatedOperationId
    ? demonstrationOperations.find(
        (operation) => operation.id === item.relatedOperationId
      )
    : undefined
  return (
    <li id={item.id} className="py-4">
      <article
        aria-labelledby={`${item.id}-title`}
        className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_14rem] xl:items-start"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 id={`${item.id}-title`} className="text-sm font-semibold">
              {item.title}
            </h2>
            <span className="rounded-sm border border-border px-1.5 py-0.5 text-xs">
              {item.kind}
            </span>
            {item.blocking ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                <ShieldCheck aria-hidden="true" className="size-3.5" />{" "}
                Bloqueante
              </span>
            ) : null}
            {item.timeBand ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  item.timeBand === "Vencido"
                    ? "text-warning"
                    : "text-muted-foreground"
                )}
              >
                <Clock3 aria-hidden="true" className="size-3.5" />{" "}
                {item.timeBand}
              </span>
            ) : null}
            {item.freshness === "Desactualizado" ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                <CircleAlert aria-hidden="true" className="size-3.5" /> Dato
                desactualizado
              </span>
            ) : null}
            {item.freshness === "Parcial" ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <CircleAlert aria-hidden="true" className="size-3.5" />{" "}
                Información parcial
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.origin} <span aria-hidden="true">·</span> {item.reference}
          </p>
          <p className="mt-1 max-w-4xl text-sm leading-5">{item.reason}</p>
          {item.freshness !== "Disponible" ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {item.source}; la fuente no está conectada en esta demostración.
            </p>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm xl:grid-cols-1">
          <div>
            <dt className="text-xs text-muted-foreground">Responsable</dt>
            <dd className="mt-0.5">
              {item.owner ?? "Sin responsable registrado"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Vencimiento</dt>
            <dd className="mt-0.5">
              {item.dueDate ? formatDate(item.dueDate) : "Sin fecha registrada"}
            </dd>
          </div>
        </dl>

        <div className="xl:col-span-2">
          <details
            open={selected}
            className="group rounded-md border border-border bg-muted/20"
          >
            <summary className="min-h-11 cursor-pointer list-none px-3 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 transition-transform group-open:rotate-180"
                />{" "}
                Contexto y próxima acción
              </span>
            </summary>
            <div className="grid gap-4 border-t border-border px-3 py-3 text-sm md:grid-cols-2">
              <div>
                <p className="font-medium">Qué ocurre</p>
                <p className="mt-1 leading-5 text-muted-foreground">
                  {item.activity}
                </p>
                {item.blocking ? (
                  <p className="mt-2 font-medium text-destructive">
                    Bloqueado: requiere revisión por una persona distinta. No se
                    habilita oficialización en este prototipo.
                  </p>
                ) : null}
              </div>
              <div>
                <p className="font-medium">Fuente y actualidad</p>
                <p className="mt-1 leading-5 text-muted-foreground">
                  {item.source}
                  {item.sourceUpdatedAt
                    ? ` · última fecha simulada ${item.sourceUpdatedAt}`
                    : " · fixture local"}
                  .{" "}
                  {item.freshness === "Desactualizado"
                    ? "Dato desactualizado; no confirma el estado actual."
                    : item.freshness === "Parcial"
                      ? "Información parcial; falta evidencia de origen."
                      : "Dato sintético disponible sólo en esta demostración."}
                </p>
                <p className="mt-2 font-medium">Próximo paso</p>
                <p className="mt-1 leading-5 text-muted-foreground">
                  {item.nextStep}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:col-span-2">
                {selected ? (
                  <Link
                    href={closeHref}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" })
                    )}
                  >
                    Cerrar contexto
                  </Link>
                ) : (
                  <Link
                    href={contextHref}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" })
                    )}
                  >
                    Ver contexto
                  </Link>
                )}
                {!relatedOperation ? (
                  item.relatedQuoteId ? (
                    <Link
                      href={`/cotizaciones/${item.relatedQuoteId}?returnTo=${encodeURIComponent(contextHref)}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" })
                      )}
                    >
                      Abrir cotización
                    </Link>
                  ) : item.id === "wrk-admin-no-operation-05" ? (
                    <Link
                      href={`/administracion/finanzas?trabajo=${encodeURIComponent(item.id)}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" })
                      )}
                    >
                      Abrir contexto administrativo
                    </Link>
                  ) : (
                    <span className="self-center text-xs text-muted-foreground">
                      La acción del proceso estará disponible en una etapa
                      posterior.
                    </span>
                  )
                ) : null}
                {relatedOperation ? (
                  <Link
                    href={
                      relatedOperation.kind === "Importación"
                        ? `/operaciones/${relatedOperation.id}/importacion?returnTo=${encodeURIComponent(`/operaciones/${relatedOperation.id}?returnTo=${encodeURIComponent(queryHref(filters, filters.view, item.id))}`)}`
                        : `/operaciones/${relatedOperation.id}/exportacion?returnTo=${encodeURIComponent(`/operaciones/${relatedOperation.id}?returnTo=${encodeURIComponent(queryHref(filters, filters.view, item.id))}`)}`
                    }
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" })
                    )}
                  >
                    {relatedOperation.kind === "Importación"
                      ? "Abrir espacio de Importación"
                      : "Abrir espacio de Exportación"}
                  </Link>
                ) : null}
              </div>
            </div>
          </details>
        </div>
      </article>
    </li>
  )
}
