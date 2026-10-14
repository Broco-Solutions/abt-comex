"use client"

import { useState } from "react"
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

const pageSize = 6
const helper = createColumnHelper<
  typeof dataTableFeatures,
  DemonstrationOperation
>()

const situations = [
  "Pre-embarque",
  "En seguimiento",
  "Requiere atención",
  "Pendiente documental",
  "Lista para revisión",
]
const teams = [
  "Equipo Impo A",
  "Equipo Impo B",
  "Equipo Expo A",
  "Equipo Expo B",
]

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
  const icon = active ? (
    direction === "asc" ? (
      <ArrowUp aria-hidden="true" className="size-3.5" />
    ) : (
      <ArrowDown aria-hidden="true" className="size-3.5" />
    )
  ) : (
    <ArrowDownUp aria-hidden="true" className="size-3.5 opacity-50" />
  )
  return (
    <Link
      className="inline-flex min-h-9 items-center gap-1 px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring"
      href={operationHref(filters, { sort: field, direction, page: 1 })}
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

function hiddenFilterInputs(filters: OperationListFilters) {
  return (
    <>
      {filters.q && <input type="hidden" name="q" value={filters.q} />}
      {filters.kind && <input type="hidden" name="tipo" value={filters.kind} />}
      {filters.situation && (
        <input type="hidden" name="situacion" value={filters.situation} />
      )}
      {filters.responsible && (
        <input type="hidden" name="responsable" value={filters.responsible} />
      )}
      {filters.from && (
        <input type="hidden" name="desde" value={filters.from} />
      )}
      {filters.to && <input type="hidden" name="hasta" value={filters.to} />}
    </>
  )
}

export function OperationsList({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    ...listColumnIds,
  ])
  const { operations, ready } = useDemoOperations()
  const filters = parseOperationFilters(searchParams)
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
    helper.display({
      id: "select",
      header: () => <span className="sr-only">Seleccionar</span>,
      cell: (info) => (
        <input
          aria-label={`Seleccionar ${info.row.original.reference}`}
          type="checkbox"
          checked={selectedIds.includes(info.row.original.id)}
          onChange={(event) =>
            setSelectedIds((current) =>
              event.target.checked
                ? [...new Set([...current, info.row.original.id])]
                : current.filter((id) => id !== info.row.original.id)
            )
          }
          className="size-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      ),
      ...getDataTableColumnMeta("selection"),
    }),
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
      column.id === "select" ||
      (column.id !== undefined && visibleColumns.includes(column.id))
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title={
          filters.kind === "importacion"
            ? "Importaciones"
            : filters.kind === "exportacion"
              ? "Exportaciones"
              : "Operaciones"
        }
        description="Buscá y seguí operaciones con su situación, equipo responsable y próxima referencia de trabajo."
        primaryAction={
          <Link
            href="/operaciones/nueva"
            className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Nueva operación
          </Link>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border py-3 text-sm">
        <p>
          {failed || restricted ? (
            "No se confirma el total mientras la fuente no esté disponible."
          ) : (
            <>
              <span className="font-medium">{allFiltered.length}</span>{" "}
              operaciones visibles en este escenario ficticio
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          Datos locales de demostración · sin conexión a Alpha2000
        </p>
      </div>

      {!restricted && !failed ? (
        <div
          className="grid gap-2 border-b border-border pb-4 sm:grid-cols-3"
          aria-label="Accesos por situación"
        >
          {(
            [
              ["Requiere atención", "Atención"],
              ["Pendiente documental", "Documentación pendiente"],
              ["Lista para revisión", "Listas para revisión"],
            ] as const
          ).map(([situation, label]) => {
            const count = filterOperations(operations, {
              ...filters,
              situation,
              page: 1,
            }).length
            return (
              <Link
                key={situation}
                className={`flex min-h-11 items-center justify-between rounded-md border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${filters.situation === situation ? "border-primary bg-primary/10 text-primary" : "border-input bg-background"}`}
                href={operationHref(filters, {
                  situation: filters.situation === situation ? "" : situation,
                  page: 1,
                })}
                aria-current={
                  filters.situation === situation ? "page" : undefined
                }
              >
                <span>{label}</span>
                <span className="font-mono text-muted-foreground">{count}</span>
              </Link>
            )
          })}
        </div>
      ) : null}

      <form
        action="/operaciones"
        method="get"
        className="grid gap-3 border-b border-border pb-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <label className="grid gap-1 text-xs font-medium">
          Buscar referencia, cliente, responsable o próxima acción
          <input
            name="q"
            defaultValue={filters.q}
            type="search"
            placeholder="Ej.: OP-DEM-2048"
            className="h-9 min-w-0 rounded-md border border-input bg-background px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-ring"
          />
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Tipo
          <select
            name="tipo"
            defaultValue={filters.kind}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm font-normal"
          >
            <option value="">Todos</option>
            <option value="importacion">Importación</option>
            <option value="exportacion">Exportación</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Situación
          <select
            name="situacion"
            defaultValue={filters.situation}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm font-normal"
          >
            <option value="">Todas</option>
            {situations.map((situation) => (
              <option key={situation}>{situation}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Responsable
          <select
            name="responsable"
            defaultValue={filters.responsible}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm font-normal"
          >
            <option value="">Todos</option>
            {teams.map((team) => (
              <option key={team}>{team}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Actualizada desde
          <input
            name="desde"
            type="date"
            defaultValue={filters.from}
            className="h-9 min-w-0 rounded-md border border-input bg-background px-2 text-sm font-normal"
          />
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Actualizada hasta
          <input
            name="hasta"
            type="date"
            defaultValue={filters.to}
            className="h-9 min-w-0 rounded-md border border-input bg-background px-2 text-sm font-normal"
          />
        </label>
        <div className="flex items-end gap-2">
          <button
            className="h-9 rounded-md bg-primary px-3 text-sm text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            type="submit"
          >
            Aplicar
          </button>
          <Link
            className="inline-flex h-9 items-center px-3 text-sm underline-offset-4 hover:underline"
            href="/operaciones"
          >
            Limpiar filtros
          </Link>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Los valores aduaneros y los datos económicos no se muestran en este
          listado. La situación presentada es vocabulario sintético, pendiente
          de validación funcional.
        </p>
        <form
          action="/operaciones"
          method="get"
          className="flex items-center gap-2 text-xs"
        >
          {hiddenFilterInputs(filters)}
          <input type="hidden" name="orden" value={filters.sort} />
          <input type="hidden" name="direccion" value={filters.direction} />
          <label htmlFor="operations-group">Agrupar por</label>
          <select
            id="operations-group"
            name="agrupar"
            defaultValue={filters.group}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="">Sin agrupación</option>
            <option value="kind">Tipo</option>
            <option value="situation">Situación</option>
            <option value="responsible">Responsable</option>
          </select>
          <button className="h-9 rounded-md border border-border px-3 text-sm">
            Aplicar
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <span aria-live="polite">
            {selectedIds.length} seleccionadas en esta sesión
          </span>
          {selectedIds.length > 0 && (
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={() => setSelectedIds([])}
            >
              Limpiar selección
            </button>
          )}
        </div>
        <details className="relative hidden lg:block">
          <summary className="min-h-9 cursor-pointer rounded-md border border-border px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring">
            Columnas visibles
          </summary>
          <fieldset className="absolute right-0 z-10 mt-1 grid min-w-52 gap-2 border border-border bg-background p-3 shadow-sm">
            <legend className="px-1 text-xs font-medium">
              Mostrar columnas
            </legend>
            {listColumnIds.map((id) => (
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
          <p className="mt-1 text-sm text-muted-foreground">
            La búsqueda sólo consulta registros sintéticos visibles en esta
            demostración.
          </p>
          <Link
            className="mt-2 inline-block text-sm underline"
            href="/operaciones"
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
                      columns={visibleTableColumns}
                      data={groupItems}
                      getRowId={(item) => item.id}
                      getRowAriaSelected={(item) =>
                        selectedIds.includes(item.id)
                      }
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
                              <input
                                aria-label={`Seleccionar ${item.reference}`}
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={(event) =>
                                  setSelectedIds((current) =>
                                    event.target.checked
                                      ? [...new Set([...current, item.id])]
                                      : current.filter((id) => id !== item.id)
                                  )
                                }
                                className="size-4 accent-primary"
                              />
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
                aria-disabled={page <= 1}
                className={`rounded-md border border-border px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                href={operationHref(filters, { page: Math.max(1, page - 1) })}
              >
                Anterior
              </Link>
              <Link
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
