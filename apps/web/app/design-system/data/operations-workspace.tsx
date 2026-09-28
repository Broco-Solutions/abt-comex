"use client"

import * as React from "react"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleAlert,
  Columns3,
  Filter,
  LoaderCircle,
  PackageOpen,
  RefreshCw,
  Search,
  X,
} from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  aggregationFn_sum,
  columnFilteringFeature,
  columnGroupingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  DataTableFrame,
  filterFn_includesString,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@workspace/ui/components/data-table"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import {
  operationOwners,
  operations,
  type Operation,
  type OperationStatus,
} from "./operations-data"

const tableFeaturesConfig = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowAggregationFeature,
  aggregationFns: { sum: aggregationFn_sum },
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
})

const columnHelper = createColumnHelper<typeof tableFeaturesConfig, Operation>()

const statuses: OperationStatus[] = [
  "En curso",
  "Pendiente",
  "Requiere atención",
  "Completado",
]

const formatMoney = (amount: number, currency: Operation["currency"]) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`))

const formatCurrencyTotals = (
  items: ReadonlyArray<Pick<Operation, "amount" | "currency">>
) =>
  (["USD", "EUR"] as const)
    .map((currency) => ({
      currency,
      amount: items
        .filter((item) => item.currency === currency)
        .reduce((total, item) => total + item.amount, 0),
    }))
    .filter(({ amount }) => amount > 0)
    .map(({ amount, currency }) => formatMoney(amount, currency))
    .join(" · ")

function StatusLabel({ status }: Readonly<{ status: OperationStatus }>) {
  const config = {
    "En curso": { variant: "info" as const, label: "En curso" },
    Pendiente: { variant: "warning" as const, label: "Pendiente" },
    "Requiere atención": {
      variant: "destructive" as const,
      label: "Requiere atención",
    },
    Completado: { variant: "success" as const, label: "Completado" },
  }[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

function Metric({
  label,
  value,
  description,
  emphasis = false,
}: Readonly<{
  label: string
  value: number
  description: string
  emphasis?: boolean
}>) {
  return (
    <div className="border-l border-border px-4 first:border-l-0 first:pl-0 sm:px-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-mono text-2xl font-medium tabular-nums ${
          emphasis ? "text-destructive" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function SortableHeader({
  children,
  column,
}: Readonly<{
  children: React.ReactNode
  column: {
    getIsSorted: () => false | "asc" | "desc"
    toggleSorting: (desc?: boolean) => void
  }
}>) {
  const sort = column.getIsSorted()
  const Icon =
    sort === "asc" ? ArrowUp : sort === "desc" ? ArrowDown : ChevronsUpDown

  return (
    <button
      type="button"
      className="inline-flex min-h-8 items-center gap-1 rounded-sm text-left hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      onClick={() => column.toggleSorting(sort === "asc")}
      aria-label={`Ordenar por ${typeof children === "string" ? children : "columna"}`}
    >
      {children}
      <Icon aria-hidden="true" className="size-3.5 text-muted-foreground" />
    </button>
  )
}

const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Seleccionar todas las operaciones visibles"
        checked={table.getIsAllPageRowsSelected()}
        ref={(element) => {
          if (element)
            element.indeterminate =
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()
        }}
        onClick={table.getToggleAllPageRowsSelectedHandler()}
        onChange={() => undefined}
        className="size-4 accent-primary focus-visible:ring-3 focus-visible:ring-ring/30"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label={`Seleccionar ${row.original.reference}`}
        checked={row.getIsSelected()}
        onClick={row.getToggleSelectedHandler({ selectChildren: false })}
        onChange={() => undefined}
        className="size-4 accent-primary focus-visible:ring-3 focus-visible:ring-ring/30"
      />
    ),
    enableHiding: false,
  }),
  columnHelper.accessor("reference", {
    header: ({ column }) => (
      <SortableHeader column={column}>Referencia</SortableHeader>
    ),
    cell: ({ getValue }) => (
      <span className="font-mono text-xs font-medium">{getValue()}</span>
    ),
    enableHiding: false,
  }),
  columnHelper.accessor("type", {
    header: ({ column }) => (
      <SortableHeader column={column}>Tipo</SortableHeader>
    ),
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("client", {
    header: ({ column }) => (
      <SortableHeader column={column}>Cliente</SortableHeader>
    ),
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor("counterpart", {
    header: "Proveedor / destino",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("route", {
    header: "Origen / destino",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <SortableHeader column={column}>Estado</SortableHeader>
    ),
    cell: ({ getValue }) => <StatusLabel status={getValue()} />,
  }),
  columnHelper.accessor("owner", {
    header: ({ column }) => (
      <SortableHeader column={column}>Responsable</SortableHeader>
    ),
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("relevantDate", {
    header: ({ column }) => (
      <SortableHeader column={column}>ETA / fecha</SortableHeader>
    ),
    cell: ({ getValue }) => (
      <span className="font-mono text-xs tabular-nums">
        {formatDate(getValue())}
      </span>
    ),
    filterFn: (row, columnId, value) => {
      if (!value) return true
      const date = row.getValue<string>(columnId)
      if (value === "proximos-14")
        return date >= "2026-09-28" && date <= "2026-10-12"
      if (value === "octubre")
        return date >= "2026-10-01" && date <= "2026-10-31"
      return date >= "2026-11-01"
    },
  }),
  columnHelper.accessor("currency", {
    header: "Moneda",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("amount", {
    header: ({ column }) => (
      <SortableHeader column={column}>Importe</SortableHeader>
    ),
    cell: ({ row, getValue }) => (
      <span className="font-mono text-xs tabular-nums">
        {formatMoney(getValue(), row.original.currency)}
      </span>
    ),
    aggregationFn: "sum",
  }),
  columnHelper.accessor("documentsPending", {
    header: ({ column }) => (
      <SortableHeader column={column}>Docs. pendientes</SortableHeader>
    ),
    cell: ({ getValue }) =>
      getValue() === 0
        ? "—"
        : `${getValue()} pendiente${getValue() === 1 ? "" : "s"}`,
  }),
])

function SummaryChart({ data }: Readonly<{ data: Operation[] }>) {
  const counts = statuses.map((status) => ({
    status,
    count: data.filter((operation) => operation.status === status).length,
  }))
  const maximum = Math.max(...counts.map(({ count }) => count), 1)

  return (
    <section
      aria-labelledby="status-chart-title"
      className="border border-border p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 id="status-chart-title" className="text-sm font-semibold">
            Operaciones por estado
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Sobre el resultado filtrado actual.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">Cantidad</span>
      </div>
      <div
        className="mt-5 grid grid-cols-4 gap-3"
        role="img"
        aria-label="Distribución de operaciones por estado"
      >
        {counts.map(({ status, count }) => (
          <div key={status} className="min-w-0">
            <div className="flex h-28 items-end border-b border-border">
              <div
                className={`w-full ${
                  status === "Requiere atención"
                    ? "bg-destructive"
                    : status === "Pendiente"
                      ? "bg-warning"
                      : status === "Completado"
                        ? "bg-success"
                        : "bg-info"
                }`}
                style={{
                  height: `${Math.max((count / maximum) * 100, count ? 8 : 0)}%`,
                }}
              />
            </div>
            <p className="mt-2 font-mono text-sm font-medium tabular-nums">
              {count}
            </p>
            <p className="mt-1 text-xs leading-4 text-muted-foreground">
              {status}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function OperationsWorkspace() {
  const [search, setSearch] = React.useState("")
  const [showColumns, setShowColumns] = React.useState(false)
  const [mode, setMode] = React.useState<
    "data" | "loading" | "empty" | "error"
  >("data")
  const table = useTable({
    data: operations,
    columns,
    features: tableFeaturesConfig,
    getRowId: (row) => row.id,
    globalFilterFn: "includesString",
    getColumnCanGlobalFilter: (column) =>
      column.id !== "select" &&
      column.id !== "amount" &&
      column.id !== "documentsPending",
    enableRowSelection: (row) => !row.getIsGrouped(),
    enableSubRowSelection: false,
    groupedColumnMode: false,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  const filteredOperations = table
    .getFilteredRowModel()
    .rows.filter((row) => !row.getIsGrouped())
    .map((row) => row.original)
  const totalAmount = formatCurrencyTotals(filteredOperations)
  const grouped = table.state.grouping.includes("status")
  const selectedCount = table.getSelectedRowIds().length
  const attentionCount = operations.filter(
    (operation) => operation.status === "Requiere atención"
  ).length
  const arrivalsSoon = operations.filter(
    (operation) =>
      operation.relevantDate >= "2026-09-28" &&
      operation.relevantDate <= "2026-10-12"
  ).length
  const documentsPending = operations.filter(
    (operation) => operation.documentsPending > 0
  ).length
  const activeFilters = [
    ["Tipo", table.getColumn("type")?.getFilterValue() as string | undefined],
    [
      "Estado",
      table.getColumn("status")?.getFilterValue() as string | undefined,
    ],
    [
      "Responsable",
      table.getColumn("owner")?.getFilterValue() as string | undefined,
    ],
    [
      "Período",
      table.getColumn("relevantDate")?.getFilterValue() as string | undefined,
    ],
  ].filter(([, value]) => Boolean(value))

  const clearFilters = () => {
    setSearch("")
    table.resetGlobalFilter(true)
    table.resetColumnFilters(true)
    table.setPageIndex(0)
  }

  const setFilter = (columnId: string, value: string) => {
    table.getColumn(columnId)?.setFilterValue(value || undefined)
    table.setPageIndex(0)
  }

  return (
    <div className="py-8 sm:py-10">
      <section
        aria-labelledby="kpis-title"
        className="border-y border-border py-5"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 id="kpis-title" className="text-sm font-semibold">
              Seguimiento operativo
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Cartera mock al 28 sep 2026.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">42 operaciones</span>
        </div>
        <div className="grid gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Operaciones activas"
            value={
              operations.filter((item) => item.status !== "Completado").length
            }
            description="En curso, pendientes o en revisión"
          />
          <Metric
            label="Requieren atención"
            value={attentionCount}
            description="Documentación o hito a resolver"
            emphasis
          />
          <Metric
            label="Arribos próximos"
            value={arrivalsSoon}
            description="Próximos 14 días"
          />
          <Metric
            label="Con documentación pendiente"
            value={documentsPending}
            description="Al menos un documento requerido"
          />
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-labelledby="operations-title" className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="operations-title"
                className="text-lg font-semibold tracking-tight"
              >
                Operaciones
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Listado principal para consulta, priorización y acción en lote.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Estado de referencia
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value as typeof mode)}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <option value="data">Con datos</option>
                <option value="loading">Cargando</option>
                <option value="empty">Sin operaciones</option>
                <option value="error">Error</option>
              </select>
            </label>
          </div>

          {mode === "loading" ? <LoadingState /> : null}
          {mode === "error" ? (
            <ErrorState onRetry={() => setMode("data")} />
          ) : null}
          {mode === "empty" ? (
            <EmptyState onRestore={() => setMode("data")} />
          ) : null}

          {mode === "data" ? (
            <>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <label className="relative min-w-0 flex-1">
                    <span className="sr-only">Buscar operaciones</span>
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground"
                    />
                    <Input
                      value={search}
                      onChange={(event) => {
                        const value = event.target.value
                        setSearch(value)
                        table.setGlobalFilter(value)
                        table.setPageIndex(0)
                      }}
                      placeholder="Buscar por referencia, cliente, proveedor o ruta"
                      className="pl-9"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={grouped ? "secondary" : "outline"}
                      size="sm"
                      onClick={() =>
                        table.setGrouping(grouped ? [] : ["status"])
                      }
                    >
                      <Filter aria-hidden="true" />
                      {grouped ? "Quitar agrupación" : "Agrupar por estado"}
                    </Button>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        aria-expanded={showColumns}
                        onClick={() => setShowColumns((open) => !open)}
                      >
                        <Columns3 aria-hidden="true" />
                        Columnas
                      </Button>
                      {showColumns ? (
                        <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-border bg-popover p-2 shadow-sm">
                          <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                            Columnas visibles
                          </p>
                          {table
                            .getAllLeafColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                              <label
                                key={column.id}
                                className="flex min-h-8 items-center gap-2 rounded px-2 text-sm hover:bg-muted"
                              >
                                <input
                                  type="checkbox"
                                  checked={column.getIsVisible()}
                                  onChange={column.getToggleVisibilityHandler()}
                                  className="size-4 accent-primary"
                                />
                                {column.id === "counterpart"
                                  ? "Proveedor / destino"
                                  : column.id === "route"
                                    ? "Origen / destino"
                                    : column.id === "relevantDate"
                                      ? "ETA / fecha"
                                      : column.id === "documentsPending"
                                        ? "Docs. pendientes"
                                        : column.id === "amount"
                                          ? "Importe"
                                          : column.id}
                              </label>
                            ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <FilterSelect
                    label="Tipo"
                    value={
                      (table.getColumn("type")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(value) => setFilter("type", value)}
                    options={["Importación", "Exportación"]}
                  />
                  <FilterSelect
                    label="Estado"
                    value={
                      (table.getColumn("status")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(value) => setFilter("status", value)}
                    options={statuses}
                  />
                  <FilterSelect
                    label="Responsable"
                    value={
                      (table.getColumn("owner")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(value) => setFilter("owner", value)}
                    options={operationOwners}
                  />
                  <FilterSelect
                    label="Fecha relevante"
                    value={
                      (table
                        .getColumn("relevantDate")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(value) => setFilter("relevantDate", value)}
                    options={["proximos-14", "octubre", "noviembre"]}
                    labels={{
                      "proximos-14": "Próximos 14 días",
                      octubre: "Octubre 2026",
                      noviembre: "Noviembre en adelante",
                    }}
                  />
                </div>
              </div>

              {search || activeFilters.length ? (
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
                  {activeFilters.map(([label, value]) => (
                    <Badge key={label} variant="outline">
                      {label}: {value}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="xs" onClick={clearFilters}>
                    <X aria-hidden="true" /> Limpiar filtros
                  </Button>
                </div>
              ) : null}

              <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p>
                  <span className="font-medium">
                    {filteredOperations.length}
                  </span>{" "}
                  de {operations.length} operaciones
                </p>
                <p className="font-mono text-xs text-muted-foreground tabular-nums">
                  Total filtrado: {totalAmount || "—"}
                </p>
              </div>

              {selectedCount ? (
                <Alert variant="info" className="mt-3 py-2">
                  <CircleAlert aria-hidden="true" />
                  <AlertTitle>
                    {selectedCount} operación{selectedCount === 1 ? "" : "es"}{" "}
                    seleccionada{selectedCount === 1 ? "" : "s"}
                  </AlertTitle>
                  <AlertDescription className="flex flex-wrap items-center gap-2">
                    Acción de ejemplo para una futura gestión masiva.
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => table.resetRowSelection(true)}
                    >
                      Asignar responsable
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => table.resetRowSelection(true)}
                    >
                      Quitar selección
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : null}

              {filteredOperations.length === 0 ? (
                <FilteredEmptyState onClear={clearFilters} />
              ) : (
                <OperationsTable table={table} grouped={grouped} />
              )}
              {filteredOperations.length > 0 ? (
                <Pagination table={table} />
              ) : null}
            </>
          ) : null}
        </section>

        <SummaryChart data={filteredOperations} />
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels = {},
}: Readonly<{
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  labels?: Record<string, string>
}>) {
  return (
    <label className="grid gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm font-normal text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  )
}

function OperationsTable({
  table,
  grouped,
}: Readonly<{
  table: ReturnType<typeof useTable<typeof tableFeaturesConfig, Operation>>
  grouped: boolean
}>) {
  return (
    <DataTableFrame aria-label="Tabla de operaciones" className="mt-3">
      <Table className="min-w-[560px] text-xs sm:min-w-[760px] lg:min-w-[1120px]">
        <TableHeader className="sticky top-0 z-10 bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`bg-muted text-xs ${columnResponsiveClass(header.column.id)}`}
                >
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            if (row.getIsGrouped()) {
              const groupOperations = row
                .getLeafRows()
                .map((leafRow) => leafRow.original)
              const subtotal = formatCurrencyTotals(groupOperations)
              const groupName = String(row.groupingValue)
              return (
                <TableRow
                  key={row.id}
                  className="bg-muted/60 hover:bg-muted/80"
                >
                  <TableCell
                    colSpan={row.getVisibleCells().length}
                    className="p-0"
                  >
                    <button
                      type="button"
                      onClick={row.getToggleExpandedHandler()}
                      className="flex min-h-10 w-full items-center gap-2 px-3 text-left text-xs focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                      aria-expanded={row.getIsExpanded()}
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 transition-transform ${row.getIsExpanded() ? "" : "-rotate-90"}`}
                      />
                      <span className="font-medium">{groupName}</span>
                      <span className="text-muted-foreground">
                        {groupOperations.length} operaciones
                      </span>
                      <span className="ml-auto font-mono tabular-nums">
                        Subtotal: {subtotal}
                      </span>
                    </button>
                  </TableCell>
                </TableRow>
              )
            }

            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={columnResponsiveClass(cell.column.id)}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground sm:hidden">
        Deslizá para ver proveedor, ruta, responsable y documentación.
      </p>
      {grouped ? null : null}
    </DataTableFrame>
  )
}

