"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { formatDate } from "@workspace/ui/lib/date"
import { PageHeader } from "@/components/navigation/page-header"
import { useListContext } from "@/components/navigation/list-context"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import {
  money,
  isFinancialDate,
  type Currency,
} from "@/features/finance/data/financial-records"
import { useVouchers } from "../state/use-vouchers"
import { portfolio } from "../data/vouchers"
import { AdministrationNav } from "./administration-nav"
import { VoucherEditor, canReadVoucher } from "./voucher-editor"
export function VoucherList({ cartera = false }: { cartera?: boolean }) {
  const { state, ready } = useVouchers()
  const { scenario } = useScenario()
  const { organizations } = useOrganizations()
  const [query, setQuery] = useState("")
  const [saved, setSaved] = useState("")
  useEffect(() => {
    const sync = () => setQuery(window.location.search)
    sync()
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [])
  const params = new URLSearchParams(query)
  const path = "/administracion/" + (cartera ? "carteras" : "comprobantes")
  const self = path + query
  const remember = useListContext(ready, self)
  const receivables =
    hasCapability(
      scenario,
      cartera ? "finance.collections" : "finance.billing"
    ) ||
    (!cartera && hasCapability(scenario, "finance.collections"))
  const payables = hasCapability(scenario, "finance.treasury")
  const side =
    params.get("cartera") === "pagar" || !receivables ? "Pagar" : "Cobrar"
  const allowed = side === "Cobrar" ? receivables : payables
  const currency: Currency = params.get("moneda") === "USD" ? "USD" : "ARS"
  const cut = params.get("corte") ?? DEMONSTRATION_DATE
  const invalidCut = !isFinancialDate(cut) || cut > DEMONSTRATION_DATE
  const q = params.get("q")?.toLocaleLowerCase("es-AR") ?? ""
  const party = params.get("contraparte") ?? ""
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(query)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete("pagina")
    const url = next.size ? "?" + next : ""
    window.history[key === "q" ? "replaceState" : "pushState"](
      null,
      "",
      path + url
    )
    setQuery(url)
  }
  const all = allowed
    ? (cartera
        ? portfolio(state, side, cut, currency, party).map((item) => ({
            ...item.document,
            balance: item.balance,
          }))
        : state.documents
            .filter(
              (item) =>
                canReadVoucher(scenario, item) &&
                item.side === side &&
                item.currency === currency &&
                (!party || item.partyId === party)
            )
            .map((item) => ({
              ...item,
              balance: undefined as number | undefined,
            }))
      ).filter(
        (item) =>
          (
            item.reference +
            " " +
            item.concept +
            " " +
            (organizations.find((org) => org.id === item.partyId)?.name ?? "")
          )
            .toLocaleLowerCase("es-AR")
            .includes(q) &&
          (!params.get("situacion") ||
            (params.get("situacion") === "vencido"
              ? !!item.dueOn && item.dueOn < cut
              : params.get("situacion") === "sin-saldo"
                ? item.balance === undefined
                : item.stage === params.get("situacion")))
      )
    : []
  all.sort(
    (a, b) =>
      (a.dueOn || "9999").localeCompare(b.dueOn || "9999") ||
      a.reference.localeCompare(b.reference)
  )
  const rawPage = Number(params.get("pagina") ?? 1),
    pages = Math.max(1, Math.ceil(all.length / 12)),
    page = Number.isSafeInteger(rawPage)
      ? Math.max(1, Math.min(pages, rawPage))
      : 1
  const records = all.slice((page - 1) * 12, page * 12)
  const pageTo = (next: number) => {
    const p = new URLSearchParams(query)
    p.set("pagina", String(next))
    const url = "?" + p
    window.history.pushState(null, "", path + url)
    setQuery(url)
  }
  const total =
    all.reduce((sum, item) => sum + Math.round((item.balance ?? 0) * 100), 0) /
    100
  if (!receivables && !payables)
    return (
      <p role="status">
        Esta perspectiva no tiene acceso a comprobantes ni carteras.
      </p>
    )
  return (
    <div className="space-y-5" onClickCapture={remember}>
      <PageHeader
        title={cartera ? "Cuentas por cobrar y pagar" : "Comprobantes"}
        primaryAction={
          !cartera && allowed ? (
            <VoucherEditor key={side} side={side} onSaved={setSaved} />
          ) : undefined
        }
      />
      <AdministrationNav />
      <form
        aria-label="Filtros de comprobantes"
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-muted/40 p-3"
      >
        <label className="w-full text-xs font-medium sm:w-auto sm:flex-1">
          Buscar referencia o contraparte
          <Input
            value={params.get("q") ?? ""}
            onChange={(event) => update("q", event.target.value)}
          />
        </label>
        <label className="text-xs font-medium">
          Cartera
          <select
            aria-label="Cartera"
            className="mt-1 block h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={side}
            onChange={(event) =>
              update(
                "cartera",
                event.target.value === "Pagar" ? "pagar" : "cobrar"
              )
            }
          >
            {receivables && <option>Cobrar</option>}
            {payables && <option>Pagar</option>}
          </select>
        </label>
        <label className="text-xs font-medium">
          Moneda
          <select
            className="mt-1 block h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={currency}
            onChange={(event) => update("moneda", event.target.value)}
          >
            <option>ARS</option>
            <option>USD</option>
          </select>
        </label>
        {cartera && (
          <label className="text-xs font-medium">
            Fecha de corte
            <Input
              type="date"
              max={DEMONSTRATION_DATE}
              value={cut}
              onChange={(event) => update("corte", event.target.value)}
            />
          </label>
        )}
        <details className="w-full">
          <summary className="w-fit cursor-pointer text-sm font-medium text-primary">
            Más filtros{party || params.get("situacion") ? " · activos" : ""}
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <SearchableCombobox
              label="Contraparte"
              value={party}
              onChange={(value) => update("contraparte", value)}
              options={[
                { value: "", label: "Todas las autorizadas" },
                ...organizations
                  .filter((item) =>
                    item.roles.some(
                      (role) =>
                        role.role ===
                        (side === "Cobrar" ? "client" : "abt-supplier")
                    )
                  )
                  .map((item) => ({ value: item.id, label: item.name })),
              ]}
            />
            <label className="text-xs font-medium">
              Situación
              <select
                className="mt-1 block h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={params.get("situacion") ?? ""}
                onChange={(event) => update("situacion", event.target.value)}
              >
                <option value="">Todas</option>
                {cartera ? (
                  <>
                    <option value="vencido">Vencidas al corte</option>
                    <option value="sin-saldo">Sin saldo disponible</option>
                  </>
                ) : (
                  <>
                    <option>Preparado</option>
                    <option>Referencia de evaluación</option>
                  </>
                )}
              </select>
            </label>
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => {
                window.history.pushState(null, "", path)
                setQuery("")
              }}
            >
              Restablecer vista
            </Button>
          </div>
        </details>
      </form>
      {saved && (
        <p role="status" className="text-sm">
          Comprobante guardado.{" "}
          <Link
            className="text-primary underline"
            href={
              "/administracion/comprobantes/" +
              saved +
              "?returnTo=" +
              encodeURIComponent(self)
            }
          >
            Abrir comprobante
          </Link>
        </p>
      )}
      {cartera && !invalidCut && (
        <section
          className="flex flex-wrap gap-5 rounded-lg border border-border bg-accent/40 p-4"
          aria-label="Resumen de cartera"
        >
          <div>
            <p className="text-xs text-muted-foreground">
              Saldo conocido del escenario al {formatDate(cut)}
            </p>
            <p className="font-mono text-xl font-semibold">
              {money(total, currency)}
            </p>
          </div>
          <p className="self-center text-sm">
            {all.filter((item) => item.balance === undefined).length}{" "}
            comprobantes sin saldo disponible
          </p>
          <p className="w-full text-xs text-muted-foreground">
            Incluye obligaciones anteriores abiertas al corte, sin filtro por
            emisión. Las notas de crédito y fondos sin aplicación no se
            descuentan automáticamente.
          </p>
        </section>
      )}
      {cartera && invalidCut ? (
        <p role="alert">
          Elegí un corte válido hasta {formatDate(DEMONSTRATION_DATE)}. No se
          confirman importes.
        </p>
      ) : (
        <>
          <p role="status" className="text-xs text-muted-foreground">
            {all.length} registros · {currency} · página {page} de {pages}
          </p>
          <ul
            aria-label={
              cartera ? "Obligaciones de cartera" : "Comprobantes disponibles"
            }
            className="divide-y divide-border rounded-lg border border-border bg-card px-4"
          >
            {records.map((item) => (
              <li
                key={item.id}
                className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="space-y-1">
                  <Link
                    scroll={false}
                    className="font-semibold text-primary underline"
                    href={
                      "/administracion/comprobantes/" +
                      item.id +
                      "?returnTo=" +
                      encodeURIComponent(self)
                    }
                  >
                    {item.reference}
                  </Link>
                  <p className="text-sm">
                    {organizations.find((org) => org.id === item.partyId)
                      ?.name ?? "Contraparte no disponible"}{" "}
                    · {item.kind}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Emisión {formatDate(item.issuedOn)}
                    {item.dueOn
                      ? " · Vencimiento " + formatDate(item.dueOn)
                      : " · Sin vencimiento"}{" "}
                    · {item.stage}
                  </p>
                  {cartera && item.dueOn && item.dueOn < cut && (
                    <p className="text-xs font-semibold text-foreground">
                      Vencida al corte
                    </p>
                  )}
                </div>
                <div className="text-sm sm:text-right">
                  <p className="font-mono font-medium">
                    {cartera
                      ? item.balance === undefined
                        ? "Saldo no disponible"
                        : money(item.balance, currency)
                      : money(item.amount, currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cartera ? "Saldo del escenario" : "Importe original"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {!all.length && (
            <p role="status">
              Sin registros para esta vista. Podés quitar filtros o cambiar la
              moneda.
            </p>
          )}
          {pages > 1 && (
            <nav
              className="flex items-center justify-end gap-2"
              aria-label="Páginas de comprobantes"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => pageTo(page - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pages}
                onClick={() => pageTo(page + 1)}
              >
                Siguiente
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
