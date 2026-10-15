"use client"
import Link from "next/link"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { useVouchers } from "../state/use-vouchers"
import { canReadVoucher } from "./voucher-editor"
import { money } from "@/features/finance/data/financial-records"
export function VoucherRelations({
  movementId,
  operationId,
  returnTo,
}: {
  movementId?: string
  operationId?: string
  returnTo: string
}) {
  const { scenario } = useScenario()
  const { state } = useVouchers()
  const rows = state.documents.filter(
    (item) =>
      canReadVoucher(scenario, item) &&
      (operationId
        ? item.operationIds.includes(operationId)
        : state.applications.some(
            (app) =>
              app.voucherId === item.id &&
              app.origin === "movement" &&
              app.originId === movementId
          ))
  )
  if (!rows.length) return null
  return (
    <section className="space-y-3 border-t border-border pt-4">
      <h2 className="font-semibold">Comprobantes relacionados</h2>
      <ul className="space-y-2 text-sm">
        {rows.map((item) => (
          <li key={item.id}>
            <Link
              className="font-medium text-primary underline"
              href={
                "/administracion/comprobantes/" +
                item.id +
                "?returnTo=" +
                encodeURIComponent(returnTo)
              }
            >
              {item.reference}
            </Link>
            {movementId && (
              <span>
                {" "}
                · Aplicado{" "}
                {money(
                  state.applications
                    .filter(
                      (app) =>
                        app.voucherId === item.id &&
                        app.origin === "movement" &&
                        app.originId === movementId
                    )
                    .reduce(
                      (sum, app) => sum + Math.round(app.amount * 100),
                      0
                    ) / 100,
                  item.currency
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
