"use client"

import Link from "next/link"
import {
  createColumnHelper,
  dataTableFeatures,
  DataTable,
  DataTableFrame,
  getDataTableColumnMeta,
} from "@workspace/ui/components/data-table"
import { formatDate } from "@workspace/ui/lib/date"
import type { DemonstrationClient } from "../types/client"
import {
  clientDetailHref,
  clientListHref,
  getClientOperations,
} from "../data/clients"
import type { DemonstrationOperation } from "@/features/operations/types/operation"

const helper = createColumnHelper<
  typeof dataTableFeatures,
  DemonstrationClient
>()
export function ClientTable({
  clients,
  operations,
  query,
}: {
  clients: DemonstrationClient[]
  operations: DemonstrationOperation[]
  query: string
}) {
  const href = (client: DemonstrationClient) =>
    clientDetailHref(client.id, clientListHref(query))
  const columns = helper.columns([
    helper.accessor("name", {
      header: "Cliente",
      cell: (info) => (
        <Link
          href={href(info.row.original)}
          className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {info.getValue()}
        </Link>
      ),
      ...getDataTableColumnMeta("flexible", { priority: "critical" }),
    }),
    helper.display({
      id: "operations",
      header: "Operaciones",
      cell: (info) =>
        getClientOperations(info.row.original.id, operations).length,
      ...getDataTableColumnMeta("compact", {
        align: "right",
        priority: "high",
      }),
    }),
    helper.accessor("updatedOn", {
      header: "Actualización",
      cell: (info) => formatDate(info.getValue()),
      ...getDataTableColumnMeta("date"),
    }),
    helper.display({
      id: "open",
      header: "Acción",
      cell: (info) => (
        <Link
          href={href(info.row.original)}
          className="inline-flex min-h-9 items-center text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          Abrir ficha
        </Link>
      ),
      ...getDataTableColumnMeta("compact", { priority: "critical" }),
    }),
  ])
  return (
    <section aria-label="Clientes del escenario">
      <DataTableFrame className="hidden md:block">
        <DataTable
          caption="Clientes y operaciones relacionadas"
          columns={columns}
          data={[...clients].sort((a, b) =>
            a.name.localeCompare(b.name, "es-AR")
          )}
          getRowId={(client) => client.id}
        />
      </DataTableFrame>
      <ul
        aria-label="Clientes del escenario"
        className="divide-y divide-border md:hidden"
      >
        {[...clients]
          .sort((a, b) => a.name.localeCompare(b.name, "es-AR"))
          .map((client) => (
            <li
              key={client.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <h2 className="font-medium">{client.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {getClientOperations(client.id, operations).length}{" "}
                  operaciones
                </p>
              </div>
              <Link
                href={href(client)}
                className="inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                Abrir ficha
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}
