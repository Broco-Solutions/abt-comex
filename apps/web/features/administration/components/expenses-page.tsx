"use client"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { Input } from "@workspace/ui/components/input"
import {
  DataTable,
  DataTableFrame,
  createColumnHelper,
  dataTableFeatures,
  getDataTableColumnMeta,
} from "@workspace/ui/components/data-table"
import { formatDate } from "@workspace/ui/lib/date"
import { PageHeader } from "@/components/navigation/page-header"
import { useListContext } from "@/components/navigation/list-context"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import {
  money,
  isFinancialDate,
} from "@/features/finance/data/financial-records"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import type { LocalExpense } from "../data/administrative-ledger"
import { ExpenseEditor } from "./expense-editor"
import { AdministrationNav } from "./administration-nav"
const helper = createColumnHelper<typeof dataTableFeatures, LocalExpense>()
export function ExpensesPage() {
  const { state, ready } = useAdministrativeLedger()
  const [saved, setSaved] = useState("")
  const { organizations } = useOrganizations()
  const { scenario } = useScenario()
  const params = useSearchParams()
  const capture = useListContext(
    ready,
    "/administracion/gastos?" + params.toString()
  )
  const query = params.get("q") ?? ""
  const category = params.get("categoria") ?? ""
  const party = params.get("contraparte") ?? ""
  const currency = params.get("moneda") ?? ""
  const pending = params.get("evidencia") === "pendiente"
  const from = params.get("desde") ?? ""
  const to = params.get("hasta") ?? ""
  const invalid =
    (Boolean(from) && !isFinancialDate(from)) ||
    (Boolean(to) && !isFinancialDate(to)) ||
    (from && to && from > to)
  function change(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (key !== "pagina") next.delete("pagina")
    if (value) next.set(key, value)
    else next.delete(key)
    window.history[key === "q" ? "replaceState" : "pushState"](
      null,
      "",
      "/administracion/gastos" + (next.size ? "?" + next : "")
    )
  }
  if (
    !hasCapability(scenario, "finance.expenses") ||
    !hasCapability(scenario, "costs.internal")
  )
    return (
      <p role="status">Los gastos no están disponibles para tus capacidades.</p>
    )
  const rows = invalid
    ? []
    : state.expenses
        .filter(
          (item) =>
            (!category || item.categoryId === category) &&
            (!currency || item.currency === currency) &&
            (!party || item.partyId === party) &&
            (!pending || !item.evidence.trim()) &&
            (!from || item.date >= from) &&
            (!to || item.date <= to) &&
            (
              item.reference +
              " " +
              item.description +
              " " +
              (organizations.find((org) => org.id === item.partyId)?.name ?? "")
            )
              .toLocaleLowerCase("es-AR")
              .includes(query.toLocaleLowerCase("es-AR"))
        )
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            a.reference.localeCompare(b.reference)
        )
  const pages = Math.max(1, Math.ceil(rows.length / 12))
  const requestedPage = Number(params.get("pagina"))
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(pages, requestedPage)
      : 1
  const visibleRows = rows.slice((page - 1) * 12, page * 12)
  const current = "/administracion/gastos" + (params.size ? "?" + params : "")
  const href = (item: LocalExpense) =>
    "/administracion/gastos/" +
    item.id +
    "?returnTo=" +
    encodeURIComponent(current)
  const columns = helper.columns([
    helper.accessor("reference", {
      header: "Referencia / concepto",
      cell: (info) => (
        <div>
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            href={href(info.row.original)}
          >
            {info.getValue()}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            {info.row.original.description}
          </p>
        </div>
      ),
      ...getDataTableColumnMeta("flexible", { priority: "critical" }),
    }),
    helper.accessor("partyId", {
      header: "Proveedor ABT",
      cell: (info) =>
        organizations.find((item) => item.id === info.getValue())?.name ??
        "Sin identificar",
      ...getDataTableColumnMeta("flexible", { priority: "high" }),
    }),
    helper.accessor("date", {
      header: "Registro",
      cell: (info) => formatDate(info.getValue()),
      ...getDataTableColumnMeta("date"),
    }),
    helper.accessor("categoryId", {
      header: "Categoría",
      cell: (info) =>
        state.categories.find((item) => item.id === info.getValue())?.name ??
        info.row.original.categoryAtEntry,
      ...getDataTableColumnMeta("flexible"),
    }),
    helper.accessor("amount", {
      header: "Importe / moneda",
      cell: (info) => money(info.getValue(), info.row.original.currency),
      ...getDataTableColumnMeta("compact"),
    }),
    helper.accessor("evidence", {
      header: "Evidencia",
      cell: (info) =>
        info.getValue().trim() ? "Referencia preparada" : "Pendiente",
      ...getDataTableColumnMeta("status"),
    }),
  ])
  return (
    <div className="space-y-4" onClickCapture={capture}>
      <PageHeader
        title="Gastos"
        primaryAction={<ExpenseEditor onSaved={setSaved} />}
      />
      <AdministrationNav />
      {saved && (
        <p role="status" className="text-sm">
          Gasto guardado.{" "}
          <Link
            className="text-primary underline"
            href={
              "/administracion/gastos/" +
              saved +
              "?returnTo=" +
              encodeURIComponent(current)
            }
          >
            Abrir gasto
          </Link>
        </p>
      )}
      <div className="flex flex-wrap items-end gap-3">
        <label className="w-full min-w-0 text-xs font-medium sm:w-auto sm:flex-1">
          Buscar gasto
          <Input
            className="mt-1"
            value={query}
            onChange={(event) => change("q", event.target.value)}
            placeholder="Referencia, concepto o proveedor"
          />
        </label>
        <label className="text-xs font-medium">
          Categoría
          <select
            aria-label="Filtrar categoría"
            className="mt-1 block h-10 max-w-full rounded-md border border-input bg-background px-3 text-sm"
            value={category}
            onChange={(event) => change("categoria", event.target.value)}
          >
            <option value="">Todas</option>
            {state.categories
              .filter(
                (item) => item.scope === "Gasto" || item.scope === "Compartida"
              )
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                  {item.active ? "" : " · Inactiva"}
                </option>
              ))}
          </select>
        </label>
        <Link
          href="/administracion/categorias"
          className="inline-flex min-h-10 items-center text-sm font-medium text-primary underline"
        >
          Categorías
        </Link>
      </div>
      <details className="rounded-md border border-border px-3 py-2">
        <summary className="cursor-pointer text-sm font-medium">
          Más filtros
          {from || to || party || pending || currency ? " · activos" : ""}
        </summary>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <SearchableCombobox
            label="Proveedor ABT"
            value={party}
            onChange={(value) => change("contraparte", value)}
            options={[
              { value: "", label: "Todos los proveedores" },
              ...organizations
                .filter((item) =>
                  item.roles.some((role) => role.role === "abt-supplier")
                )
                .map((item) => ({ value: item.id, label: item.name })),
            ]}
          />
          <label className="text-xs font-medium">
            Moneda
            <select
              aria-label="Moneda de gastos"
              className="mt-1 block h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={currency}
              onChange={(event) => change("moneda", event.target.value)}
            >
              <option value="">Todas · sin conversión</option>
              <option>ARS</option>
              <option>USD</option>
            </select>
          </label>
          <label className="text-xs font-medium">
            Registro desde
            <Input
              type="date"
              value={from}
              onChange={(event) => change("desde", event.target.value)}
              className="mt-1 w-auto"
            />
          </label>
          <label className="text-xs font-medium">
            Registro hasta
            <Input
              type="date"
              value={to}
              onChange={(event) => change("hasta", event.target.value)}
              className="mt-1 w-auto"
            />
          </label>
          <label className="flex min-h-10 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={pending}
              onChange={(event) =>
                change("evidencia", event.target.checked ? "pendiente" : "")
              }
            />
            Evidencia pendiente
          </label>
        </div>
      </details>
      {params.size > 0 && (
        <div className="flex flex-wrap gap-3 text-xs">
          {party && (
            <button
              className="text-primary underline"
              onClick={() => change("contraparte", "")}
            >
              Quitar proveedor:{" "}
              {organizations.find((item) => item.id === party)?.name ??
                "Referencia"}
            </button>
          )}
          <Link
            href="/administracion/gastos"
            scroll={false}
            className="text-primary underline"
          >
            Limpiar filtros
          </Link>
        </div>
      )}
      {invalid ? (
        <p role="alert" className="text-sm text-destructive">
          Revisá las fechas de registro; el rango no es válido. No se confirma
          un total.
        </p>
      ) : !ready ? (
        <p role="status">Preparando gastos…</p>
      ) : (
        <>
          <p role="status" className="text-sm text-muted-foreground">
            {rows.length} gastos · importes sin conversión de moneda
          </p>
          {rows.length ? (
            <>
              <div className="hidden xl:block">
                <DataTableFrame>
                  <DataTable
                    columns={columns}
                    data={visibleRows}
                    getRowId={(item) => item.id}
                    caption="Gastos registrados localmente, no pagos"
                  />
                </DataTableFrame>
              </div>
              <ul
                aria-label="Gastos registrados"
                className="divide-y divide-border xl:hidden"
              >
                {visibleRows.map((item) => (
                  <li key={item.id} className="grid gap-2 py-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={href(item)}
                        className="font-medium text-primary underline"
                      >
                        {item.reference}
                      </Link>
                      <span className="shrink-0 font-mono">
                        {money(item.amount, item.currency)}
                      </span>
                    </div>
                    <p>{item.description}</p>
                    <p className="text-muted-foreground">
                      {organizations.find((org) => org.id === item.partyId)
                        ?.name ?? "Sin proveedor identificado"}{" "}
                      · {formatDate(item.date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.evidence.trim()
                        ? "Referencia de evidencia preparada"
                        : "Evidencia pendiente"}{" "}
                      ·{" "}
                      {item.operationIds.length
                        ? item.operationIds.length + " operaciones relacionadas"
                        : "Gasto general"}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="py-6 text-sm">
              Sin gastos para estos filtros. Limpiá la búsqueda o prepará un
              registro.
            </p>
          )}
        </>
      )}
      {!invalid && rows.length > 12 && (
        <nav
          aria-label="Paginación de gastos"
          className="flex items-center justify-between gap-3 border-t border-border pt-3 text-sm"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => change("pagina", String(page - 1))}
          >
            Anterior
          </Button>
          <span>
            Página {page} de {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => change("pagina", String(page + 1))}
          >
            Siguiente
          </Button>
        </nav>
      )}
    </div>
  )
}
