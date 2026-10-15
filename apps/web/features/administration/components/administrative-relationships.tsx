"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import { movementDirection } from "../data/administrative-ledger"
import { ExpenseEditor } from "./expense-editor"
import { isApplicationReturn } from "@/components/navigation/return-context"
export function AdministrativeRelationships({
  partyId,
  origin,
}: {
  partyId: string
  origin?: string
}) {
  const { state } = useAdministrativeLedger()
  const path = usePathname() ?? ""
  const context = origin && isApplicationReturn(origin) ? origin : path
  const returnQuery =
    /^\/(?:clientes|proveedores)\/[a-z0-9-]+(?:\?[^#]*)?$/.test(context)
      ? "?returnTo=" + encodeURIComponent(context)
      : ""
  const { scenario } = useScenario()
  const { organizations } = useOrganizations()
  const [saved, setSaved] = useState("")
  const expense =
    hasCapability(scenario, "finance.expenses") &&
    hasCapability(scenario, "costs.internal")
  const income = hasCapability(scenario, "finance.collections"),
    outflow = hasCapability(scenario, "finance.treasury")
  const party = organizations.find((item) => item.id === partyId)
  const supplier = party?.roles.some(
    (role) => role.role === "abt-supplier" && role.active
  )
  if (!expense && !income && !outflow) return null
  const expenses = expense
    ? state.expenses.filter((item) => item.partyId === partyId)
    : []
  const movements = state.movements.filter(
    (item) =>
      item.partyId === partyId &&
      (movementDirection(item.nature) === "Ingreso" ? income : outflow)
  )
  return (
    <section
      className="space-y-3 border-t border-border pt-4"
      aria-labelledby="party-administrative-relationships"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="party-administrative-relationships" className="font-semibold">
          Relaciones administrativas
        </h2>
        {expense && supplier && (
          <ExpenseEditor partyId={partyId} onSaved={setSaved} />
        )}
      </div>
      {saved && (
        <p role="status" className="text-sm">
          Gasto guardado.{" "}
          <Link
            className="text-primary underline"
            href={"/administracion/gastos/" + saved + returnQuery}
          >
            Abrir gasto
          </Link>
        </p>
      )}
      <div className="flex flex-wrap gap-3 text-sm">
        {(hasCapability(scenario, "finance.billing") || income || outflow) && (
          <Link
            className="text-primary underline"
            href={
              "/administracion/comprobantes?contraparte=" +
              encodeURIComponent(partyId) +
              "&cartera=" +
              (supplier ? "pagar" : "cobrar")
            }
          >
            Consultar comprobantes relacionados
          </Link>
        )}
        {expense && (
          <Link
            className="text-primary underline"
            href={
              "/administracion/gastos?contraparte=" +
              encodeURIComponent(partyId)
            }
          >
            Consultar gastos relacionados
          </Link>
        )}
        {(income || outflow) && (
          <Link
            className="text-primary underline"
            href={
              "/administracion/movimientos?contraparte=" +
              encodeURIComponent(partyId)
            }
          >
            Consultar movimientos relacionados
          </Link>
        )}
      </div>
      <ul className="space-y-2 text-sm">
        {expenses.slice(0, 3).map((item) => (
          <li key={item.id}>
            <Link
              className="font-medium text-primary underline"
              href={"/administracion/gastos/" + item.id + returnQuery}
            >
              {item.reference}
            </Link>{" "}
            · {item.description}
          </li>
        ))}
        {movements.slice(0, 3).map((item) => (
          <li key={item.id}>
            <Link
              className="font-medium text-primary underline"
              href={"/administracion/movimientos/" + item.id + returnQuery}
            >
              {item.reference}
            </Link>{" "}
            · {item.nature}
          </li>
        ))}
      </ul>
      {!expenses.length && !movements.length && (
        <p className="text-sm text-muted-foreground">
          Sin registros administrativos autorizados relacionados. Un rol o una
          contraparte de operación no crea una deuda.
        </p>
      )}
    </section>
  )
}
