"use client"
import Link from "next/link"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { visibleWorkItems } from "@/features/work/data/work-items"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import { renditionSummary } from "../data/administrative-ledger"
export function RenditionWorkContext({ workId }: { workId: string }) {
  const { state } = useAdministrativeLedger()
  const { scenario } = useScenario()
  const task = visibleWorkItems().find((item) => item.id === workId)
  const rendition = state.renditions.find(
    (item) => item.reference === task?.reference
  )
  const allowed =
    hasCapability(scenario, "finance.expenses") &&
    hasCapability(scenario, "costs.internal") &&
    hasCapability(scenario, "finance.treasury")
  return (
    <section
      className="space-y-2 rounded-lg border border-border bg-card p-4"
      aria-live="polite"
    >
      <h2 className="font-medium">
        {task?.reference ?? "Tarea no disponible"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {task
          ? task.title + " · " + task.reason
          : "No hay información autorizada para esta referencia."}
      </p>
      <p className="text-xs text-muted-foreground">
        Sin operación vinculada y sin importes asignados a la tarea. La
        rendición se consulta por separado.
      </p>
      {allowed && rendition && (
        <>
          <p className="text-sm">{renditionSummary(rendition, state).status}</p>
          <Link
            href={
              "/administracion/rendiciones/" +
              rendition.id +
              "?returnTo=" +
              encodeURIComponent("/administracion/finanzas?trabajo=" + workId)
            }
            className="inline-flex min-h-10 items-center text-sm font-medium text-primary underline"
          >
            Abrir rendición {rendition.reference}
          </Link>
        </>
      )}
    </section>
  )
}
