"use client"
import Link from "next/link"
import { administrativeReturn } from "../data/navigation"
import { formatDate } from "@workspace/ui/lib/date"
import { PageHeader } from "@/components/navigation/page-header"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { money } from "@/features/finance/data/financial-records"
import { UsdEquivalent } from "@/features/finance/components/usd-equivalent"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { usePeople } from "@/features/people/state/use-people"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import { movementDirection } from "../data/administrative-ledger"
import { MovementEditor } from "./movement-editor"
import { AdministrationNav } from "./administration-nav"
import { VoucherRelations } from "./voucher-relations"
import { useVouchers } from "../state/use-vouchers"
import { originAvailable } from "../data/vouchers"
export function MovementDetail({
  id,
  returnTo = "",
}: {
  id: string
  returnTo?: string
}) {
  const { state, ready } = useAdministrativeLedger()
  const { state: vouchers } = useVouchers()
  const { scenario } = useScenario()
  const { organizations } = useOrganizations()
  const { state: people } = usePeople()
  const { operations } = useDemoOperations()
  const item = state.movements.find((record) => record.id === id)
  const { href: back, label: backLabel } = administrativeReturn(
    returnTo,
    "/administracion/movimientos"
  )
  if (!ready) return <p role="status">Preparando movimiento…</p>
  if (
    !item ||
    !hasCapability(
      scenario,
      movementDirection(item.nature) === "Ingreso"
        ? "finance.collections"
        : "finance.treasury"
    )
  )
    return (
      <p role="status">
        Movimiento no disponible para esta perspectiva.{" "}
        <Link href={back} className="text-primary underline">
          {backLabel}
        </Link>
      </p>
    )
  const self = "/administracion/movimientos/" + id
  const party = organizations.find((org) => org.id === item.partyId)
  return (
    <div className="max-w-5xl space-y-5">
      <Link href={back} className="text-sm text-primary underline">
        {backLabel}
      </Link>
      <PageHeader
        title={item.reference}
        primaryAction={<MovementEditor movement={item} />}
      />
      <AdministrationNav />
      <VoucherRelations movementId={id} returnTo={self} />
      <section className="rounded-lg border border-border bg-accent/40 p-4">
        <h2 className="text-lg font-semibold">
          {item.nature} · {movementDirection(item.nature)}
        </h2>
        <p className="mt-2 font-mono text-xl">
          {money(item.amount, item.currency)}
        </p>
        <UsdEquivalent
          amount={item.amount}
          currency={item.currency}
          date={item.date}
        />
        <p className="mt-2 text-sm">
          {formatDate(item.date)} · {item.source}
        </p>
        {["Cobro", "Pago"].includes(item.nature) && (
          <p className="mt-2 text-sm">
            Disponible sin aplicar:{" "}
            {money(
              originAvailable("movement", item.id, vouchers, state),
              item.currency
            )}
          </p>
        )}
      </section>
      <dl className="grid gap-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Contraparte</dt>
          <dd className="mt-1">
            {party ? (
              <Link
                className="font-medium text-primary underline"
                href={
                  (party.roles.some((role) => role.role === "client")
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
              "Sin contraparte comercial"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            Integrante relacionado
          </dt>
          <dd className="mt-1">
            {people.members.find((member) => member.id === item.memberId)
              ?.name ?? "Sin integrante relacionado"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Clasificación local</dt>
          <dd className="mt-1">
            {state.categories.find(
              (category) => category.id === item.categoryId
            )?.name ?? "Sin clasificación"}
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
            Sin confirmación bancaria ni registración en Alpha2000.
          </dd>
        </div>
      </dl>
      <section className="space-y-3 border-t border-border pt-4">
        <h2 className="font-semibold">Operaciones relacionadas</h2>
        {item.operationIds.length ? (
          <ul className="space-y-2 text-sm">
            {item.operationIds.map((operationId) => {
              const operation = operations.find(
                (record) => record.id === operationId
              )
              return (
                <li key={operationId}>
                  {operation ? (
                    <Link
                      href={
                        "/operaciones/" +
                        operationId +
                        "?returnTo=" +
                        encodeURIComponent(self)
                      }
                      className="text-primary underline"
                    >
                      {operation.reference}
                    </Link>
                  ) : (
                    "Contexto operativo no disponible para esta perspectiva"
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin operación vinculada.
          </p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Evidencia y concepto</h2>
        <p className="text-sm">
          {item.evidence ||
            "Referencia de evidencia pendiente; no hay archivo disponible."}
        </p>
        {item.notes && (
          <p className="text-sm text-muted-foreground">{item.notes}</p>
        )}
      </section>
      {hasCapability(scenario, "finance.expenses") &&
        hasCapability(scenario, "costs.internal") &&
        hasCapability(scenario, "finance.treasury") && (
          <section className="space-y-3">
            <h2 className="font-semibold">Rendiciones relacionadas</h2>
            <ul className="space-y-2 text-sm">
              {state.renditions
                .filter(
                  (record) => record.advanceId === id || record.refundId === id
                )
                .map((record) => (
                  <li key={record.id}>
                    <Link
                      className="text-primary underline"
                      href={
                        "/administracion/rendiciones/" +
                        record.id +
                        "?returnTo=" +
                        encodeURIComponent(self)
                      }
                    >
                      {record.reference}
                    </Link>
                  </li>
                ))}
            </ul>
            {!state.renditions.some(
              (record) => record.advanceId === id || record.refundId === id
            ) && (
              <p className="text-sm text-muted-foreground">
                Sin rendición relacionada.
              </p>
            )}
          </section>
        )}
      <details>
        <summary className="cursor-pointer text-sm font-medium">
          Actividad
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
