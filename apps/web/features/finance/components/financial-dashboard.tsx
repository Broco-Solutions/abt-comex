"use client"
import Link from "next/link"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { formatDate } from "@workspace/ui/lib/date"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { projectClients } from "@/features/organizations/data/organizations"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { BillingChart, DistributionChart, type Drill } from "./financial-charts"
import {
  FINANCIAL_CUTOFF,
  isFinancialDate,
  buckets,
  filterFinancialRecords,
  money,
  receivableBand,
  type FinancialRecord,
  type FinancialFilters,
} from "../data/financial-records"

export function FinancialDashboard({
  executive = false,
  searchParams = {},
}: {
  executive?: boolean
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const params = new URLSearchParams(
    Object.entries(searchParams).flatMap(([key, value]) =>
      typeof value === "string" ? [[key, value]] : []
    )
  )
  const { scenario } = useScenario()
  const path = executive ? "/gestion" : "/administracion/finanzas"
  const { organizations } = useOrganizations()
  const demonstrationClients = projectClients(organizations)
  const from = params.get("desde") ?? "2026-05-01"
  const to = params.get("hasta") ?? FINANCIAL_CUTOFF
  const periodError =
    !isFinancialDate(from) || !isFinancialDate(to)
      ? "El período contiene una fecha inválida. Volvé a seleccionar Desde y Hasta; no se confirman importes ni conteos."
      : from > to
        ? "La fecha Desde debe ser anterior o igual a Hasta. Corregí el rango; no se confirman importes ni conteos."
        : ""
  const currency = params.get("moneda") === "USD" ? "USD" : "ARS"
  const clientId = demonstrationClients.some(
    (c) => c.id === params.get("cliente")
  )
    ? params.get("cliente")!
    : ""
  const filters: FinancialFilters = { currency, from, to, clientId }
  const base = new URLSearchParams({ desde: from, hasta: to, moneda: currency })
  if (clientId) base.set("cliente", clientId)
  const drill: Drill = (type, dimension, key) => {
    const next = new URLSearchParams(base)
    next.set("serie", type)
    next.set("dimension", dimension)
    next.set("grupo", key)
    return `${path}?${next.toString()}#registros`
  }
  if (!scenario.financial || (executive && !scenario.executive))
    return (
      <p role="status">No hay información disponible para esta perspectiva.</p>
    )
  if (params.get("error"))
    return (
      <section
        role="alert"
        className="space-y-3 border-l-2 border-warning pl-4"
      >
        <h2 className="font-semibold">Análisis no disponible</h2>
        <p className="text-sm">
          No se confirman importes ni conteos. Los filtros se conservan.
        </p>
        <Link
          href={`${path}?${base}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Reintentar análisis
        </Link>
      </section>
    )
  const records = periodError ? [] : filterFinancialRecords(filters)
  const invoices = records.filter((r) => r.type === "invoice")
  const type = params.get("serie")
  const dimension = params.get("dimension")
  const key = params.get("grupo")
  const selected = records.filter(
    (r) =>
      r.type === type &&
      (dimension === "month"
        ? r.date.startsWith(key ?? "!")
        : dimension === "client"
          ? r.clientId === key
          : dimension === "category"
            ? r.category === key
            : dimension === "due"
              ? r.openBalance !== undefined &&
                r.openBalance > 0 &&
                receivableBand(r) === key
              : dimension === "all")
  )
  const missing = invoices.filter((r) => r.openBalance === undefined).length
  return (
    <div className="space-y-6">
      <form
        key={base.toString()}
        action={path}
        method="get"
        aria-label="Filtros del análisis"
        className="flex flex-wrap items-end gap-3 border-b border-border pb-4"
      >
        <label className="text-xs font-medium">
          Desde · fecha del evento
          <Input
            name="desde"
            type="date"
            defaultValue={isFinancialDate(from) ? from : ""}
            aria-invalid={!isFinancialDate(from) || from > to}
            aria-describedby={
              periodError ? "financial-period-error" : undefined
            }
            max={FINANCIAL_CUTOFF}
            className="mt-1 w-auto"
          />
        </label>
        <label className="text-xs font-medium">
          Hasta · fecha del evento
          <Input
            name="hasta"
            type="date"
            defaultValue={isFinancialDate(to) ? to : ""}
            aria-invalid={!isFinancialDate(to) || from > to}
            aria-describedby={
              periodError ? "financial-period-error" : undefined
            }
            max={FINANCIAL_CUTOFF}
            className="mt-1 w-auto"
          />
        </label>
        <label className="text-xs font-medium">
          Moneda
          <select
            name="moneda"
            aria-label="Moneda"
            defaultValue={currency}
            className="mt-1 block h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>ARS</option>
            <option>USD</option>
          </select>
        </label>
        <label className="text-xs font-medium">
          Cliente
          <select
            name="cliente"
            aria-label="Cliente"
            defaultValue={clientId}
            className="mt-1 block h-9 max-w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todos los autorizados</option>
            {demonstrationClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" size="sm">
          Aplicar análisis
        </Button>
        <Link
          href={path}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Restablecer
        </Link>
      </form>
      {periodError ? (
        <p
          id="financial-period-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {periodError}
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Período {formatDate(from)}–{formatDate(to)} · {currency} ·
            actualización y corte {formatDate(FINANCIAL_CUTOFF)}. Fuentes
            externas no conectadas.
          </p>
          {executive ? (
            <>
              <BillingChart
                records={records}
                currency={currency}
                drill={drill}
              />
              <DistributionChart
                id="client-billing-chart"
                title="Facturación por cliente"
                data={buckets(invoices, "client")}
                currency={currency}
                href={(key) => drill("invoice", "client", key)}
              />
            </>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              <DistributionChart
                id="expense-chart"
                title="Gastos registrados por categoría"
                data={buckets(
                  records.filter((r) => r.type === "expense"),
                  "category"
                )}
                currency={currency}
                href={(key) => drill("expense", "category", key)}
              />
              <div className="min-w-0">
                <DistributionChart
                  id="due-chart"
                  title="Cuentas por cobrar · saldo informado al corte"
                  data={buckets(invoices, "due")}
                  currency={currency}
                  href={(key) => drill("invoice", "due", key)}
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  Facturas del período seleccionado; saldos informados al{" "}
                  {formatDate(FINANCIAL_CUTOFF)}. Tramos temporales, no
                  calificación de riesgo.{" "}
                  {missing
                    ? `${missing} factura sin saldo informado; no se interpreta como cero.`
                    : "No incluye documentos sin saldo informado."}
                </p>
              </div>
            </div>
          )}
          <nav
            aria-label="Consultar registros financieros"
            className="flex flex-wrap gap-2"
          >
            {(["invoice", "receipt", "expense"] as const).map((value) => (
              <Link
                key={value}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
                href={`${path}?${base}&serie=${value}&dimension=all#registros`}
              >
                {value === "invoice"
                  ? "Ver facturas"
                  : value === "receipt"
                    ? "Ver cobros"
                    : "Ver gastos"}
              </Link>
            ))}
          </nav>
          {type ? (
            <section
              id="registros"
              tabIndex={-1}
              className="scroll-mt-4 space-y-3 border-t border-border pt-4"
              aria-labelledby="financial-records-title"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2
                  id="financial-records-title"
                  className="text-base font-semibold"
                >
                  Registros explicativos
                </h2>
                <Link
                  href={`${path}?${base}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  Volver al análisis
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                {type === "invoice"
                  ? "Facturas"
                  : type === "receipt"
                    ? "Cobros registrados"
                    : "Gastos registrados"}{" "}
                · {key ?? "Período seleccionado"} · {selected.length} registros
                · {currency}
              </p>
              {selected.length ? (
                <FinancialRecords
                  records={selected}
                  balance={dimension === "due"}
                  returnTo={`${path}?${params.toString()}#registros`}
                />
              ) : (
                <p role="status" className="text-sm">
                  Sin registros para esta selección. No se infieren importes.
                </p>
              )}
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}

function FinancialRecords({
  records,
  balance,
  returnTo,
}: {
  records: FinancialRecord[]
  balance: boolean
  returnTo: string
}) {
  const { organizations } = useOrganizations()
  const demonstrationClients = projectClients(organizations)
  return (
    <ul
      className="divide-y divide-border"
      aria-label="Registros financieros seleccionados"
    >
      {records.map((record) => (
        <li
          key={record.id}
          className="grid gap-2 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div>
            <p className="font-medium">{record.reference}</p>
            <p className="mt-1 text-muted-foreground">
              {demonstrationClients.find((c) => c.id === record.clientId)?.name}{" "}
              ·{" "}
              {record.type === "invoice"
                ? "Factura"
                : record.type === "receipt"
                  ? "Cobro"
                  : "Gasto"}{" "}
              {formatDate(record.date)}
            </p>
            {record.dueDate ? (
              <p className="text-xs text-muted-foreground">
                Vencimiento {formatDate(record.dueDate)}
              </p>
            ) : null}
            {record.operationId ? (
              <Link
                className="text-primary underline underline-offset-4"
                href={`/operaciones/${record.operationId}?returnTo=${encodeURIComponent(returnTo)}`}
              >
                Abrir operación
              </Link>
            ) : null}
          </div>
          <p className="font-mono font-medium">
            {money(
              balance ? record.openBalance! : record.amount,
              record.currency
            )}
            {balance ? (
              <span className="block font-sans text-xs font-normal text-muted-foreground">
                Saldo informado
              </span>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  )
}
