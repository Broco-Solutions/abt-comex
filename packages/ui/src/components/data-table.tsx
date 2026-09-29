"use client"

import * as React from "react"
import { cn } from "cn"

import {
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table"

export {
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
  filterFn_includesString,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"

type DataTableColumnPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "tertiary"

type DataTableColumnAlign = "left" | "center" | "right"

type DataTableFixedColumnMeta = {
  /** Complete rendered width, including the cell padding. */
  fixed: number
  flexible?: never
}

type DataTableFlexibleColumnMeta = {
  /** Shares the remaining table width with the other flexible columns. */
  flexible: true
  fixed?: never
}

type DataTableColumnMeta = (DataTableFixedColumnMeta | DataTableFlexibleColumnMeta) & {
  priority: DataTableColumnPriority
  truncate: boolean
  align: DataTableColumnAlign
}

const dataTableFeatures = tableFeatures({
  columnMeta: {} as DataTableColumnMeta,
})

type DataTableColumnKind =
  | "selection"
  | "reference"
  | "date"
  | "currency"
  | "amount"
  | "status"
  | "compact"
  | "flexible"

const dataTableColumnMetadata = {
  selection: {
    fixed: 44,
    priority: "critical",
    truncate: false,
    align: "center",
  },
  reference: {
    fixed: 120,
    priority: "critical",
    truncate: false,
    align: "left",
  },
  date: {
    fixed: 112,
    priority: "high",
    truncate: false,
    align: "left",
  },
  currency: {
    fixed: 76,
    priority: "high",
    truncate: false,
    align: "left",
  },
  amount: {
    fixed: 112,
    priority: "critical",
    truncate: false,
    align: "right",
  },
  status: {
    fixed: 164,
    priority: "critical",
    truncate: false,
    align: "left",
  },
  compact: {
    fixed: 96,
    priority: "medium",
    truncate: false,
    align: "left",
  },
  flexible: {
    flexible: true,
    priority: "medium",
    truncate: true,
    align: "left",
  },
} satisfies Record<
  DataTableColumnKind,
  DataTableColumnMeta
>

function getDataTableColumnMeta(
  kind: DataTableColumnKind,
  overrides?: Partial<
    Pick<DataTableColumnMeta, "priority" | "truncate" | "align">
  >
) {
  return {
    meta: {
      ...dataTableColumnMetadata[kind],
      ...overrides,
    } as DataTableColumnMeta,
  }
}

// Priority selects the deliberate compact-tablet preset. It never removes a
// desktop or notebook column because the container happened to become narrower.
const tabletPriorityClasses = {
  critical: { cell: "", column: "" },
  high: { cell: "", column: "" },
  medium: {
    cell: "hidden lg:table-cell",
    column: "hidden lg:table-column",
  },
  low: {
    cell: "hidden lg:table-cell",
    column: "hidden lg:table-column",
  },
  tertiary: {
    cell: "hidden lg:table-cell",
    column: "hidden lg:table-column",
  },
} satisfies Record<
  DataTableColumnPriority,
  { cell: string; column: string }
>

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} satisfies Record<DataTableColumnAlign, string>

function getColumnMeta<TData extends RowData>(
  column: ColumnDef<typeof dataTableFeatures, TData>
) {
  if (!column.meta) {
    throw new Error(
      "DataTable requiere metadata de columna: fixed o flexible, priority, truncate y align."
    )
  }

  return column.meta
}

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<typeof dataTableFeatures, TData>[]
  data: TData[]
  getRowId: (row: TData) => string
  getColumnClassName?: (columnId: string) => string | undefined
  getHeaderAriaSort?: (
    columnId: string
  ) => React.AriaAttributes["aria-sort"]
  getRowAriaSelected?: (row: TData) => boolean | undefined
  getRowClassName?: (row: TData) => string | undefined
  /** Desktop-only widths explicitly chosen by the person using the table. */
  columnWidths?: Record<string, number>
  onColumnWidthChange?: (columnId: string, width: number) => void
  getColumnCanResize?: (columnId: string) => boolean
  className?: string
}

const minimumResizableWidth = 72

