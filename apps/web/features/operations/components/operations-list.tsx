"use client"

import { useState, useEffect } from "react"
import { useListContext } from "@/components/navigation/list-context"
import { OperationsToolbar } from "./operations-toolbar"
import Link from "next/link"
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Badge } from "@workspace/ui/components/badge"
import {
  createColumnHelper,
  DataTable,
  DataTableFrame,
  dataTableFeatures,
  getDataTableColumnMeta,
} from "@workspace/ui/components/data-table"
import { formatDate } from "@workspace/ui/lib/date"

import {
  filterOperations,
  operationHref,
  parseOperationFilters,
} from "../data/operations"
import type { OperationListFilters, SearchParams } from "../data/operations"
import type { DemonstrationOperation } from "../types/operation"
import { useDemoOperations } from "../state/use-demo-operations"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"

const pageSize = 6
const helper = createColumnHelper<
  typeof dataTableFeatures,
  DemonstrationOperation
>()

function SortLink({
  label,
  field,
  filters,
}: {
  label: string
  field: OperationListFilters["sort"]
  filters: OperationListFilters
}) {
  const active = filters.sort === field
  const direction = active && filters.direction === "asc" ? "desc" : "asc"
  const nextSort = active && filters.direction === "desc" ? "" : field
  const icon = active ? (
    filters.direction === "asc" ? (
      <ArrowUp aria-hidden="true" className="size-3.5" />
    ) : (
      <ArrowDown aria-hidden="true" className="size-3.5" />
    )
  ) : (
    <ArrowDownUp aria-hidden="true" className="size-3.5 opacity-50" />
  )
  return (
    <Link
      scroll={false}
      className="inline-flex min-h-9 w-full items-center gap-1 px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring"
      href={operationHref(filters, { sort: nextSort, direction, page: 1 })}
      aria-label={`Ordenar por ${label}${active ? `, actual ${filters.direction === "asc" ? "ascendente" : "descendente"}` : ""}`}
    >
      {label}
      {icon}
    </Link>
  )
}

const listColumnIds = [
  "reference",
  "kind",
  "client",
  "situation",
  "responsible",
  "updatedOn",
] as const
const listColumnLabels: Record<(typeof listColumnIds)[number], string> = {
  reference: "Referencia",
  kind: "Tipo",
  client: "Cliente",
  situation: "Situación",
  responsible: "Responsable",
  updatedOn: "Actualizada",
}

