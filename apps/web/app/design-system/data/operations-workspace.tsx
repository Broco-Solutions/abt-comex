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
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Filter,
  Search,
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
import {
  DataTable,
  createColumnHelper,
  dataTableFeatures,
  getDataTableColumnMeta,
} from "@workspace/ui/components/data-table"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
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
type QuickPeriodPreset = Exclude<DatePeriodPreset, "custom">
type SortKey =
  | "reference"
  | "client"
  | "type"
  | "counterpart"
  | "route"
  | "status"
  | "owner"
  | "date"
  | "currency"
  | "amount"
  | "documents"
type StatusFilter = "" | OperationStatus | "active"
type IndicatorFilter = "active" | "attention" | "documents" | "arrivals"

const operationColumnHelper = createColumnHelper<
  typeof dataTableFeatures,
  Operation
>()

function formatAmount(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
  }).format(amount)
}

function money(amount: number, currency: Operation["currency"]) {
  return `${currency} ${formatAmount(amount)}`
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

function dayRange(preset: QuickPeriodPreset): DateRangeValue {
  const today = new Date(2026, 9, 14, 12)
  const start = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
  if (preset === "today") return { from: today, to: today }
  if (preset === "last-7") return { from: new Date(2026, 9, 8, 12), to: today }
  if (preset === "last-30")
    return { from: new Date(2026, 8, 15, 12), to: today }
  if (preset === "this-month")
    return { from: new Date(2026, 9, 1, 12), to: today }
  if (preset === "previous-month")
    return { from: new Date(2026, 8, 1, 12), to: new Date(2026, 8, 30, 12) }
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

function compareOperations(a: Operation, b: Operation, sort: SortKey) {
  if (sort === "amount") return a.amount - b.amount
  if (sort === "documents") return a.documentsPending - b.documentsPending

  const valueBySort = {
    reference: (operation: Operation) => operation.reference,
    client: (operation: Operation) => operation.client,
    type: (operation: Operation) => operation.type,
    counterpart: (operation: Operation) => operation.counterpart,
    route: (operation: Operation) => operation.route,
    status: (operation: Operation) => operation.status,
    owner: (operation: Operation) => operation.owner,
    date: (operation: Operation) => operation.relevantDate,
    currency: (operation: Operation) => operation.currency,
  }
  return valueBySort[sort](a).localeCompare(valueBySort[sort](b), "es-AR")
}

function Metric({
  label,
  value,
  description,
  tone,
  active,
  onClick,
}: {
  label: string
  value: string | number
  description: string
  tone?: "attention"
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group min-w-0 border-l-2 px-3 py-3 text-left transition-colors first:border-l-2 sm:px-4 ${
        active
          ? "border-l-primary bg-primary/8 shadow-[inset_0_0_0_1px_var(--primary)]"
          : "border-l-border hover:bg-muted/60"
      } cursor-pointer rounded-sm focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none`}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={`mt-1 truncate font-mono text-xl font-semibold tabular-nums ${tone === "attention" ? "text-destructive" : ""}`}
        title={String(value)}
      >
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
      <span className="mt-2 inline-flex text-xs font-medium text-foreground">
        {active ? "Filtro activo · Quitar" : "Aplicar filtro"}
      </span>
    </button>
  )
}

export function OperationsWorkspace() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("")
  const [owner, setOwner] = React.useState("")
  const [type, setType] = React.useState("")
  const [activeIndicator, setActiveIndicator] =
    React.useState<IndicatorFilter | null>(null)
  const [preset, setPreset] = React.useState<QuickPeriodPreset | "">("")
  const [period, setPeriod] = React.useState<DateRangeValue>()
  const [customPeriodOpen, setCustomPeriodOpen] = React.useState(false)
  const [groupBy, setGroupBy] = React.useState<GroupField | "">("")
  const [sort, setSort] = React.useState<SortKey | null>(null)
  const [sortDescending, setSortDescending] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set()
  )
  const [bulkNotice, setBulkNotice] = React.useState("")
  const [columnWidths, setColumnWidths] = React.useState<
    Record<string, number>
  >({})
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
          (!status ||
            (status === "active"
              ? operation.status !== "Completado"
              : operation.status === status)) &&
          (!owner || operation.owner === owner) &&
          (!type || operation.type === type) &&
          isWithinPeriod(operation, period) &&
          (activeIndicator !== "documents" || operation.documentsPending > 0) &&
          (activeIndicator !== "arrivals" ||
            (operation.relevantDate >= "2026-09-28" &&
              operation.relevantDate <= "2026-10-12"))
        )
      }),
    [search, status, owner, type, period, activeIndicator]
  )

  const sorted = React.useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (!sort) return 0
        const value = compareOperations(a, b, sort)
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
  const pageItems = React.useMemo(
    () => sorted.slice(page * perPage, (page + 1) * perPage),
    [page, sorted]
  )
  const selectedVisibleIds = React.useMemo(() => {
    const filteredIds = new Set(filtered.map((operation) => operation.id))
    return new Set(
      [...selectedIds].filter((operationId) => filteredIds.has(operationId))
    )
  }, [filtered, selectedIds])
  const activeFilterCount = [
    search,
    status,
    owner,
    type,
    period?.from,
    activeIndicator === "documents" || activeIndicator === "arrivals",
  ].filter(Boolean).length
  const applyPreset = (nextPreset: QuickPeriodPreset | "") => {
    setPreset(nextPreset)
    setCustomPeriodOpen(false)
    setPeriod(nextPreset ? dayRange(nextPreset) : undefined)
    setPage(0)
  }
  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setOwner("")
    setType("")
    setActiveIndicator(null)
    setPreset("")
    setPeriod(undefined)
    setCustomPeriodOpen(false)
    setPage(0)
  }
  const toggleSort = (next: SortKey) => {
    if (sort !== next) {
      setSort(next)
      setSortDescending(false)
    } else if (!sortDescending) {
      setSortDescending(true)
    } else {
      setSort(null)
      setSortDescending(false)
    }
  }
  const changeColumnWidth = React.useCallback(
    (columnId: string, width: number) => {
      setColumnWidths((current) => ({ ...current, [columnId]: width }))
    },
    []
  )
  const toggleSelection = (operationId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(operationId)) next.delete(operationId)
      else next.add(operationId)
      return next
    })
    setBulkNotice("")
  }
  const toggleAll = (items: Operation[]) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      const allSelected = items.every((item) => next.has(item.id))
      items.forEach((item) => {
        if (allSelected) next.delete(item.id)
        else next.add(item.id)
      })
      return next
    })
    setBulkNotice("")
  }
  const clearSelection = () => {
    setSelectedIds(new Set())
    setBulkNotice("")
  }
  const mockBulkAction = (action: string) => {
    setBulkNotice(action)
  }
  const applyIndicator = (indicator: IndicatorFilter) => {
    const isActive = activeIndicator === indicator
    setActiveIndicator(isActive ? null : indicator)

    if (indicator === "active") {
      setStatus(isActive ? "" : "active")
    } else if (indicator === "attention") {
      setStatus(isActive ? "" : "Requiere atención")
    }

    setPage(0)
  }
  const changeStatus = (value: string) => {
    const nextStatus = value as StatusFilter
    setStatus(nextStatus)
    setActiveIndicator(
      nextStatus === "active"
        ? "active"
        : nextStatus === "Requiere atención"
          ? "attention"
          : null
    )
    setPage(0)
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
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Operaciones activas"
            value={
              filtered.filter((item) => item.status !== "Completado").length
            }
            description="En curso, pendientes o revisión"
            active={activeIndicator === "active"}
            onClick={() => applyIndicator("active")}
          />
          <Metric
            label="Requieren atención"
            value={
              filtered.filter((item) => item.status === "Requiere atención")
                .length
            }
            description="Documentación o hito a resolver"
            tone="attention"
            active={activeIndicator === "attention"}
            onClick={() => applyIndicator("attention")}
          />
          <Metric
            label="Documentación pendiente"
            value={filtered.filter((item) => item.documentsPending > 0).length}
            description="Operaciones con documentos faltantes"
            active={activeIndicator === "documents"}
            onClick={() => applyIndicator("documents")}
          />
          <Metric
            label="Próximos arribos"
            value={
              filtered.filter(
                (item) =>
                  item.relevantDate >= "2026-09-28" &&
                  item.relevantDate <= "2026-10-12"
              ).length
            }
            description="Próximos 14 días"
            active={activeIndicator === "arrivals"}
            onClick={() => applyIndicator("arrivals")}
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

        <div className="mt-4 min-w-0 border border-border bg-card p-3 sm:p-4">
          <div className="grid min-w-0 items-end gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)_auto]">
            <label className="relative min-w-0 sm:col-span-2 lg:col-span-1">
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
            <label className="grid min-w-0 gap-1 text-xs font-medium text-muted-foreground">
              Agrupar por
              <select
                value={groupBy}
                onChange={(event) => {
                  setGroupBy(event.target.value as GroupField | "")
                  setPage(0)
                }}
                className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm font-normal text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <option value="">Sin agrupación</option>
                {groupableFields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid min-w-0 gap-1 text-xs font-medium text-muted-foreground">
              <span>Columnas</span>
              <Popover open={columnsOpen} onOpenChange={setColumnsOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full min-w-0 justify-start font-normal"
                      aria-label="Configurar columnas visibles"
                    />
                  }
                >
                  <Columns3 aria-hidden="true" />
                  <span className="truncate">Columnas</span>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-2">
                  <div className="flex items-center justify-between gap-3 px-2 py-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Columnas visibles
                    </p>
                    <PopoverClose
                      render={
                        <Button
                          variant="ghost"
                          size="xs"
                          aria-label="Cerrar selector de columnas"
                        />
                      }
                    >
                      Cerrar
                    </PopoverClose>
                  </div>
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
                        className="size-4 accent-primary focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                      />
                      {column.label}
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-5">
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
              onChange={changeStatus}
              options={[
                { value: "active", label: "Operaciones activas" },
                ...statuses.map((item) => ({ value: item, label: item })),
              ]}
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
            <label className="grid min-w-0 gap-1 text-xs font-medium text-muted-foreground">
              Acceso rápido
              <select
                value={preset || (period?.from ? "range" : "")}
                onChange={(event) =>
                  applyPreset(event.target.value as QuickPeriodPreset | "")
                }
                className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm font-normal text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <option value="">Todos</option>
                {period?.from && !preset ? (
                  <option value="range" disabled>
                    Rango elegido
                  </option>
                ) : null}
                <option value="today">Hoy</option>
                <option value="last-7">Últimos 7 días</option>
                <option value="last-30">Últimos 30 días</option>
                <option value="this-month">Este mes</option>
                <option value="previous-month">Mes anterior</option>
              </select>
            </label>
            <div className="grid min-w-0 gap-1 text-xs font-medium text-muted-foreground">
              <span>Desde / Hasta</span>
              <DateRangePicker
                value={period ?? {}}
                open={customPeriodOpen}
                onOpenChange={setCustomPeriodOpen}
                onChange={(range) => {
                  setPreset("")
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
                <Badge variant="outline">
                  Estado: {status === "active" ? "Operaciones activas" : status}
                </Badge>
              ) : null}
              {owner ? (
                <Badge variant="outline">Responsable: {owner}</Badge>
              ) : null}
              {type ? <Badge variant="outline">Tipo: {type}</Badge> : null}
              {period?.from ? (
                <Badge variant="outline">Período aplicado</Badge>
              ) : null}
              {activeIndicator === "documents" ? (
                <Badge variant="outline">Documentación pendiente</Badge>
              ) : null}
              {activeIndicator === "arrivals" ? (
                <Badge variant="outline">Próximos arribos</Badge>
              ) : null}
              <Button variant="ghost" size="xs" onClick={clearFilters}>
                <X aria-hidden="true" />
                Limpiar todos
              </Button>
            </div>
          ) : null}
        </div>

        {selectedVisibleIds.size ? (
          <div
            className="mt-4 flex flex-wrap items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-2 text-sm"
            role="region"
            aria-label="Acciones para operaciones seleccionadas"
          >
            <strong>{selectedVisibleIds.size} operaciones seleccionadas</strong>
            <span className="text-xs text-muted-foreground">
              Acciones masivas de demostración
            </span>
            <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">
              <Button
                variant="outline"
                size="xs"
                onClick={() => mockBulkAction("exportar")}
              >
                Exportar
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => mockBulkAction("asignar responsable")}
              >
                Asignar responsable
              </Button>
              <Button variant="ghost" size="xs" onClick={clearSelection}>
                Limpiar selección
              </Button>
            </div>
            {bulkNotice ? (
              <p
                className="basis-full text-xs text-muted-foreground"
                role="status"
              >
                Acción simulada: {bulkNotice} para {selectedVisibleIds.size}{" "}
                operaciones.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border py-2.5 text-sm">
          <p>
            <strong>{filtered.length}</strong> de {operations.length}{" "}
            operaciones
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="text-muted-foreground">
              Total general filtrado
            </span>
            <span className="font-mono font-medium tabular-nums">
              {totalByCurrency(filtered) || "—"}
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyFiltered onClear={clearFilters} />
        ) : groupBy ? (
          <GroupedRows
            groups={groups}
            visibleColumns={visibleColumns}
            selectedIds={selectedVisibleIds}
            onToggleSelection={toggleSelection}
            onToggleAll={toggleAll}
            sort={sort}
            sortDescending={sortDescending}
            onSort={toggleSort}
            columnWidths={columnWidths}
            onColumnWidthChange={changeColumnWidth}
          />
        ) : (
          <>
            <OperationList
              items={pageItems}
              visibleColumns={visibleColumns}
              selectedIds={selectedVisibleIds}
              onToggleSelection={toggleSelection}
              onToggleAll={toggleAll}
              sort={sort}
              sortDescending={sortDescending}
              onSort={toggleSort}
              columnWidths={columnWidths}
              onColumnWidthChange={changeColumnWidth}
            />
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
  options: readonly (string | { value: string; label: string })[]
}) {
  return (
    <label className="grid min-w-0 gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm font-normal text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
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

function SelectionCheckbox({
  label,
  checked,
  indeterminate = false,
  onChange,
  stopPropagation = false,
}: {
  label: string
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  stopPropagation?: boolean
}) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      aria-label={label}
      onChange={onChange}
      onClick={stopPropagation ? (event) => event.stopPropagation() : undefined}
      onKeyDown={
        stopPropagation ? (event) => event.stopPropagation() : undefined
      }
      className="size-4 rounded border-input accent-primary focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
    />
  )
}

function SortableHeader({
  label,
  sortKey,
  sort,
  sortDescending,
  onSort,
  align = "left",
}: {
  label: string
  sortKey: SortKey
  sort: SortKey | null
  sortDescending: boolean
  onSort: (sortKey: SortKey) => void
  align?: "left" | "right"
}) {
  const active = sort === sortKey
  const direction = active
    ? sortDescending
      ? "descendente"
      : "ascendente"
    : "sin orden"
  return (
    <button
      type="button"
      className={`flex min-h-10 w-full items-center gap-1.5 rounded-sm px-3 py-2 text-xs font-medium focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none ${align === "right" ? "justify-end text-right" : "justify-start text-left"}`}
      onClick={() => onSort(sortKey)}
      aria-label={`Ordenar por ${label}: ${direction}. Activar para cambiar el orden`}
    >
      <span className="truncate">{label}</span>
      {active ? (
        sortDescending ? (
          <ArrowDown aria-hidden="true" className="size-3.5 shrink-0" />
        ) : (
          <ArrowUp aria-hidden="true" className="size-3.5 shrink-0" />
        )
      ) : (
        <ArrowUpDown
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground"
        />
      )}
    </button>
  )
}

function GroupedRows({
  groups,
  visibleColumns,
  selectedIds,
  onToggleSelection,
  onToggleAll,
  sort,
  sortDescending,
  onSort,
  columnWidths,
  onColumnWidthChange,
}: {
  groups: { label: string; items: Operation[] }[]
  visibleColumns: OptionalColumn[]
  selectedIds: Set<string>
  onToggleSelection: (operationId: string) => void
  onToggleAll: (items: Operation[]) => void
  sort: SortKey | null
  sortDescending: boolean
  onSort: (sortKey: SortKey) => void
  columnWidths: Record<string, number>
  onColumnWidthChange: (columnId: string, width: number) => void
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
              Subtotal: {totalByCurrency(group.items) || "—"}
            </span>
          </summary>
          <OperationList
            items={group.items}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            onToggleSelection={onToggleSelection}
            onToggleAll={onToggleAll}
            sort={sort}
            sortDescending={sortDescending}
            onSort={onSort}
            columnWidths={columnWidths}
            onColumnWidthChange={onColumnWidthChange}
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
  selectedIds,
  onToggleSelection,
  onToggleAll,
  sort,
  sortDescending,
  onSort,
  columnWidths,
  onColumnWidthChange,
  grouped = false,
}: {
  items: Operation[]
  visibleColumns: OptionalColumn[]
  selectedIds: Set<string>
  onToggleSelection: (operationId: string) => void
  onToggleAll: (items: Operation[]) => void
  sort: SortKey | null
  sortDescending: boolean
  onSort: (sortKey: SortKey) => void
  columnWidths: Record<string, number>
  onColumnWidthChange: (columnId: string, width: number) => void
  grouped?: boolean
}) {
  const column = React.useCallback(
    (id: OptionalColumn) => visibleColumns.includes(id),
    [visibleColumns]
  )
  const selectedCount = items.filter((item) => selectedIds.has(item.id)).length
  const allSelected = items.length > 0 && selectedCount === items.length
  const columns = React.useMemo(
    () =>
      operationColumnHelper.columns([
        operationColumnHelper.display({
          id: "select",
          header: () => (
            <SelectionCheckbox
              label="Seleccionar todas las operaciones visibles"
              checked={allSelected}
              indeterminate={selectedCount > 0 && !allSelected}
              onChange={() => onToggleAll(items)}
            />
          ),
          cell: ({ row }) => (
            <SelectionCheckbox
              label={`Seleccionar operación ${row.original.reference}`}
              checked={selectedIds.has(row.original.id)}
              onChange={() => onToggleSelection(row.original.id)}
            />
          ),
          ...getDataTableColumnMeta("selection"),
        }),
        operationColumnHelper.accessor("reference", {
          header: () => (
            <SortableHeader
              label="Referencia"
              sortKey="reference"
              sort={sort}
              sortDescending={sortDescending}
              onSort={onSort}
            />
          ),
          cell: ({ row }) => (
            <span className="block font-mono font-medium tabular-nums">
              {row.original.reference}
            </span>
          ),
          ...getDataTableColumnMeta("reference"),
        }),
        operationColumnHelper.accessor("client", {
          header: () => (
            <SortableHeader
              label="Cliente"
              sortKey="client"
              sort={sort}
              sortDescending={sortDescending}
              onSort={onSort}
            />
          ),
          cell: ({ row }) => (
            <span
              className="block truncate font-medium"
              title={row.original.client}
            >
              {row.original.client}
            </span>
          ),
          ...getDataTableColumnMeta("flexible", { priority: "critical" }),
        }),
        ...(column("type")
          ? [
              operationColumnHelper.accessor("type", {
                header: () => (
                  <SortableHeader
                    label="Tipo"
                    sortKey="type"
                    sort={sort}
                    sortDescending={sortDescending}
                    onSort={onSort}
                  />
                ),
                cell: ({ row }) => (
                  <span className="block">{row.original.type}</span>
                ),
                ...getDataTableColumnMeta("compact"),
              }),
            ]
          : []),
        ...(column("counterpart")
          ? [
              operationColumnHelper.accessor("counterpart", {
                header: () => (
                  <SortableHeader
                    label="Proveedor / destino"
                    sortKey="counterpart"
                    sort={sort}
                    sortDescending={sortDescending}
                    onSort={onSort}
                  />
                ),
                cell: ({ row }) => (
                  <span
                    className="block truncate text-muted-foreground"
                    title={row.original.counterpart}
                  >
                    {row.original.counterpart}
                  </span>
                ),
                ...getDataTableColumnMeta("flexible"),
              }),
            ]
          : []),
        ...(column("route")
          ? [
              operationColumnHelper.accessor("route", {
                header: () => (
                  <SortableHeader
                    label="Origen / destino"
                    sortKey="route"
                    sort={sort}
                    sortDescending={sortDescending}
                    onSort={onSort}
                  />
                ),
                cell: ({ row }) => (
                  <span className="block truncate" title={row.original.route}>
                    {row.original.route}
                  </span>
                ),
                ...getDataTableColumnMeta("flexible", {
                  priority: "tertiary",
                }),
              }),
            ]
          : []),
        operationColumnHelper.accessor("status", {
          header: () => (
            <SortableHeader
              label="Estado"
              sortKey="status"
              sort={sort}
              sortDescending={sortDescending}
              onSort={onSort}
            />
          ),
          cell: ({ row }) => <StatusLabel status={row.original.status} />,
          ...getDataTableColumnMeta("status"),
        }),
        ...(column("owner")
          ? [
              operationColumnHelper.accessor("owner", {
                header: () => (
                  <SortableHeader
                    label="Responsable"
                    sortKey="owner"
                    sort={sort}
                    sortDescending={sortDescending}
                    onSort={onSort}
                  />
                ),
                cell: ({ row }) => (
                  <span className="block truncate" title={row.original.owner}>
                    {row.original.owner}
                  </span>
                ),
                ...getDataTableColumnMeta("flexible", { priority: "low" }),
              }),
            ]
          : []),
        ...(column("date")
          ? [
              operationColumnHelper.accessor("relevantDate", {
                id: "date",
                header: () => (
                  <SortableHeader
                    label="ETA / fecha"
                    sortKey="date"
                    sort={sort}
                    sortDescending={sortDescending}
                    onSort={onSort}
                  />
                ),
                cell: ({ row }) => (
                  <span className="font-mono tabular-nums">
                    {formatDate(row.original.relevantDate)}
                  </span>
                ),
                ...getDataTableColumnMeta("date"),
              }),
            ]
          : []),
        ...(column("currency")
          ? [
              operationColumnHelper.accessor("currency", {
                header: () => (
                  <SortableHeader
                    label="Moneda"
                    sortKey="currency"
                    sort={sort}
                    sortDescending={sortDescending}
                    onSort={onSort}
                  />
                ),
                cell: ({ row }) => (
                  <span className="font-mono tabular-nums">
                    {row.original.currency}
                  </span>
                ),
                ...getDataTableColumnMeta("currency"),
              }),
            ]
          : []),
        ...(column("amount")
          ? [
              operationColumnHelper.accessor("amount", {
                header: () => (
                  <SortableHeader
                    label="Importe"
                    sortKey="amount"
                    sort={sort}
                    sortDescending={sortDescending}
                    onSort={onSort}
                    align="right"
                  />
                ),
                cell: ({ row }) => (
                  <span className="font-mono tabular-nums">
                    {formatAmount(row.original.amount)}
                  </span>
                ),
                ...getDataTableColumnMeta("amount"),
              }),
            ]
          : []),
        ...(column("documents")
          ? [
              operationColumnHelper.accessor("documentsPending", {
                id: "documents",
                header: () => (
                  <SortableHeader
                    label="Docs."
                    sortKey="documents"
                    sort={sort}
                    sortDescending={sortDescending}
                    onSort={onSort}
                    align="right"
                  />
                ),
                cell: ({ row }) =>
                  row.original.documentsPending
                    ? String(row.original.documentsPending)
                    : "—",
                ...getDataTableColumnMeta("compact", {
                  priority: "tertiary",
                  align: "right",
                }),
              }),
            ]
          : []),
      ]),
    [
      allSelected,
      column,
      items,
      onSort,
      onToggleAll,
      onToggleSelection,
      selectedCount,
      selectedIds,
      sort,
      sortDescending,
    ]
  )

  return (
    <>
      <div className={`${grouped ? "" : "mt-3"} hidden min-w-0 md:block`}>
        <DataTable
          data={items}
          columns={columns}
          getRowId={(operation) => operation.id}
          getHeaderAriaSort={(columnId) => {
            if (columnId === "select") return undefined
            const sortKey = columnId as SortKey
            if (sort !== sortKey) return "none"
            return sortDescending ? "descending" : "ascending"
          }}
          getColumnLabel={(id) =>
            id === "reference"
              ? "Referencia"
              : id === "client"
                ? "Cliente"
                : id === "status"
                  ? "Estado"
                  : (columnDefinitions.find((column) => column.id === id)
                      ?.label ?? id)
          }
          columnWidths={columnWidths}
          onColumnWidthChange={onColumnWidthChange}
          getRowClassName={(operation) =>
            selectedIds.has(operation.id) ? "bg-muted/60" : undefined
          }
          getRowAriaSelected={(operation) => selectedIds.has(operation.id)}
        />
      </div>
      <div
        className={`${grouped ? "" : "mt-3"} divide-y divide-border border-y border-border md:hidden`}
      >
        <label className="flex min-h-10 items-center gap-2 bg-muted/60 px-3 text-xs font-medium">
          <SelectionCheckbox
            label="Seleccionar todas las operaciones visibles"
            checked={allSelected}
            indeterminate={selectedCount > 0 && !allSelected}
            onChange={() => onToggleAll(items)}
          />
          Seleccionar registros visibles
        </label>
        {items.map((operation) => {
          const selected = selectedIds.has(operation.id)
          return (
            <details key={operation.id} className="group">
              <summary
                className={`flex min-h-16 cursor-pointer list-none items-center gap-3 px-3 py-2 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none ${selected ? "bg-muted/60" : ""}`}
              >
                <SelectionCheckbox
                  label={`Seleccionar operación ${operation.reference}`}
                  checked={selected}
                  onChange={() => onToggleSelection(operation.id)}
                  stopPropagation
                />
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
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 border-t border-border bg-muted/30 px-3 py-3 text-xs sm:grid-cols-2">
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
          )
        })}
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
  count: { label: "Operaciones", color: "var(--chart-1)" },
  attention: { label: "Requiere atención", color: "var(--destructive)" },
  pending: { label: "Pendiente", color: "var(--warning)" },
  active: { label: "En curso", color: "var(--info)" },
  complete: { label: "Completado", color: "var(--success)" },
} satisfies ChartConfig

function ChartsSection({ data }: { data: Operation[] }) {
  const statusData = statuses.map((item) => ({
    status: item,
    count: data.filter((operation) => operation.status === item).length,
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
                fill="var(--color-count)"
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
          title="Distribución por estado · cantidad"
          description="Donut para composición de la cartera."
        >
          <ChartContainer config={chartConfig} className="h-64">
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(value) => String(value)}
                  />
                }
              />
              <Pie
                data={statusData}
                dataKey="count"
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
