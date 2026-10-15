"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { formatDate } from "@workspace/ui/lib/date"
import { PageHeader } from "@/components/navigation/page-header"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { money } from "@/features/finance/data/financial-records"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { useVouchers } from "../state/use-vouchers"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import { nextAdministrativeId } from "../data/administrative-ledger"
import {
  loadVouchers,
  saveVouchers,
  voucherBalance,
  originAvailable,
  validateApplication,
  type VoucherApplication,
} from "../data/vouchers"
import { administrativeReturn } from "../data/navigation"
import { AdministrationNav } from "./administration-nav"
import { VoucherEditor, canReadVoucher } from "./voucher-editor"
export function VoucherDetail({
  id,
  returnTo = "",
}: {
  id: string
  returnTo?: string
}) {
  const { state, ready } = useVouchers()
  const { state: ledger } = useAdministrativeLedger()
  const { organizations } = useOrganizations()
  const { operations } = useDemoOperations()
  const { scenario } = useScenario()
  const [origin, setOrigin] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(DEMONSTRATION_DATE)
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState("")
  const document = state.documents.find((item) => item.id === id)
  const back = administrativeReturn(returnTo, "/administracion/comprobantes")
  if (!ready) return <p role="status">Preparando comprobante…</p>
  if (!document || !canReadVoucher(scenario, document))
    return <p role="status">Comprobante no disponible para esta perspectiva.</p>
  const canApply = hasCapability(
    scenario,
    document.side === "Cobrar" ? "finance.collections" : "finance.treasury"
  )
  const canPrepare = canApply && hasCapability(scenario, "finance.prepare")
  const balance = canApply ? voucherBalance(document, state) : undefined
  const self = "/administracion/comprobantes/" + id
  const party = organizations.find((item) => item.id === document.partyId)
  const apps = canApply
    ? state.applications.filter((item) => item.voucherId === id)
    : []
  const sources = [
    ...ledger.movements
      .filter(
        (item) =>
          item.nature === (document.side === "Cobrar" ? "Cobro" : "Pago") &&
          item.partyId === document.partyId &&
          item.currency === document.currency
      )
      .map((item) => ({ origin: "movement" as const, item })),
    ...state.documents
      .filter(
        (item) =>
          item.kind === "Nota de crédito" &&
          item.id !== id &&
          item.side === document.side &&
          item.partyId === document.partyId &&
          item.currency === document.currency &&
          item.stage === "Referencia de evaluación"
      )
      .map((item) => ({ origin: "credit" as const, item })),
  ].filter(
    (item) => originAvailable(item.origin, item.item.id, state, ledger) > 0
  )
  return (
    <div className="max-w-5xl space-y-5">
      <Link
        scroll={false}
        className="text-sm text-primary underline"
        href={back.href}
      >
        {back.label}
      </Link>
      <PageHeader
        title={document.reference}
        primaryAction={<VoucherEditor document={document} />}
      />
      <AdministrationNav />
      <section
        className="grid gap-4 rounded-lg border border-border bg-accent/40 p-4 sm:grid-cols-2"
        aria-label="Identidad del comprobante"
      >
        <div>
          <h2 className="font-semibold">
            {document.kind} ·{" "}
            {document.side === "Cobrar" ? "Cliente" : "Proveedor"}
          </h2>
          <p className="mt-2 text-sm">{document.concept}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {document.stage} · Sin conexión externa
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Importe original</p>
          <p className="font-mono text-xl font-semibold">
            {money(document.amount, document.currency)}
          </p>
          {canApply && (
            <p className="mt-2 text-sm">
              {document.kind === "Nota de crédito"
                ? "Crédito sin aplicar: " +
                  money(
                    originAvailable("credit", id, state, ledger),
                    document.currency
                  )
                : balance === undefined
                  ? "Saldo no disponible"
                  : "Saldo del escenario: " + money(balance, document.currency)}
            </p>
          )}
        </div>
      </section>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Contraparte</dt>
          <dd className="mt-1">
            {party ? (
              <Link
                className="font-medium text-primary underline"
                href={
                  (document.side === "Cobrar"
                    ? "/clientes/"
                    : "/proveedores/") +
                  party.id +
                  "?returnTo=" +
                  encodeURIComponent(self)
                }
              >
                {party.name}
              </Link>
            ) : (
              "Referencia pendiente"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Fechas</dt>
          <dd className="mt-1">
            Emisión {formatDate(document.issuedOn)} ·{" "}
            {document.dueOn
              ? "Vencimiento " + formatDate(document.dueOn)
              : "Sin vencimiento informado"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Referencia externa</dt>
          <dd className="mt-1">
            {document.externalReference
              ? document.externalReference + " · por verificar"
              : "Sin vincular a Alpha2000"}
          </dd>
        </div>
        {canApply && (
          <div>
            <dt className="text-xs text-muted-foreground">
              Saldo informado de referencia
            </dt>
            <dd className="mt-1">
              {document.reportedBalance === undefined
                ? "No disponible; no equivale a cero."
                : money(document.reportedBalance, document.currency) +
                  " al " +
                  formatDate(document.reportedOn ?? DEMONSTRATION_DATE)}
            </dd>
            <dd className="mt-1 text-xs text-muted-foreground">
              Dato sintético de origen, separado de las aplicaciones locales.
            </dd>
          </div>
        )}
      </dl>
      {!!document.operationIds.length && (
        <section className="space-y-2">
          <h2 className="font-semibold">Operaciones relacionadas</h2>
          <ul className="space-y-2 text-sm">
            {document.operationIds.map((operationId) => (
              <li key={operationId}>
                <Link
                  className="text-primary underline"
                  href={
                    "/operaciones/" +
                    operationId +
                    "?returnTo=" +
                    encodeURIComponent(self)
                  }
                >
                  {operations.find((item) => item.id === operationId)
                    ?.reference ?? "Referencia pendiente"}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {canApply && (
        <section
          className="space-y-3 border-t border-border pt-4"
          aria-labelledby="voucher-applications"
        >
          <h2 id="voucher-applications" className="font-semibold">
            Aplicaciones
          </h2>
          <ul
            aria-label="Aplicaciones del comprobante"
            className="divide-y divide-border"
          >
            {apps.map((app) => (
              <li
                key={app.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <Link
                    className="text-primary underline"
                    href={
                      (app.origin === "credit"
                        ? "/administracion/comprobantes/"
                        : "/administracion/movimientos/") +
                      app.originId +
                      "?returnTo=" +
                      encodeURIComponent(self)
                    }
                  >
                    {app.origin === "credit"
                      ? state.documents.find((item) => item.id === app.originId)
                          ?.reference
                      : ledger.movements.find(
                          (item) => item.id === app.originId
                        )?.reference}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Aplicación {formatDate(app.date)} ·{" "}
                    {app.local
                      ? "Preparación local"
                      : "Referencia del escenario"}
                  </p>
                </div>
                <span className="font-mono">
                  {money(app.amount, document.currency)}
                </span>
              </li>
            ))}
          </ul>
          {!apps.length && (
            <p className="text-sm text-muted-foreground">
              Sin aplicaciones relacionadas. Un movimiento sin aplicar no reduce
              este saldo.
            </p>
          )}
          {document.kind === "Nota de crédito" && (
            <ul className="space-y-2 text-sm" aria-label="Destino del crédito">
              {state.applications
                .filter(
                  (item) => item.origin === "credit" && item.originId === id
                )
                .map((app) => (
                  <li key={app.id}>
                    <Link
                      className="text-primary underline"
                      href={
                        "/administracion/comprobantes/" +
                        app.voucherId +
                        "?returnTo=" +
                        encodeURIComponent(self)
                      }
                    >
                      {
                        state.documents.find(
                          (item) => item.id === app.voucherId
                        )?.reference
                      }
                    </Link>{" "}
                    · {money(app.amount, document.currency)} ·{" "}
                    {formatDate(app.date)}
                  </li>
                ))}
            </ul>
          )}
          {canPrepare && balance !== undefined && balance > 0 && (
            <details className="rounded-lg border border-border p-4">
              <summary className="w-fit cursor-pointer font-medium text-primary">
                Preparar aplicación
              </summary>
              <form
                className="mt-4 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  const current = loadVouchers()
                  const selected = sources.find(
                    (item) => item.origin + ":" + item.item.id === origin
                  )
                  if (!selected) {
                    setError("Elegí un cobro, pago o crédito disponible.")
                    return
                  }
                  const app: VoucherApplication = {
                    id: nextAdministrativeId(
                      "application-local-",
                      current.applications.map((item) => item.id)
                    ),
                    voucherId: id,
                    origin: selected.origin,
                    originId: selected.item.id,
                    amount: Number(amount),
                    date,
                    local: true,
                  }
                  const problem = validateApplication(app, current, ledger)
                  if (problem) {
                    setError(problem)
                    return
                  }
                  saveVouchers({
                    ...current,
                    applications: [...current.applications, app],
                    activity: [
                      ...current.activity,
                      {
                        entityId: id,
                        on: DEMONSTRATION_DATE,
                        description: "Aplicación preparada localmente",
                      },
                    ],
                  })
                  setError("")
                  setOrigin("")
                  setAmount("")
                  setFeedback(
                    "Aplicación preparada. El saldo del escenario se actualizó; no se registró en Alpha2000."
                  )
                }}
              >
                <SearchableCombobox
                  label="Cobro, pago o crédito disponible"
                  value={origin}
                  onChange={setOrigin}
                  options={sources.map((item) => ({
                    value: item.origin + ":" + item.item.id,
                    label: item.item.reference,
                    description: money(
                      originAvailable(item.origin, item.item.id, state, ledger),
                      document.currency
                    ),
                  }))}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    Importe a aplicar
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                    />
                  </label>
                  <label className="text-sm">
                    Fecha de aplicación
                    <Input
                      type="date"
                      required
                      max={DEMONSTRATION_DATE}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </label>
                </div>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error} Los datos ingresados se conservan.
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Relaciona registros sintéticos; no contabiliza ni ejecuta
                  movimientos bancarios.
                </p>
                <Button type="submit" size="sm">
                  Guardar aplicación local
                </Button>
              </form>
            </details>
          )}
          {feedback && (
            <p role="status" className="text-sm">
              {feedback}
            </p>
          )}
        </section>
      )}
      <section className="space-y-2 border-t border-border pt-4">
        <h2 className="font-semibold">Actividad local</h2>
        <ul className="space-y-2 text-sm">
          {state.activity
            .filter((item) => item.entityId === id)
            .map((item, index) => (
              <li key={index}>
                {formatDate(item.on)} · {item.description}
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
