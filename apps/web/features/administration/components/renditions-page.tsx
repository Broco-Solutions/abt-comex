"use client"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useListContext } from "@/components/navigation/list-context"
import { Input } from "@workspace/ui/components/input"
import { PageHeader } from "@/components/navigation/page-header"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { money } from "@/features/finance/data/financial-records"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import { renditionSummary } from "../data/administrative-ledger"
import { RenditionEditor } from "./rendition-editor"
import { AdministrationNav } from "./administration-nav"
export function RenditionsPage() {
  const { state, ready } = useAdministrativeLedger()
  const { scenario } = useScenario()
  const params = useSearchParams()
  const query = params.get("q") ?? ""
  const context =
    "/administracion/rendiciones" + (params.size ? "?" + params : "")
  const capture = useListContext(ready, context)
  const setQuery = (value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set("q", value)
    else next.delete("q")
    window.history.replaceState(
      null,
      "",
      "/administracion/rendiciones" + (next.size ? "?" + next : "")
    )
  }
  const [saved, setSaved] = useState("")
  if (
    !hasCapability(scenario, "finance.treasury") ||
    !hasCapability(scenario, "finance.expenses") ||
    !hasCapability(scenario, "costs.internal")
  )
    return (
      <p role="status">
        Las rendiciones no están disponibles para tus capacidades.
      </p>
    )
  const rows = state.renditions.filter((item) =>
    item.reference
      .toLocaleLowerCase("es-AR")
      .includes(query.toLocaleLowerCase("es-AR"))
  )
  return (
    <div className="space-y-4" onClickCapture={capture}>
      <PageHeader
        title="Anticipos y rendiciones"
        primaryAction={<RenditionEditor onSaved={setSaved} />}
      />
      <AdministrationNav />
      <label className="block text-xs font-medium">
        Buscar rendición
        <Input
          className="mt-1"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {saved && (
        <p role="status" className="text-sm">
          Rendición guardada.{" "}
          <Link
            href={"/administracion/rendiciones/" + saved}
            className="text-primary underline"
          >
            Abrir rendición
          </Link>
        </p>
      )}
      {!ready ? (
        <p role="status">Preparando rendiciones…</p>
      ) : (
        <ul
          aria-label="Rendiciones"
          className="divide-y divide-border rounded-lg border border-border bg-card px-4"
        >
          {rows.map((item) => {
            const summary = renditionSummary(item, state)
            return (
              <li
                key={item.id}
                className="grid gap-2 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div>
                  <Link
                    href={
                      "/administracion/rendiciones/" +
                      item.id +
                      "?returnTo=" +
                      encodeURIComponent(context)
                    }
                    className="font-medium text-primary underline"
                  >
                    {item.reference}
                  </Link>
                  <p className="mt-1">
                    {summary.status} ·{" "}
                    {summary.advance?.reference ?? "Anticipo no disponible"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {summary.expenses.length} gastos · {summary.missing}{" "}
                    evidencias pendientes
                  </p>
                </div>
                <p className="font-mono">
                  {money(
                    item.advanceAmount,
                    summary.advance?.currency ?? "ARS"
                  )}
                  <span className="block font-sans text-xs text-muted-foreground">
                    Anticipo aplicado
                  </span>
                </p>
              </li>
            )
          })}
          {!rows.length && (
            <li className="py-6 text-sm">Sin rendiciones para la búsqueda.</li>
          )}
        </ul>
      )}
    </div>
  )
}