export function OperationsList({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { scenario } = useScenario()
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    ...listColumnIds,
  ])
  const { operations, ready } = useDemoOperations()
  const [filters, setFilters] = useState(() =>
    parseOperationFilters(searchParams)
  )
  const queryKey = JSON.stringify(searchParams)
  const [previousQueryKey, setPreviousQueryKey] = useState(queryKey)
  if (previousQueryKey !== queryKey) {
    setPreviousQueryKey(queryKey)
    setFilters(parseOperationFilters(searchParams))
  }
  useEffect(() => {
    const restore = () =>
      setFilters(
        parseOperationFilters(
          Object.fromEntries(new URLSearchParams(window.location.search))
        )
      )
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [])
  const captureContext = useListContext(ready, operationHref(filters))
  const change = (patch: Partial<OperationListFilters>) => {
    const next = { ...filters, ...patch }
    window.history.pushState(null, "", operationHref(next))
    setFilters(next)
  }
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const allFiltered = filterOperations(operations, filters)
  const pages = Math.max(1, Math.ceil(allFiltered.length / pageSize))
  const page = Math.min(filters.page, pages)
  const pageItems = allFiltered.slice((page - 1) * pageSize, page * pageSize)
  const failed = filters.error === "lectura"
  const restricted = filters.error === "sin-permiso"
  if (!ready) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )
  }
  const groups: string[] = filters.group
    ? [
        ...new Set(
          pageItems.map(
            (item) =>
              item[filters.group as "kind" | "situation" | "responsible"]
          )
        ),
      ]
    : [""]
  const allColumns = helper.columns([
    helper.accessor("reference", {
      id: "reference",
      header: () => (
        <SortLink label="Referencia" field="reference" filters={filters} />
      ),
      cell: (info) => (
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href={`/operaciones/${info.row.original.id}?returnTo=${encodeURIComponent(operationHref(filters))}`}
        >
          {info.getValue()}
        </Link>
      ),
      ...getDataTableColumnMeta("reference"),
    }),
    helper.accessor("kind", {
      id: "kind",
      header: () => <SortLink label="Tipo" field="kind" filters={filters} />,
      cell: (info) => info.getValue(),
      ...getDataTableColumnMeta("compact", { priority: "medium" }),
    }),
    helper.accessor("client", {
      id: "client",
      header: () => (
        <SortLink label="Cliente" field="client" filters={filters} />
      ),
      cell: (info) => info.getValue(),
      ...getDataTableColumnMeta("flexible", { priority: "high" }),
    }),
    helper.accessor("situation", {
      id: "situation",
      header: () => (
        <SortLink label="Situación" field="situation" filters={filters} />
      ),
      cell: (info) => (
        <Badge
          variant={
            info.getValue() === "Requiere atención"
              ? "destructive"
              : info.getValue() === "Pendiente documental"
                ? "warning"
                : "secondary"
          }
        >
          {info.getValue()}
        </Badge>
      ),
      ...getDataTableColumnMeta("status"),
    }),
    helper.accessor("responsible", {
      id: "responsible",
      header: () => (
        <SortLink label="Responsable" field="responsible" filters={filters} />
      ),
      cell: (info) => info.getValue(),
      ...getDataTableColumnMeta("flexible", { priority: "medium" }),
    }),
    helper.accessor("updatedOn", {
      id: "updatedOn",
      header: () => (
        <SortLink label="Actualizada" field="updatedOn" filters={filters} />
      ),
      cell: (info) => formatDate(info.getValue()),
      ...getDataTableColumnMeta("date", { priority: "high" }),
    }),
  ])
  const visibleTableColumns = allColumns.filter(
    (column) =>
      column.id === "reference" ||
      (column.id !== undefined &&
        visibleColumns.includes(column.id) &&
        !(column.id === "kind" && filters.kind))
  )

  return (
    <div className="space-y-4" onClickCapture={captureContext}>
      <PageHeader
        title={
          filters.kind === "importacion"
            ? "Importaciones"
            : filters.kind === "exportacion"
              ? "Exportaciones"
              : "Operaciones"
        }
        primaryAction={
          hasCapability(scenario, "operations.write") ? (
            <Link
              href="/operaciones/nueva"
              className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Nueva operación
            </Link>
          ) : undefined
        }
      />

      <OperationsToolbar filters={filters} change={change} />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p role="status">
          {failed || restricted
            ? "No se confirma el total mientras la fuente no esté disponible."
            : `${allFiltered.length} operaciones`}
        </p>
        <label className="flex items-center gap-2 text-xs">
          Agrupar por
          <select
            name="agrupar"
            value={filters.group}
            onChange={(event) =>
              change({
                group: event.target.value as OperationListFilters["group"],
                page: 1,
              })
            }
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="">Sin agrupación</option>
            <option value="kind">Tipo</option>
            <option value="situation">Situación</option>
            <option value="responsible">Responsable</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setVisibleColumns([...listColumnIds])
            setColumnWidths({})
            change({ sort: "updatedOn", direction: "desc", group: "", page: 1 })
          }}
          className="min-h-9 text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          Restablecer vista
        </button>
        <details className="relative hidden lg:block">
          <summary className="min-h-9 cursor-pointer rounded-md border border-border px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring">
            Columnas visibles
          </summary>
          <fieldset className="absolute right-0 z-10 mt-1 grid min-w-52 gap-2 border border-border bg-background p-3 shadow-sm">
            <legend className="px-1 text-xs font-medium">
              Mostrar columnas
            </legend>
            {listColumnIds
              .filter((id) => id !== "reference")
              .map((id) => (
                <label
                  key={id}
                  className="flex min-h-8 items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(id)}
                    onChange={(event) =>
                      setVisibleColumns((current) =>
                        event.target.checked
                          ? [...current, id]
                          : current.filter((column) => column !== id)
                      )
                    }
                  />
                  {listColumnLabels[id]}
                </label>
              ))}
          </fieldset>
        </details>
      </div>
      {!restricted && !failed && (
        <div
          aria-label="Accesos por situación"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {(
            [
              ["Requiere atención", "Atención"],
              ["Pendiente documental", "Documentación pendiente"],
              ["Lista para revisión", "Listas para revisión"],
            ] as const
          ).map(([situation, label]) => (
            <button
              key={situation}
              type="button"
              aria-pressed={filters.situation === situation}
              onClick={() =>
                change({
                  situation: filters.situation === situation ? "" : situation,
                  page: 1,
                })
              }
              className={`min-h-9 shrink-0 rounded-md border px-3 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring ${filters.situation === situation ? "border-primary bg-accent text-primary" : "border-input bg-card"}`}
            >
              {label}{" "}
              <span className="ml-2 font-mono">
                {
                  filterOperations(operations, {
                    ...filters,
                    situation,
                    page: 1,
                  }).length
                }
              </span>
            </button>
          ))}
        </div>
      )}

      {failed && (
        <section
          role="alert"
          className="border-l-2 border-destructive px-4 py-4"
        >
          <h2 className="font-semibold">No se pudieron leer las operaciones</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Conservamos filtros y contexto. La fuente local no confirma un
            total.
          </p>
          <Link
            scroll={false}
            className="mt-2 inline-block text-sm underline"
            href={operationHref(filters, { error: "" })}
          >
            Reintentar
          </Link>
        </section>
      )}
      {restricted && (
        <section role="status" className="border-l-2 border-border px-4 py-4">
          <h2 className="font-semibold">Vista no disponible</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Este estado no confirma la existencia de registros ni publica
            conteos.
          </p>
          <Link className="mt-2 inline-block text-sm underline" href="/inicio">
            Volver a Inicio
          </Link>
        </section>
      )}

      {!failed && !restricted && allFiltered.length === 0 ? (
        <section className="border-l-2 border-border px-4 py-6">
          <h2 className="font-semibold">
            {filters.q ||
            filters.kind ||
            filters.situation ||
            filters.responsible ||
            filters.from ||
            filters.to
              ? "No hay operaciones con estos filtros"
              : "No hay operaciones en este escenario"}
          </h2>

          <Link
            scroll={false}
            className="mt-2 inline-block text-sm underline"
            href={operationHref({
              ...parseOperationFilters({}),
              kind: filters.kind,
            })}
          >
            Limpiar filtros
          </Link>
        </section>
      ) : null}

      {!failed && !restricted && allFiltered.length > 0 && (
        <>
          <div className="hidden lg:block">
            {groups.map((group) => {
              const groupItems = group
                ? pageItems.filter(
                    (item) =>
                      item[
                        filters.group as "kind" | "situation" | "responsible"
                      ] === group
                  )
                : pageItems
              return (
                <section key={group || "all"} className="mb-4">
                  {group && (
                    <h2 className="border-b border-border py-2 text-sm font-semibold">
                      {group}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {groupItems.length} en esta página
                      </span>
                    </h2>
                  )}
                  <DataTableFrame className="rounded-md">
                    <DataTable
                      caption={
                        group
                          ? `Operaciones — ${group}, página ${page}`
                          : "Operaciones"
                      }
                      columns={visibleTableColumns}
                      data={groupItems}
                      columnWidths={columnWidths}
                      getColumnLabel={(id) =>
                        listColumnLabels[
                          id as (typeof listColumnIds)[number]
                        ] ?? id
                      }
                      onColumnWidthChange={(id, width) =>
                        setColumnWidths((current) => ({
                          ...current,
                          [id]: width,
                        }))
                      }
                      getRowId={(item) => item.id}
                      getHeaderAriaSort={(columnId) =>
                        columnId === filters.sort
                          ? filters.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : undefined
                      }
                    />
                  </DataTableFrame>
                </section>
              )
            })}
          </div>
          <div className="lg:hidden">
            {groups.map((group) => {
              const groupItems = group
                ? pageItems.filter(
                    (item) =>
                      item[
                        filters.group as "kind" | "situation" | "responsible"
                      ] === group
                  )
                : pageItems
              return (
                <section key={group || "all"}>
                  {group && (
                    <h2 className="border-b border-border py-2 text-sm font-semibold">
                      {group}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {groupItems.length} en esta página
                      </span>
                    </h2>
                  )}
                  <ul
                    className="divide-y divide-border border-y border-border"
                    aria-label={group ? `Operaciones: ${group}` : "Operaciones"}
                  >
                    {groupItems.map((item) => (
                      <li key={item.id} className="py-3">
                        <article className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Link
                                className="font-medium text-primary underline-offset-4 hover:underline"
                                href={`/operaciones/${item.id}?returnTo=${encodeURIComponent(operationHref(filters))}`}
                              >
                                {item.reference}
                              </Link>
                            </div>
                            <Badge
                              variant={
                                item.situation === "Requiere atención"
                                  ? "destructive"
                                  : item.situation === "Pendiente documental"
                                    ? "warning"
                                    : "secondary"
                              }
                            >
                              {item.situation}
                            </Badge>
                          </div>
                          <p className="text-sm">
                            {item.client} · {item.kind}
                          </p>
                          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                            <div>
                              <dt className="text-muted-foreground">
                                Responsable
                              </dt>
                              <dd>{item.responsible}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Modalidad
                              </dt>
                              <dd>{item.modality}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Actualizada
                              </dt>
                              <dd>{formatDate(item.updatedOn)}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Alerta</dt>
                              <dd>{item.alert}</dd>
                            </div>
                          </dl>
                          <p className="text-xs text-muted-foreground">
                            Próximo paso de referencia: {item.nextAction}
                          </p>
                        </article>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
          <nav
            aria-label="Paginación de operaciones"
            className="flex items-center justify-between border-t border-border pt-3 text-sm"
          >
            <p>
              Página {page} de {pages} · {allFiltered.length} resultados
            </p>
            <div className="flex gap-2">
              <Link
                scroll={false}
                aria-disabled={page <= 1}
                className={`rounded-md border border-border px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                href={operationHref(filters, { page: Math.max(1, page - 1) })}
              >
                Anterior
              </Link>
              <Link
                scroll={false}
                aria-disabled={page >= pages}
                className={`rounded-md border border-border px-3 py-2 ${page >= pages ? "pointer-events-none opacity-50" : ""}`}
                href={operationHref(filters, {
                  page: Math.min(pages, page + 1),
                })}
              >
                Siguiente
              </Link>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
