"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { formatDate } from "@workspace/ui/lib/date"
import { PageHeader } from "@/components/navigation/page-header"
import { useListContext } from "@/components/navigation/list-context"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import {
  money,
  isFinancialDate,
} from "@/features/finance/data/financial-records"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import {
  movementDirection,
  movementNatures,
} from "../data/administrative-ledger"
import { MovementEditor } from "./movement-editor"
import { AdministrationNav } from "./administration-nav"
export function MovementsPage() {
  const { state, ready } = useAdministrativeLedger()
  const { scenario } = useScenario()
  const { organizations } = useOrganizations()
  const params = useSearchParams()
  const [saved, setSaved] = useState("")
  const context =
    "/administracion/movimientos" + (params.size ? "?" + params : "")
  const capture = useListContext(ready, context)
  const query = params.get("q") ?? "",
    nature = params.get("naturaleza") ?? "",
    currency = params.get("moneda") ?? "",
    from = params.get("desde") ?? "",
    to = params.get("hasta") ?? "",
    party = params.get("contraparte") ?? ""
  const canIncome = hasCapability(scenario, "finance.collections"),
    canOutflow = hasCapability(scenario, "finance.treasury")
  const invalid =
    (from && !isFinancialDate(from)) ||
    (to && !isFinancialDate(to)) ||
    (from && to && from > to)
  function change(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (key !== "pagina") next.delete("pagina")
    if (value) next.set(key, value)
    else next.delete(key)
    window.history[key === "q" ? "replaceState" : "pushState"](
      null,
      "",
      "/administracion/movimientos" + (next.size ? "?" + next : "")
    )
  }
  if (!canIncome && !canOutflow)
    return (
      <p role="status">
        Los movimientos no están disponibles para tus capacidades.
      </p>
    )
  const rows = invalid
    ? []
    : state.movements
        .filter(
          (item) =>
            (movementDirection(item.nature) === "Ingreso"
              ? canIncome
              : canOutflow) &&
            (!nature || item.nature === nature) &&
            (!currency || item.currency === currency) &&
            (!from || item.date >= from) &&
            (!to || item.date <= to) &&
            (!party || item.partyId === party) &&
            (
              item.reference +
              " " +
              item.notes +
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
  return (
    <div className="space-y-4" onClickCapture={capture}>
      <PageHeader
        title="Ingresos y egresos"
        primaryAction={<MovementEditor onSaved={setSaved} />}
      />
      <AdministrationNav />
      <div className="flex flex-wrap items-end gap-3">
        <label className="w-full min-w-0 text-xs font-medium sm:w-auto sm:flex-1">
          Buscar movimiento
          <Input
            className="mt-1"
            value={query}
            onChange={(event) => change("q", event.target.value)}
            placeholder="Referencia, contraparte o concepto"
          />
        </label>
        <label className="text-xs font-medium">
          Naturaleza
          <select
            aria-label="Filtrar naturaleza"
            className="mt-1 block h-10 max-w-full rounded-md border border-input bg-background px-3 text-sm"
            value={nature}
            onChange={(event) => change("naturaleza", event.target.value)}
          >
            <option value="">Todas las autorizadas</option>
            {movementNatures
              .filter((item) =>
                movementDirection(item) === "Ingreso" ? canIncome : canOutflow
              )
              .map((item) => (
                <option key={item}>{item}</option>
              ))}
          </select>
        </label>
        <label className="text-xs font-medium">
          Moneda
          <select
            aria-label="Filtrar moneda"
            className="mt-1 block h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={currency}
            onChange={(event) => change("moneda", event.target.value)}
          >
            <option value="">Sin total combinado</option>
            <option>ARS</option>
            <option>USD</option>
          </select>
        </label>
      </div>
      <details className="rounded-md border border-border px-3 py-2">
        <summary className="cursor-pointer text-sm font-medium">
          Período del movimiento{from || to ? " · activo" : ""}
        </summary>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="text-xs font-medium">
            Movimiento desde
            <Input
              type="date"
              className="mt-1 w-auto"
              value={from}
              onChange={(event) => change("desde", event.target.value)}
            />
          </label>
          <label className="text-xs font-medium">
            Movimiento hasta
            <Input
              type="date"
              className="mt-1 w-auto"
              value={to}
              onChange={(event) => change("hasta", event.target.value)}
            />
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
              Quitar contraparte
            </button>
          )}
          <Link
            href="/administracion/movimientos"
            scroll={false}
            className="text-primary underline"
          >
            Limpiar filtros
          </Link>
        </div>
      )}
      {saved && (
        <p role="status" className="text-sm">
          Movimiento guardado.{" "}
          <Link
            href={
              "/administracion/movimientos/" +
              saved +
              "?returnTo=" +
              encodeURIComponent(context)
            }
            className="text-primary underline"
          >
            Abrir movimiento
          </Link>
        </p>
      )}
      {invalid ? (
        <p role="alert" className="text-sm text-destructive">
          Revisá el rango de fechas del movimiento; no se confirma un total.
        </p>
      ) : !ready ? (
        <p role="status">Preparando movimientos…</p>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <p role="status" className="tabular-nums">
              {rows.length} {rows.length === 1 ? "movimiento" : "movimientos"}
            </p>
            {pages > 1 ? (
              <span>
                {(page - 1) * 12 + 1}–{Math.min(page * 12, rows.length)} de{" "}
                {rows.length}
              </span>
            ) : null}
          </div>
          <ul
            aria-label="Movimientos autorizados"
            className="divide-y divide-border rounded-lg border border-border bg-card px-4"
          >
            {visibleRows.map((item) => (
              <li
                key={item.id}
                className="grid gap-2 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div>
                  <Link
                    href={
                      "/administracion/movimientos/" +
                      item.id +
                      "?returnTo=" +
                      encodeURIComponent(context)
                    }
                    className="font-medium text-primary underline"
                  >
                    {item.reference}
                  </Link>
                  <p className="mt-1">
                    {item.nature} · {movementDirection(item.nature)} ·{" "}
                    {formatDate(item.date)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {organizations.find((org) => org.id === item.partyId)
                      ?.name ?? "Sin contraparte comercial"}
                    {item.notes ? " · " + item.notes : ""}
                  </p>
                </div>
                <p className="font-mono font-medium">
                  {money(item.amount, item.currency)}
                </p>
              </li>
            ))}
            {!rows.length && (
              <li className="py-6 text-sm">
                Sin movimientos para estos filtros.
              </li>
            )}
          </ul>
        </>
      )}
      {!invalid && rows.length > 12 && (
        <nav
          aria-label="Paginación de movimientos"
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
