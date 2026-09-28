import * as React from "react"
import { cn } from "cn"

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
      <div className="w-full overflow-x-auto overscroll-x-contain">
        {children}
      </div>
    </section>
  )
}

export { DataTableFrame }
