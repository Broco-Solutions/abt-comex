"use client"
import Link from "next/link"
import { administrativeReturn } from "../data/navigation"
import { PageHeader } from "@/components/navigation/page-header"
import { formatDate } from "@workspace/ui/lib/date"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { money } from "@/features/finance/data/financial-records"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import { ExpenseEditor } from "./expense-editor"
import { AdministrationNav } from "./administration-nav"
export function ExpenseDetail({
  id,
  returnTo = "",
}: {
  id: string
  returnTo?: string
}) {
  const { state, ready } = useAdministrativeLedger()
  const { scenario } = useScenario()
  const { organizations } = useOrganizations()
  const { operations } = useDemoOperations()
  const { href: back, label: backLabel } = administrativeReturn(
    returnTo,
    "/administracion/gastos"
  )
  if (
    !hasCapability(scenario, "finance.expenses") ||
    !hasCapability(scenario, "costs.internal")
  )
    return (
      <p role="status">
        Este registro no está disponible para tus capacidades.
      </p>
    )
  if (!ready) return <p role="status">Preparando gasto…</p>
  const item = state.expenses.find((expense) => expense.id === id)
  if (!item)
    return (
      <p role="status">
        Gasto no disponible.{" "}
        <Link href={back} className="text-primary underline">
          {backLabel}
        </Link>
      </p>
    )
  const self = "/administracion/gastos/" + item.id
  const party = organizations.find((org) => org.id === item.partyId)
  return (
    <div className="max-w-5xl space-y-5">
      <Link href={back} className="text-sm text-primary underline">
        {backLabel}
      </Link>
      <PageHeader
        title={item.reference}
        primaryAction={<ExpenseEditor expense={item} />}
      />
      <AdministrationNav />
      <section className="rounded-lg border border-border bg-accent/40 p-4">
        <p className="text-lg font-semibold">{item.description}</p>
        <p className="mt-2 font-mono text-xl">
          {money(item.amount, item.currency)}
        </p>
        <p className="mt-2 text-sm">
          {item.evidence.trim()
            ? "Referencia de evidencia preparada"
            : "Evidencia pendiente"}{" "}
          · {item.source}
        </p>
      </section>
      <dl className="grid gap-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Fecha de registro</dt>
          <dd className="mt-1 font-medium">{formatDate(item.date)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            Proveedor contratado por ABT
          </dt>
          <dd className="mt-1">
            {party ? (
              <Link
                className="font-medium text-primary underline"
                href={
                  "/proveedores/" +
                  party.id +
                  "?returnTo=" +
                  encodeURIComponent(self)
                }
              >
                {party.name}
              </Link>
            ) : (
              "Sin identificar"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Categoría actual</dt>
          <dd className="mt-1 font-medium">
            {state.categories.find(
              (category) => category.id === item.categoryId
            )?.name ?? item.categoryAtEntry}
          </dd>
          <dd className="text-xs text-muted-foreground">
            Al registrar: {item.categoryAtEntry}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Vinculación externa</dt>
          <dd className="mt-1">
            {item.externalReference
              ? "Referencia por verificar: " + item.externalReference
              : "Sin vincular"}
          </dd>
          <dd className="text-xs text-muted-foreground">
            Alpha2000 no conectado; no se acredita contabilización.
          </dd>
        </div>
      </dl>
      <section className="space-y-3 border-t border-border pt-4">
        <h2 className="font-semibold">Operaciones relacionadas</h2>
        {item.operationIds.length ? (
          <ul className="space-y-2 text-sm">
            {item.operationIds.map((operationId) => (
              <li key={operationId}>
                <Link
                  href={
                    "/operaciones/" +
                    operationId +
                    "?returnTo=" +
                    encodeURIComponent(self)
                  }
                  className="text-primary underline"
                >
                  {operations.find((operation) => operation.id === operationId)
                    ?.reference ??
                    "Operación no disponible para esta perspectiva"}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Gasto general, sin operación vinculada.
          </p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Evidencia y observaciones</h2>
        <p className="text-sm">
          {item.evidence ||
            "Referencia de comprobante pendiente. No hay un archivo disponible."}
        </p>
        {item.notes && (
          <p className="text-sm text-muted-foreground">{item.notes}</p>
        )}
      </section>
      {hasCapability(scenario, "finance.treasury") && (
        <section className="space-y-3">
          <h2 className="font-semibold">Rendiciones</h2>
          <ul className="space-y-2 text-sm">
            {state.renditions
              .filter((record) => record.expenseIds.includes(id))
              .map((record) => (
                <li key={record.id}>
                  <Link
                    href={
                      "/administracion/rendiciones/" +
                      record.id +
                      "?returnTo=" +
                      encodeURIComponent(self)
                    }
                    className="text-primary underline"
                  >
                    {record.reference}
                  </Link>
                </li>
              ))}
          </ul>
          {!state.renditions.some((record) =>
            record.expenseIds.includes(id)
          ) && (
            <p className="text-sm text-muted-foreground">
              Sin rendición relacionada. Un gasto registrado no acredita un
              pago.
            </p>
          )}
        </section>
      )}
      <details>
        <summary className="cursor-pointer text-sm font-medium">
          Actividad del registro
        </summary>
        <ul className="mt-3 space-y-2 text-sm">
          {state.activity
            .filter((event) => event.entityId === id)
            .map((event, index) => (
              <li key={index}>
                {formatDate(event.on)} · {event.description}
              </li>
            ))}
        </ul>
      </details>
    </div>
  )
}