function ColumnResizeHandle({
  label,
  currentWidth,
  onResize,
}: {
  label: string
  currentWidth: () => number
  onResize: (width: number) => void
}) {
  const startWidth = React.useRef(0)
  const startX = React.useRef(0)

  return (
    <span
      role="separator"
      aria-orientation="vertical"
      aria-label={`Modificar ancho de columna ${label}`}
      tabIndex={0}
      onPointerDown={(event) => {
        event.preventDefault()
        event.stopPropagation()
        startX.current = event.clientX
        startWidth.current = currentWidth()
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        onResize(
          Math.max(
            minimumResizableWidth,
            Math.round(startWidth.current + event.clientX - startX.current)
          )
        )
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
        event.preventDefault()
        event.stopPropagation()
        onResize(
          Math.max(
            minimumResizableWidth,
            currentWidth() + (event.key === "ArrowRight" ? 16 : -16)
          )
        )
      }}
      className="absolute inset-y-0 right-0 z-10 hidden w-3 cursor-col-resize touch-none outline-none after:absolute after:inset-y-2 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-transparent hover:after:bg-primary focus-visible:after:bg-primary focus-visible:ring-3 focus-visible:ring-ring/30 md:block"
    />
  )
}

function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  getColumnClassName,
  getHeaderAriaSort,
  getRowAriaSelected,
  getRowClassName,
  columnWidths,
  onColumnWidthChange,
  getColumnCanResize = (columnId) => columnId !== "select",
  className,
}: DataTableProps<TData>) {
  const tableRef = React.useRef<HTMLTableElement>(null)
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
  })
  const visibleColumns = table.getAllLeafColumns()
  const columnWidth = React.useCallback((columnId: string) => {
    const header = tableRef.current?.querySelector<HTMLElement>(
      `th[data-column-id="${columnId}"]`
    )
    return header?.getBoundingClientRect().width ?? minimumResizableWidth
  }, [])

  return (
    <div className={cn("w-full", className)}>
      <table ref={tableRef} className="w-full table-fixed text-left text-xs">
        <colgroup>
          {visibleColumns.map((column) => {
            const meta = getColumnMeta(column.columnDef)
            return (
              <col
                key={column.id}
                className={tabletPriorityClasses[meta.priority].column}
                style={
                  columnWidths?.[column.id]
                    ? { width: columnWidths[column.id] }
                    : meta.fixed
                      ? { width: meta.fixed }
                      : undefined
                }
              />
            )
          })}
        </colgroup>
        <thead className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = getColumnMeta(header.column.columnDef)
                const ariaSort = getHeaderAriaSort?.(header.column.id)
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={ariaSort}
                    data-column-id={header.column.id}
                    className={cn(
                      "relative font-medium",
                      ariaSort ? "p-0" : "px-3 py-2",
                      tabletPriorityClasses[meta.priority].cell,
                      alignClasses[meta.align],
                      getColumnClassName?.(header.column.id)
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                    {onColumnWidthChange &&
                    getColumnCanResize(header.column.id) ? (
                      <ColumnResizeHandle
                        label={
                          typeof header.column.columnDef.header === "string"
                            ? header.column.columnDef.header
                            : header.column.id
                        }
                        currentWidth={() => columnWidth(header.column.id)}
                        onResize={(width) =>
                          onColumnWidthChange(header.column.id, width)
                        }
                      />
                    ) : null}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              aria-selected={getRowAriaSelected?.(row.original)}
              className={cn(
                "border-t border-border align-middle hover:bg-muted/40",
                getRowClassName?.(row.original)
              )}
            >
              {row.getAllCells().map((cell) => {
                const meta = getColumnMeta(cell.column.columnDef)
                return (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-3 py-2.5",
                      meta.truncate && "truncate",
                      tabletPriorityClasses[meta.priority].cell,
                      alignClasses[meta.align],
                      getColumnClassName?.(cell.column.id)
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DataTableFrame({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="data-table-frame"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-background",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export {
  DataTable,
  DataTableFrame,
  dataTableFeatures,
  getDataTableColumnMeta,
  type DataTableColumnAlign,
  type DataTableColumnKind,
  type DataTableColumnMeta,
  type DataTableColumnPriority,
}
