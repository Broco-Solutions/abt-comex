"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  DateRangePicker,
  type DatePeriodPreset,
  type DateRangeValue,
} from "@workspace/ui/components/date-range-picker"
import { Input } from "@workspace/ui/components/input"
import { formatDate, formatMonth, toIsoDate } from "@workspace/ui/lib/date"

import {
  operationOwners,
  operations,
  type Operation,
  type OperationStatus,
} from "./operations-data"

const statuses: OperationStatus[] = [
  "En curso",
  "Pendiente",
  "Requiere atención",
  "Completado",
]

const statusTone: Record<
  OperationStatus,
  "info" | "warning" | "destructive" | "success"
> = {
  "En curso": "info",
  Pendiente: "warning",
  "Requiere atención": "destructive",
  Completado: "success",
}

type GroupField =
  | "status"
  | "client"
  | "counterpart"
  | "owner"
  | "type"
  | "country"
  | "month"
type GroupOption = {
  id: GroupField
  label: string
  getValue: (operation: Operation) => string
}

// Cada listado declara sólo los campos que su contexto permite agrupar.
const groupableFields: GroupOption[] = [
  { id: "status", label: "Estado", getValue: (operation) => operation.status },
  { id: "client", label: "Cliente", getValue: (operation) => operation.client },
  {
    id: "counterpart",
    label: "Proveedor",
    getValue: (operation) => operation.counterpart,
  },
  {
    id: "owner",
    label: "Responsable",
    getValue: (operation) => operation.owner,
  },
  { id: "type", label: "Tipo", getValue: (operation) => operation.type },
  {
    id: "country",
    label: "País",
    getValue: (operation) => operation.route.split(" → ")[0] ?? "",
  },
  {
    id: "month",
    label: "Mes",
    getValue: (operation) => formatMonth(operation.relevantDate),
  },
]

const columnDefinitions = [
  { id: "type", label: "Tipo", priority: "secondary" },
  { id: "counterpart", label: "Proveedor / destino", priority: "secondary" },
  { id: "route", label: "Origen / destino", priority: "secondary" },
  { id: "owner", label: "Responsable", priority: "secondary" },
  { id: "date", label: "ETA / fecha", priority: "essential" },
  { id: "currency", label: "Moneda", priority: "secondary" },
  { id: "amount", label: "Importe", priority: "essential" },
  { id: "documents", label: "Docs. pendientes", priority: "secondary" },
] as const

type OptionalColumn = (typeof columnDefinitions)[number]["id"]

function money(amount: number, currency: Operation["currency"]) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function totalByCurrency(items: Operation[]) {
  return (["USD", "EUR"] as const)
    .map((currency) => ({
      currency,
      total: items
        .filter((item) => item.currency === currency)
        .reduce((sum, item) => sum + item.amount, 0),
    }))
    .filter((item) => item.total > 0)
    .map((item) => money(item.total, item.currency))
    .join(" · ")
}

function StatusLabel({ status }: { status: OperationStatus }) {
  return <Badge variant={statusTone[status]}>{status}</Badge>
}

function dayRange(preset: DatePeriodPreset): DateRangeValue {
  const today = new Date(2026, 8, 28, 12)
  const start = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
  if (preset === "today") return { from: today, to: today }
  if (preset === "last-7") return { from: new Date(2026, 8, 22, 12), to: today }
  if (preset === "last-30")
    return { from: new Date(2026, 7, 30, 12), to: today }
  if (preset === "this-month")
    return { from: new Date(2026, 8, 1, 12), to: today }
  if (preset === "previous-month")
    return { from: new Date(2026, 7, 1, 12), to: new Date(2026, 7, 31, 12) }
  return { from: start(today), to: start(today) }
}

function isWithinPeriod(
  operation: Operation,
  period: DateRangeValue | undefined
) {
  if (!period?.from) return true
  const date = operation.relevantDate
  const from = toIsoDate(period.from)
  const to = period.to ? toIsoDate(period.to) : from
  return date >= from && date <= to
}

