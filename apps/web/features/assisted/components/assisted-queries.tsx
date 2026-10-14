"use client"

import { useState } from "react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { formatDate } from "@workspace/ui/lib/date"

import {
  answerAssistedQuestion,
  assistedQuestions,
  type AssistedOperationContext,
  type AssistedQuestion,
} from "../data/assisted-query"

export function AssistedQueries({
  operation,
}: {
  operation: AssistedOperationContext
}) {
  const [question, setQuestion] = useState<AssistedQuestion | null>(null)
  const answer = question ? answerAssistedQuestion(question, operation) : null

  return (
    <section
      aria-labelledby="assisted-queries-title"
      className="max-w-4xl space-y-4 border-t border-border pt-4"
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="assisted-queries-title" className="font-semibold">
            Consultas guiadas
          </h2>
          <Badge variant="outline">Demostración · sin IA</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Elegí una consulta. Las respuestas se construyen localmente con los
          datos visibles de esta operación; no se envían ni registran como
          actividad productiva.
        </p>
      </div>

      <div
        aria-label="Consultas disponibles"
        className="flex flex-wrap gap-2"
        role="group"
      >
        {assistedQuestions.map((item) => (
          <Button
            key={item.id}
            variant={question === item.id ? "default" : "outline"}
            aria-pressed={question === item.id}
            onClick={() => setQuestion(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {answer ? (
        <div
          aria-live="polite"
          aria-atomic="true"
          className="space-y-3 border-l-2 border-muted pl-4"
          role="status"
        >
          <div className="space-y-1">
            <h3 className="font-medium">{answer.title}</h3>
            <p className="text-sm">{answer.message}</p>
          </div>
          <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <div>
              <dt className="font-medium text-foreground">Fuente</dt>
              <dd>{answer.source}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Actualización</dt>
              <dd>
                {answer.updatedOn
                  ? formatDate(answer.updatedOn)
                  : "No disponible"}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            Límite: {answer.limitation}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground" role="status">
          No se consultó información todavía.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        No hay proveedor de IA, canal externo, acción, integración ni auditoría
        productiva conectados. Esta experiencia no acredita permisos reales.
      </p>
    </section>
  )
}
