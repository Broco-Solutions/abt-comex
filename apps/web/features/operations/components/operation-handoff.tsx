"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { formatDate } from "@workspace/ui/lib/date"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { useDemoOperations } from "../state/use-demo-operations"
import { recordHandoff } from "../data/operational-continuity"
import type { DemonstrationOperation } from "../types/operation"

export function OperationHandoff({ operationId }: { operationId: string }) {
  const { operations, updateOperations, ready } = useDemoOperations()
  const { scenario } = useScenario()
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const id = useId()
  const operation = operations.find((item) => item.id === operationId)
  if (!ready || !operation || scenario.id === "client") return null
  const canSend = hasCapability(scenario, "operations.write")
  const canReview = hasCapability(scenario, "finance.prepare")
  function record(
    status: NonNullable<DemonstrationOperation["handoff"]>["status"]
  ) {
    try {
      updateOperations((current) =>
        current.map((item) =>
          item.id === operationId
            ? recordHandoff(item, status, note, `Escenario: ${scenario.label}`)
            : item
        )
      )
      setNote("")
      setError("")
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo conservar la referencia."
      )
    }
  }
  const pending = operation.handoff?.status === "En revisión administrativa"
  return (
    <section
      aria-label="Continuidad administrativa"
      className="space-y-3 border-t border-border pt-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">Continuidad administrativa</h2>
        <span className="text-sm text-muted-foreground">
          {operation.handoff?.status ?? "Sin envío preparado"}
        </span>
      </div>
      {operation.handoff ? (
        <p className="text-sm">{operation.handoff.note}</p>
      ) : null}
      {canSend || canReview ? (
        <>
          <label htmlFor={id} className="block text-xs font-medium">
            Próxima acción u observación
          </label>
          <Input
            id={id}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={500}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : `${id}-scope`}
          />
          <div className="flex flex-wrap gap-2">
            {canSend ? (
              <Button
                variant="outline"
                disabled={pending}
                onClick={() => record("En revisión administrativa")}
              >
                Preparar envío a Administración
              </Button>
            ) : null}
            {canReview && pending ? (
              <>
                <Button onClick={() => record("Recibida para revisión")}>
                  Registrar recepción para revisión
                </Button>
                <Button
                  variant="outline"
                  onClick={() => record("Devuelta con observaciones")}
                >
                  Devolver con observaciones
                </Button>
              </>
            ) : null}
          </div>
          <p id={`${id}-scope`} className="text-xs text-muted-foreground">
            Referencia local de coordinación. No cambia facturación, cobranzas,
            cumplido ni controles aduaneros.
          </p>
          {error ? (
            <p
              role="alert"
              id={`${id}-error`}
              className="text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}
        </>
      ) : null}
      {canReview ? (
        <Link
          href={`/administracion/${operationId}?returnTo=${encodeURIComponent(`/operaciones/${operationId}`)}`}
          className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
        >
          Abrir contexto administrativo
        </Link>
      ) : null}
      {operation.handoff?.history.length ? (
        <details>
          <summary className="cursor-pointer text-sm font-medium">
            Historial de coordinación
          </summary>
          <ol className="mt-2 divide-y divide-border">
            {operation.handoff.history.map((event, index) => (
              <li key={index} className="py-2 text-sm">
                <p className="font-medium">{event.status}</p>
                <p>{event.note}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(event.on)} · fecha del escenario · {event.context}
                </p>
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </section>
  )
}
