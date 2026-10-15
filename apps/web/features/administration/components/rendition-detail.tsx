"use client"
import Link from "next/link"
import { administrativeReturn } from "../data/navigation"
import { PageHeader } from "@/components/navigation/page-header"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { money } from "@/features/finance/data/financial-records"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import { renditionSummary } from "../data/administrative-ledger"
import { RenditionEditor } from "./rendition-editor"
import { AdministrationNav } from "./administration-nav"
export function RenditionDetail({
  id,
  returnTo = "",
}: {
  id: string
  returnTo?: string
}) {
  const back = administrativeReturn(returnTo, "/administracion/rendiciones")
  const { state, ready } = useAdministrativeLedger()
  const { scenario } = useScenario()
  if (
    !hasCapability(scenario, "finance.treasury") ||
    !hasCapability(scenario, "finance.expenses") ||
    !hasCapability(scenario, "costs.internal")
  )
    return (
      <p role="status">
        Esta rendición no está disponible para tus capacidades.
      </p>
    )
  if (!ready) return <p role="status">Preparando rendición…</p>
  const item = state.renditions.find((record) => record.id === id)
  if (!item)
    return (
      <p role="status">
        Rendición no disponible.{" "}
        <Link href={back.href} className="text-primary underline">
          {back.label}
        </Link>
      </p>
    )
  const summary = renditionSummary(item, state)
  const currency = summary.advance?.currency ?? "ARS"
  const self = "/administracion/rendiciones/" + id
  return (
    <div className="max-w-5xl space-y-5">
      <Link
        href="/administracion/rendiciones"
        className="text-sm text-primary underline"
      >
        {back.label}
      </Link>
      <PageHeader
        title={item.reference}
        primaryAction={<RenditionEditor rendition={item} />}
      />
      <AdministrationNav />
      <p className="rounded-md border border-border bg-accent/40 p-3 text-sm font-medium">
        {summary.status}
      </p>
      <dl className="grid gap-4 text-sm sm:grid-cols-3">
        {[
          ["Anticipo aplicado", item.advanceAmount],
          ["Gastos relacionados", summary.expenseAmount],
          ["Devolución aplicada", item.refundAmount],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-mono text-lg font-medium">
              {money(Number(value), currency)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-semibold">Diferencia por revisar</p>
        <p className="mt-1 font-mono text-lg">
          {money(summary.difference, currency)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Anticipo aplicado menos gastos y devolución referenciados. No
          constituye saldo contable, deuda personal ni autorización de
          devolución.
        </p>
      </div>
      <section className="space-y-3">
        <h2 className="font-semibold">Referencias de fondos</h2>
        {summary.advance && (
          <Link
            href={
              "/administracion/movimientos/" +
              summary.advance.id +
              "?returnTo=" +
              encodeURIComponent(self)
            }
            className="block text-sm text-primary underline"
          >
            {summary.advance.reference}
          </Link>
        )}
        {item.refundId && (
          <Link
            href={
              "/administracion/movimientos/" +
              item.refundId +
              "?returnTo=" +
              encodeURIComponent(self)
            }
            className="block text-sm text-primary underline"
          >
            {state.movements.find((record) => record.id === item.refundId)
              ?.reference ?? "Devolución no disponible"}
          </Link>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Gastos y evidencias</h2>
        <ul className="divide-y divide-border">
          {summary.expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex flex-wrap justify-between gap-2 py-3 text-sm"
            >
              <div>
                <Link
                  href={
                    "/administracion/gastos/" +
                    expense.id +
                    "?returnTo=" +
                    encodeURIComponent(self)
                  }
                  className="font-medium text-primary underline"
                >
                  {expense.reference} · {expense.description}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {expense.evidence || "Evidencia pendiente"}
                </p>
              </div>
              <p className="font-mono">
                {money(expense.amount, expense.currency)}
              </p>
            </li>
          ))}
        </ul>
        {!summary.expenses.length && (
          <p className="text-sm text-muted-foreground">
            Sin gastos relacionados. Editá la preparación para agregarlos.
          </p>
        )}
      </section>
      {item.notes && (
        <p className="text-sm text-muted-foreground">{item.notes}</p>
      )}
      <details>
        <summary className="cursor-pointer text-sm font-medium">
          Actividad y límites
        </summary>
        <p className="mt-3 text-sm text-muted-foreground">
          Preparación local para revisión. Reglas de aprobación, prorrateos
          documentales y vinculación contable requieren validación ABT; no se
          registran externamente.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {state.activity
            .filter((event) => event.entityId === id)
            .map((event, index) => (
              <li key={index}>{event.description}</li>
            ))}
        </ul>
      </details>
    </div>
  )
}
