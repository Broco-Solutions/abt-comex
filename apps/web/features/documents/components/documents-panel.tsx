"use client"
import { useState } from "react"
import { Input } from "@workspace/ui/components/input"
import { useReceivedDocuments } from "../state/use-received-documents"
import { FileText, ChevronDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import {
  loadReceivedDocuments,
  projectDocuments,
  saveReceivedDocuments,
  documentRequirements,
  type DocumentRequirement,
} from "../data/documents"

export function DocumentsPanel({
  operationId,
  external = false,
  requirements = documentRequirements,
}: {
  operationId: string
  external?: boolean
  requirements?: DocumentRequirement[]
}) {
  const received = useReceivedDocuments()
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(20)
  const [feedback, setFeedback] = useState("")
  const allDocuments = projectDocuments(
    operationId,
    received,
    external,
    requirements
  )
  const documents = allDocuments.filter((d) =>
    (d.requirement + " " + (d.documentName ?? ""))
      .toLocaleLowerCase("es-AR")
      .includes(query.toLocaleLowerCase("es-AR"))
  )
  return (
    <section
      aria-labelledby={`documents-${operationId}`}
      className="space-y-3 border-t border-border pt-4"
    >
      <h2 id={`documents-${operationId}`} className="text-base font-semibold">
        {external ? "Documentos y pendientes" : "Documentación por requisito"}
      </h2>
      {allDocuments.length > 6 ? (
        <label className="block max-w-sm text-xs font-medium">
          Buscar requisito o documento
          <Input
            id={`documents-search-${operationId}`}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setLimit(20)
            }}
            type="search"
            className="mt-1"
          />
        </label>
      ) : null}
      {!documents.length ? (
        <div role="status" className="space-y-2 text-sm text-muted-foreground">
          <p>
            {allDocuments.length
              ? "No hay coincidencias para esta búsqueda."
              : "No hay requisitos documentales disponibles para este contexto."}
          </p>
          {query ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("")
                document
                  .getElementById(`documents-search-${operationId}`)
                  ?.focus()
              }}
            >
              Limpiar búsqueda
            </Button>
          ) : null}
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {documents.slice(0, limit).map((document) => (
            <li key={document.id} className="py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <FileText aria-hidden="true" className="size-4 shrink-0" />
                    {document.requirement}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {document.bundle} ·{" "}
                    {document.documentName
                      ? "Copia disponible"
                      : "Pendiente de copia"}
                  </p>
                  {document.original ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Original físico: {document.original}
                    </p>
                  ) : null}
                </div>
                {document.documentName ? (
                  <Dialog>
                    <DialogTrigger
                      render={<Button variant="outline" size="sm" />}
                    >
                      Ver referencia
                      <span className="sr-only"> · {document.requirement}</span>
                    </DialogTrigger>
                    <DialogPortal>
                      <DialogBackdrop />
                      <DialogViewport>
                        <DialogPopup>
                          <div className="space-y-2 pr-8">
                            <DialogTitle>{document.requirement}</DialogTitle>
                            <DialogDescription>
                              Vista de ejemplo sin validez documental ni archivo
                              aduanero real.
                            </DialogDescription>
                          </div>
                          <dl className="grid gap-3 text-sm">
                            <div>
                              <dt className="text-muted-foreground">
                                Documento
                              </dt>
                              <dd>{document.documentName}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Versión de la copia
                              </dt>
                              <dd>{document.version}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Carpeta</dt>
                              <dd>{document.bundle}</dd>
                            </div>
                          </dl>
                        </DialogPopup>
                      </DialogViewport>
                    </DialogPortal>
                  </Dialog>
                ) : !external ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      saveReceivedDocuments([
                        ...new Set([...loadReceivedDocuments(), document.id]),
                      ])
                      setFeedback(
                        "Copia registrada localmente. No modifica el original, el control ni el cierre documental."
                      )
                    }}
                  >
                    Registrar copia local
                    <span className="sr-only"> · {document.requirement}</span>
                  </Button>
                ) : (
                  <span className="text-xs font-medium text-warning">
                    Documentación pendiente
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {documents.length > limit ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLimit((current) => current + 20)}
        >
          Ver más requisitos
          <span className="sr-only">
            {" "}
            · {Math.min(limit, documents.length)} de {documents.length}
          </span>
        </Button>
      ) : null}
      {feedback ? (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      ) : null}
      {!external && documents.length ? (
        <details>
          <summary className="flex cursor-pointer list-none items-center gap-2 text-xs text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">
            <ChevronDown aria-hidden="true" className="size-3.5" />
            Alcance de la recepción local
          </summary>
          <p className="mt-2 text-xs text-muted-foreground">
            Registra una copia de evaluación, no verifica su validez ni la
            custodia del original. No completa controles ni oficializa.
          </p>
        </details>
      ) : null}
    </section>
  )
}
