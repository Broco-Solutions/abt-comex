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
import { demonstrationClients } from "@/features/clients/data/clients"
import type { DemonstrationQuote } from "../types/quote"
import { getCurrentQuoteVersion } from "../data/quotes"

const helper = createColumnHelper<
  typeof dataTableFeatures,
  DemonstrationQuote
>()
export function QuoteTable({
  quotes,
  returnTo,
}: {
  quotes: DemonstrationQuote[]
  returnTo: string
}) {
  const href = (quote: DemonstrationQuote) =>
    `/cotizaciones/${quote.id}?returnTo=${encodeURIComponent(returnTo)}`
  const client = (quote: DemonstrationQuote) =>
    demonstrationClients.find((item) => item.id === quote.clientId)?.name ??
    "Sin cliente"
  const columns = helper.columns([
    helper.accessor("reference", {
      header: "Referencia",
      cell: (info) => (
        <Link
          href={href(info.row.original)}
          className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {info.getValue()}
        </Link>
      ),
      ...getDataTableColumnMeta("reference"),
    }),
    helper.display({
      id: "client",
      header: "Cliente",
      cell: (info) => (
        <span title={client(info.row.original)}>
          {client(info.row.original)}
        </span>
      ),
      ...getDataTableColumnMeta("flexible", { priority: "high" }),
    }),
    helper.display({
      id: "version",
      header: "Versión",
      cell: (info) => getCurrentQuoteVersion(info.row.original).number,
      ...getDataTableColumnMeta("compact"),
    }),
    helper.display({
      id: "approval",
      header: "Aprobación interna",
      cell: (info) =>
        getCurrentQuoteVersion(
          info.row.original
        ).workflow.internalApproval.replace(" simulada", ""),
      ...getDataTableColumnMeta("flexible", { priority: "high" }),
    }),
    helper.display({
      id: "send",
      header: "Envío",
      cell: (info) =>
        getCurrentQuoteVersion(info.row.original).workflow.send.replace(
          " simulado",
          ""
        ),
      ...getDataTableColumnMeta("flexible"),
    }),
    helper.display({
      id: "response",
      header: "Respuesta cliente",
      cell: (info) =>
        getCurrentQuoteVersion(info.row.original)
          .workflow.clientResponse.replace(" simulada", "")
          .replace(" simulado", ""),
      ...getDataTableColumnMeta("flexible", { priority: "high" }),
    }),
    helper.display({
      id: "updatedOn",
      header: "Actualización",
      cell: (info) =>
        formatDate(getCurrentQuoteVersion(info.row.original).updatedOn),
      ...getDataTableColumnMeta("date"),
    }),
  ])
  return (
    <section aria-label="Cotizaciones del escenario">
      <DataTableFrame className="hidden xl:block">
        <DataTable
          caption="Cotizaciones, versiones y eventos comerciales"
          columns={columns}
          data={[...quotes].sort(
            (a, b) =>
              getCurrentQuoteVersion(b).updatedOn.localeCompare(
                getCurrentQuoteVersion(a).updatedOn
              ) || a.reference.localeCompare(b.reference)
          )}
          getRowId={(quote) => quote.id}
        />
      </DataTableFrame>
      <ul
        aria-label="Cotizaciones del escenario"
        className="divide-y divide-border xl:hidden"
      >
        {quotes.map((quote) => {
          const version = getCurrentQuoteVersion(quote)
          return (
            <li key={quote.id} className="space-y-2 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={href(quote)}
                    className="font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {quote.reference}
                  </Link>
                  <p className="text-sm">{client(quote)}</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  v{version.number}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Aprobación interna
                  </dt>
                  <dd>
                    {version.workflow.internalApproval.replace(" simulada", "")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Respuesta cliente
                  </dt>
                  <dd>
                    {version.workflow.clientResponse
                      .replace(" simulada", "")
                      .replace(" simulado", "")}
                  </dd>
                </div>
              </dl>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {version.workflow.send.replace(" simulado", "")} ·{" "}
                  {formatDate(version.updatedOn)}
                </span>
                <Link
                  href={href(quote)}
                  className="inline-flex min-h-9 items-center font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  Abrir ficha
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