function columnResponsiveClass(id: string) {
  if (id === "counterpart" || id === "route" || id === "owner")
    return "hidden lg:table-cell"
  if (id === "currency" || id === "documentsPending")
    return "hidden xl:table-cell"
  if (id === "type" || id === "relevantDate") return "hidden sm:table-cell"
  return ""
}

function Pagination({
  table,
}: Readonly<{
  table: ReturnType<typeof useTable<typeof tableFeaturesConfig, Operation>>
}>) {
  const pagination = table.state.pagination
  const pageCount = table.getPageCount()
  const start = pagination.pageIndex * pagination.pageSize + 1
  const end = Math.min(
    start + pagination.pageSize - 1,
    table.getFilteredRowModel().rows.filter((row) => !row.getIsGrouped()).length
  )

  return (
    <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label
          className="text-xs text-muted-foreground"
          htmlFor="rows-per-page"
        >
          Filas por página
        </label>
        <select
          id="rows-per-page"
          value={pagination.pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          {[10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {start}–{end}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Página {pagination.pageIndex + 1} de {pageCount}
        </span>
        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Página anterior"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Página siguiente"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function FilteredEmptyState({ onClear }: Readonly<{ onClear: () => void }>) {
  return (
    <div className="mt-3 flex min-h-56 flex-col items-center justify-center border border-dashed border-border p-6 text-center">
      <Search aria-hidden="true" className="size-6 text-muted-foreground" />
      <h3 className="mt-3 text-sm font-medium">
        No hay coincidencias con los filtros aplicados
      </h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        Probá quitar un filtro o ampliar el período para volver a ver
        operaciones.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
        <X aria-hidden="true" /> Limpiar filtros
      </Button>
    </div>
  )
}

function EmptyState({ onRestore }: Readonly<{ onRestore: () => void }>) {
  return (
    <div className="mt-4 flex min-h-72 flex-col items-center justify-center border border-dashed border-border p-6 text-center">
      <PackageOpen
        aria-hidden="true"
        className="size-7 text-muted-foreground"
      />
      <h3 className="mt-3 text-sm font-medium">
        No hay operaciones para mostrar
      </h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        Cuando se registren o asignen operaciones a este equipo, aparecerán en
        este listado.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onRestore}>
        Volver al estado de referencia
      </Button>
    </div>
  )
}

function LoadingState() {
  return (
    <div
      className="mt-4 border border-border p-5"
      aria-live="polite"
      aria-label="Cargando operaciones"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <LoaderCircle
          aria-hidden="true"
          className="size-4 animate-spin text-muted-foreground"
        />{" "}
        Cargando operaciones
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
        <div className="h-3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 animate-pulse rounded bg-muted" />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Actualizando el último estado disponible.
      </p>
    </div>
  )
}

function ErrorState({ onRetry }: Readonly<{ onRetry: () => void }>) {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle aria-hidden="true" />
      <AlertTitle>No se pudieron cargar las operaciones</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-3">
        La consulta excedió el tiempo de espera. Revisá la conexión e intentá
        nuevamente.
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw aria-hidden="true" /> Reintentar
        </Button>
      </AlertDescription>
    </Alert>
  )
}