function Metric({
  label,
  value,
  description,
  tone,
}: {
  label: string
  value: string | number
  description: string
  tone?: "attention"
}) {
  return (
    <div className="border-l border-border px-4 first:border-l-0 first:pl-0 sm:px-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-mono text-2xl font-medium tabular-nums ${tone === "attention" ? "text-destructive" : ""}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export function OperationsWorkspace() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [owner, setOwner] = React.useState("")
  const [type, setType] = React.useState("")
  const [preset, setPreset] = React.useState<DatePeriodPreset | "">("")
  const [period, setPeriod] = React.useState<DateRangeValue>()
  const [groupBy, setGroupBy] = React.useState<GroupField | "">("")
  const [sort, setSort] = React.useState<"date" | "amount" | "reference">(
    "date"
  )
  const [sortDescending, setSortDescending] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState<OptionalColumn[]>([
    "type",
    "counterpart",
    "route",
    "owner",
    "date",
    "currency",
    "amount",
    "documents",
  ])

  const filtered = React.useMemo(
    () =>
      operations.filter((operation) => {
        const normalizedSearch = search.trim().toLocaleLowerCase("es-AR")
        const matchesSearch =
          !normalizedSearch ||
          [
            operation.reference,
            operation.client,
            operation.counterpart,
            operation.route,
          ].some((value) =>
            value.toLocaleLowerCase("es-AR").includes(normalizedSearch)
          )
        return (
          matchesSearch &&
          (!status || operation.status === status) &&
          (!owner || operation.owner === owner) &&
          (!type || operation.type === type) &&
          isWithinPeriod(operation, period)
        )
      }),
    [search, status, owner, type, period]
  )

  const sorted = React.useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const value =
          sort === "date"
            ? a.relevantDate.localeCompare(b.relevantDate)
            : sort === "amount"
              ? a.amount - b.amount
              : a.reference.localeCompare(b.reference)
        return sortDescending ? -value : value
      }),
    [filtered, sort, sortDescending]
  )

  const groups = React.useMemo(() => {
    if (!groupBy) return []
    const field = groupableFields.find((option) => option.id === groupBy)
    if (!field) return []
    return groupOperations(sorted, field.getValue)
  }, [groupBy, sorted])

  const perPage = 8
  const pageItems = sorted.slice(page * perPage, (page + 1) * perPage)
  const activeFilterCount = [search, status, owner, type, period?.from].filter(
    Boolean
  ).length
  const applyPreset = (nextPreset: DatePeriodPreset) => {
    setPreset(nextPreset)
    setPeriod(nextPreset === "custom" ? undefined : dayRange(nextPreset))
    setPage(0)
  }
  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setOwner("")
    setType("")
    setPreset("")
    setPeriod(undefined)
    setPage(0)
  }
  const toggleSort = (next: typeof sort) => {
    if (sort === next) setSortDescending((value) => !value)
    else {
      setSort(next)
      setSortDescending(false)
    }
  }

  return (
    <div className="py-8 sm:py-10">
      <section
        aria-labelledby="kpis-title"
        className="border-y border-border py-5"
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="kpis-title" className="text-sm font-semibold">
              Indicadores operativos
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Cartera de referencia al 28/09/2026.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {filtered.length} resultados
          </span>
        </div>
        <div className="grid gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Operaciones activas"
            value={
              filtered.filter((item) => item.status !== "Completado").length
            }
            description="En curso, pendientes o revisión"
          />
          <Metric
            label="Requieren atención"
            value={
              filtered.filter((item) => item.status === "Requiere atención")
                .length
            }
            description="Documentación o hito a resolver"
            tone="attention"
          />
          <Metric
            label="Arribos próximos"
            value={
              filtered.filter(
                (item) =>
                  item.relevantDate >= "2026-09-28" &&
                  item.relevantDate <= "2026-10-12"
              ).length
            }
            description="Próximos 14 días"
          />
          <Metric
            label="Importe filtrado"
            value={totalByCurrency(filtered) || "—"}
            description="Separado por moneda"
          />
        </div>
      </section>

      <section
        id="tablas-datos"
        aria-labelledby="operations-title"
        className="mt-8"
      >
        <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="operations-title"
              className="text-lg font-semibold tracking-tight"
            >
              Tablas y datos
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Filtros combinables, prioridades de columna y agrupación
              configurable.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Sin scroll horizontal como patrón principal.
          </p>
        </div>

        <div className="mt-4 border border-border bg-card p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Buscar operaciones</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground"
              />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(0)
                }}
                className="pl-9"
                placeholder="Buscar referencia, cliente, proveedor o ruta"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">
                Agrupar por
                <select
                  value={groupBy}
                  onChange={(event) => {
                    setGroupBy(event.target.value as GroupField | "")
                    setPage(0)
                  }}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm font-normal text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                >
                  <option value="">Sin agrupación</option>
                  {groupableFields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="relative self-end">
                <Button
                  variant="outline"
                  size="sm"
                  aria-expanded={columnsOpen}
                  onClick={() => setColumnsOpen((open) => !open)}
                >
                  <Columns3 aria-hidden="true" />
                  Columnas
                </Button>
                {columnsOpen ? (
                  <div className="absolute right-0 z-20 mt-2 w-60 rounded-md border border-border bg-popover p-2 shadow-md">
                    <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Campos secundarios
                    </p>
                    {columnDefinitions.map((column) => (
                      <label
                        key={column.id}
                        className="flex min-h-8 items-center gap-2 rounded px-2 text-sm hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.id)}
                          onChange={() =>
                            setVisibleColumns((current) =>
                              current.includes(column.id)
                                ? current.filter((id) => id !== column.id)
                                : [...current, column.id]
                            )
                          }
                          className="size-4 accent-primary"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              label="Tipo"
              value={type}
              onChange={(value) => {
                setType(value)
                setPage(0)
              }}
              options={["Importación", "Exportación"]}
            />
            <FilterSelect
              label="Estado"
              value={status}
              onChange={(value) => {
                setStatus(value)
                setPage(0)
              }}
              options={statuses}
            />
            <FilterSelect
              label="Responsable"
              value={owner}
              onChange={(value) => {
                setOwner(value)
                setPage(0)
              }}
              options={operationOwners}
            />
            <label className="grid gap-1 text-xs font-medium text-muted-foreground">
              Período
              <select
                value={preset}
                onChange={(event) =>
                  applyPreset(event.target.value as DatePeriodPreset)
                }
                className="h-9 rounded-md border border-input bg-background px-2 text-sm font-normal text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <option value="">Todos</option>
                <option value="today">Hoy</option>
                <option value="last-7">Últimos 7 días</option>
                <option value="last-30">Últimos 30 días</option>
                <option value="this-month">Este mes</option>
                <option value="previous-month">Mes anterior</option>
                <option value="custom">Personalizado</option>
              </select>
            </label>
            <div className="grid gap-1 text-xs font-medium text-muted-foreground">
              <span>Desde / Hasta</span>
              <DateRangePicker
                value={period ?? {}}
                onChange={(range) => {
                  setPreset("custom")
                  setPeriod(range)
                  setPage(0)
                }}
              />
            </div>
          </div>

          {activeFilterCount ? (
            <div
              className="mt-3 flex flex-wrap items-center gap-2"
              aria-label="Filtros activos"
            >
              <span className="text-xs text-muted-foreground">
                Filtros activos:
              </span>
              {search ? (
                <Badge variant="outline">Búsqueda: {search}</Badge>
              ) : null}
              {status ? (
                <Badge variant="outline">Estado: {status}</Badge>
              ) : null}
              {owner ? (
                <Badge variant="outline">Responsable: {owner}</Badge>
              ) : null}
              {type ? <Badge variant="outline">Tipo: {type}</Badge> : null}
              {period?.from ? (
                <Badge variant="outline">Período aplicado</Badge>
              ) : null}
              <Button variant="ghost" size="xs" onClick={clearFilters}>
                <X aria-hidden="true" />
                Limpiar todos
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p>
            <strong>{filtered.length}</strong> de {operations.length}{" "}
            operaciones
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="text-xs text-muted-foreground">Ordenar:</span>
            {(["date", "amount", "reference"] as const).map((option) => (
              <Button
                key={option}
                variant={sort === option ? "secondary" : "ghost"}
                size="xs"
                onClick={() => toggleSort(option)}
              >
                {option === "date"
                  ? "Fecha"
                  : option === "amount"
                    ? "Importe"
                    : "Referencia"}
                {sort === option ? (sortDescending ? " ↓" : " ↑") : null}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyFiltered onClear={clearFilters} />
        ) : groupBy ? (
          <GroupedRows groups={groups} visibleColumns={visibleColumns} />
        ) : (
          <>
            <OperationList items={pageItems} visibleColumns={visibleColumns} />
            <Pagination
              page={page}
              pageCount={Math.ceil(sorted.length / perPage)}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <ChartsSection data={filtered} />
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
}) {
  return (
    <label className="grid gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm font-normal text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function groupOperations(
  items: Operation[],
  getKey: (operation: Operation) => string
) {
  const grouped = new Map<string, Operation[]>()
  for (const item of items) {
    const key = getKey(item)
    grouped.set(key, [...(grouped.get(key) ?? []), item])
  }
  return [...grouped].map(([label, groupedItems]) => ({
    label,
    items: groupedItems,
  }))
}

function GroupedRows({
  groups,
  visibleColumns,
}: {
  groups: { label: string; items: Operation[] }[]
  visibleColumns: OptionalColumn[]
}) {
  return (
    <div className="mt-3 space-y-3">
      {groups.map((group) => (
        <details key={group.label} open className="border border-border">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 bg-muted/60 px-3 text-sm focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            <ChevronDown
              aria-hidden="true"
              className="size-4 transition-transform [[open]_&]:rotate-180"
            />
            <span className="font-medium">{group.label}</span>
            <span className="text-xs text-muted-foreground">
              {group.items.length} operaciones
            </span>
            <span className="ml-auto font-mono text-xs tabular-nums">
              Subtotal: {totalByCurrency(group.items)}
            </span>
          </summary>
          <OperationList
            items={group.items}
            visibleColumns={visibleColumns}
            grouped
          />
        </details>
      ))}
    </div>
  )
}

function OperationList({
  items,
  visibleColumns,
  grouped = false,
}: {
  items: Operation[]
  visibleColumns: OptionalColumn[]
  grouped?: boolean
}) {
  const column = (id: OptionalColumn) => visibleColumns.includes(id)
  return (
    <>
      <div
        className={`${grouped ? "" : "mt-3"} hidden overflow-hidden md:block`}
      >
        <table className="w-full table-fixed text-left text-xs">
          <thead className="bg-muted">
            <tr>
              <th className="w-30 px-3 py-2 font-medium">Referencia</th>
              <th className="px-3 py-2 font-medium">Cliente</th>
              {column("type") ? (
                <th className="hidden px-3 py-2 font-medium lg:table-cell">
                  Tipo
                </th>
              ) : null}
              {column("counterpart") ? (
                <th className="hidden px-3 py-2 font-medium xl:table-cell">
                  Proveedor / destino
                </th>
              ) : null}
              <th className="w-34 px-3 py-2 font-medium">Estado</th>
              {column("owner") ? (
                <th className="hidden px-3 py-2 font-medium xl:table-cell">
                  Responsable
                </th>
              ) : null}
              {column("date") ? (
                <th className="hidden w-28 px-3 py-2 font-medium lg:table-cell">
                  ETA / fecha
                </th>
              ) : null}
              {column("amount") ? (
                <th className="w-28 px-3 py-2 text-right font-medium">
                  Importe
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {items.map((operation) => (
              <tr
                key={operation.id}
                className="border-t border-border align-middle hover:bg-muted/40"
              >
                <td className="px-3 py-2.5 font-mono font-medium tabular-nums">
                  {operation.reference}
                </td>
                <td className="px-3 py-2.5 font-medium">{operation.client}</td>
                {column("type") ? (
                  <td className="hidden px-3 py-2.5 lg:table-cell">
                    {operation.type}
                  </td>
                ) : null}
                {column("counterpart") ? (
                  <td className="hidden px-3 py-2.5 text-muted-foreground xl:table-cell">
                    {operation.counterpart}
                  </td>
                ) : null}
                <td className="px-3 py-2.5">
                  <StatusLabel status={operation.status} />
                </td>
                {column("owner") ? (
                  <td className="hidden px-3 py-2.5 xl:table-cell">
                    {operation.owner}
                  </td>
                ) : null}
                {column("date") ? (
                  <td className="hidden px-3 py-2.5 font-mono tabular-nums lg:table-cell">
                    {formatDate(operation.relevantDate)}
                  </td>
                ) : null}
                {column("amount") ? (
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                    {money(operation.amount, operation.currency)}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={`${grouped ? "" : "mt-3"} divide-y divide-border border-y border-border md:hidden`}
      >
        {items.map((operation) => (
          <details key={operation.id} className="group">
            <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-3 py-2 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs font-medium">
                  {operation.reference}
                </span>
                <span className="mt-1 block truncate text-sm font-medium">
                  {operation.client}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {formatDate(operation.relevantDate)} ·{" "}
                  {money(operation.amount, operation.currency)}
                </span>
              </span>
              <span className="flex flex-col items-end gap-2">
                <StatusLabel status={operation.status} />
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </span>
            </summary>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border bg-muted/30 px-3 py-3 text-xs">
              <Detail label="Tipo" value={operation.type} />
              <Detail
                label="Proveedor / destino"
                value={operation.counterpart}
              />
              <Detail label="Origen / destino" value={operation.route} />
              <Detail label="Responsable" value={operation.owner} />
              <Detail
                label="Documentos pendientes"
                value={
                  operation.documentsPending
                    ? String(operation.documentsPending)
                    : "Sin pendientes"
                }
              />
            </div>
          </details>
        ))}
      </div>
    </>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  )
}

function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number
  pageCount: number
  onPageChange: (next: number) => void
}) {
  return (
    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
      <span className="text-xs text-muted-foreground">
        Página {page + 1} de {pageCount}
      </span>
      <div className="flex gap-2">
        <Button
          size="icon-sm"
          variant="outline"
          disabled={page === 0}
          aria-label="Página anterior"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          size="icon-sm"
          variant="outline"
          disabled={page >= pageCount - 1}
          aria-label="Página siguiente"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function EmptyFiltered({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-3 flex min-h-48 flex-col items-center justify-center border border-dashed border-border p-5 text-center">
      <Filter aria-hidden="true" className="size-5 text-muted-foreground" />
      <h3 className="mt-2 text-sm font-medium">
        No hay coincidencias con los filtros aplicados
      </h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Quitá un filtro o ampliá el período para volver a ver operaciones.
      </p>
      <Button variant="outline" size="sm" className="mt-3" onClick={onClear}>
        Limpiar todos
      </Button>
    </div>
  )
}

const chartConfig = {
  import: { label: "Importaciones", color: "var(--chart-1)" },
  export: { label: "Exportaciones", color: "var(--chart-2)" },
  amount: { label: "Importe", color: "var(--chart-1)" },
  attention: { label: "Requiere atención", color: "var(--destructive)" },
  pending: { label: "Pendiente", color: "var(--warning)" },
  active: { label: "En curso", color: "var(--info)" },
  complete: { label: "Completado", color: "var(--success)" },
} satisfies ChartConfig

function ChartsSection({ data }: { data: Operation[] }) {
  const [metric, setMetric] = React.useState<"count" | "amount">("count")
  const statusData = statuses.map((item) => ({
    status: item,
    count: data.filter((operation) => operation.status === item).length,
    amount: data
      .filter((operation) => operation.status === item)
      .reduce((sum, operation) => sum + operation.amount, 0),
  }))
  const supplierData = groupOperations(data, (item) => item.counterpart)
    .map(({ label, items }) => ({ supplier: label, count: items.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const monthly = ["2026-08", "2026-09", "2026-10", "2026-11"].map((month) => ({
    month,
    import: data.filter(
      (item) =>
        item.relevantDate.startsWith(month) && item.type === "Importación"
    ).length,
    export: data.filter(
      (item) =>
        item.relevantDate.startsWith(month) && item.type === "Exportación"
    ).length,
  }))
  const statusColors = [
    "var(--info)",
    "var(--warning)",
    "var(--destructive)",
    "var(--success)",
  ]
  return (
    <section
      id="graficos"
      aria-labelledby="charts-title"
      className="mt-10 border-t border-border pt-8"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="charts-title"
            className="text-lg font-semibold tracking-tight"
          >
            Gráficos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lectura de tendencia y distribución; no sustituyen al listado
            operativo.
          </p>
        </div>
        <div className="flex rounded-md border border-border p-0.5">
          <Button
            size="xs"
            variant={metric === "count" ? "secondary" : "ghost"}
            onClick={() => setMetric("count")}
          >
            Cantidad
          </Button>
          <Button
            size="xs"
            variant={metric === "amount" ? "secondary" : "ghost"}
            onClick={() => setMetric("amount")}
          >
            Importe
          </Button>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ChartPanel
          title="Operaciones por proveedor"
          description="Barras horizontales para comparar carga operativa."
        >
          <ChartContainer config={chartConfig}>
            <BarChart
              data={supplierData}
              layout="vertical"
              margin={{ left: 8, right: 10 }}
              accessibilityLayer
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="supplier"
                type="category"
                width={105}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                name="Operaciones"
                fill="var(--color-amount)"
                radius={2}
              />
            </BarChart>
          </ChartContainer>
        </ChartPanel>
        <ChartPanel
          title="Importaciones y exportaciones"
          description="Barras apiladas por mes."
        >
          <ChartContainer config={chartConfig}>
            <BarChart data={monthly} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={(value) =>
                  formatMonth(`${value}-01`).slice(0, 3)
                }
                tickLine={false}
                axisLine={false}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="import"
                name="Importaciones"
                stackId="a"
                fill="var(--color-import)"
              />
              <Bar
                dataKey="export"
                name="Exportaciones"
                stackId="a"
                fill="var(--color-export)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </ChartPanel>
        <ChartPanel
          title="Evolución mensual"
          description="Área para seguir el volumen en el período."
        >
          <ChartContainer config={chartConfig}>
            <AreaChart data={monthly} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={(value) =>
                  formatMonth(`${value}-01`).slice(0, 3)
                }
                tickLine={false}
                axisLine={false}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="import"
                name="Importaciones"
                type="monotone"
                fill="var(--color-import)"
                fillOpacity={0.12}
                stroke="var(--color-import)"
                strokeWidth={2}
              />
              <Area
                dataKey="export"
                name="Exportaciones"
                type="monotone"
                fill="var(--color-export)"
                fillOpacity={0.08}
                stroke="var(--color-export)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </ChartPanel>
        <ChartPanel
          title={`Distribución por estado · ${metric === "count" ? "cantidad" : "importe"}`}
          description="Donut para composición de la cartera."
        >
          <ChartContainer config={chartConfig} className="h-64">
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(value) =>
                      metric === "amount"
                        ? new Intl.NumberFormat("es-AR", {
                            maximumFractionDigits: 0,
                          }).format(Number(value))
                        : String(value)
                    }
                  />
                }
              />
              <Pie
                data={statusData}
                dataKey={metric}
                nameKey="status"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={2}
              >
                {statusData.map((item, index) => (
                  <Cell key={item.status} fill={statusColors[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ChartContainer>
        </ChartPanel>
      </div>
    </section>
  )
}

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="border border-border p-4 sm:p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  )
}
