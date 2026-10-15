import type { DemonstrationOperation } from "@/features/operations/types/operation"

export type AssistedOperationContext = Pick<
  DemonstrationOperation,
  "id" | "reference" | "kind" | "situation" | "updatedOn" | "nextAction"
>

export type AssistedQuestion =
  | "status"
  | "next-step"
  | "documents"
  | "deadline"
  | "external-status"

export type AssistedAnswer = {
  title: string
  message: string
  source: string
  updatedOn: string | null
  limitation: string
}

export const assistedQuestions: {
  id: AssistedQuestion
  label: string
}[] = [
  { id: "status", label: "¿Cuál es la situación actual?" },
  { id: "next-step", label: "¿Qué indica el próximo paso?" },
  { id: "documents", label: "¿Qué documento falta?" },
  { id: "deadline", label: "¿Hay un vencimiento registrado?" },
  { id: "external-status", label: "¿Se confirmó el estado aduanero?" },
]

export function answerAssistedQuestion(
  question: AssistedQuestion,
  operation: AssistedOperationContext,
  documents?: Array<{
    requirement: string
    documentName?: string
    updatedOn?: string
  }>
): AssistedAnswer {
  switch (question) {
    case "status":
      return {
        title: "Situación del escenario",
        message: `${operation.reference}: ${operation.kind.toLowerCase()} en situación “${operation.situation}”.`,
        source: "Ficha local de operación · escenario sintético",
        updatedOn: operation.updatedOn,
        limitation:
          "Es una lectura del fixture; no confirma un evento ni una consulta a un sistema externo.",
      }
    case "next-step":
      return {
        title: "Próximo paso de referencia",
        message: operation.nextAction,
        source: "Próximo paso del fixture de operación",
        updatedOn: operation.updatedOn,
        limitation:
          "Es orientación demostrativa; no crea una tarea ni indica que alguien ya la haya ejecutado.",
      }
    case "documents":
      if (documents?.length) {
        const missing = documents.filter((d) => !d.documentName)
        return {
          title: missing.length ? "Copias pendientes" : "Copias disponibles",
          message: missing.length
            ? missing.map((d) => d.requirement).join("; ")
            : "Los requisitos listados tienen copia. Esto no confirma originales ni cierre documental.",
          source: "Requisitos documentales locales de esta operación",
          updatedOn:
            documents
              .map((d) => d.updatedOn)
              .filter((date): date is string => Boolean(date))
              .sort()
              .at(-1) ?? null,
          limitation:
            "No valida el documento ni infiere requisitos adicionales, custodia o controles.",
        }
      }
      return {
        title: "No hay detalle documental confiable",
        message:
          operation.situation === "Pendiente documental"
            ? "El escenario indica un pendiente documental, pero no identifica qué documento falta. No puedo precisarlo con la información disponible."
            : "La ficha no contiene un inventario documental; no puedo confirmar si falta un documento.",
        source:
          operation.situation === "Pendiente documental"
            ? "Situación de la operación en el fixture; sin inventario documental"
            : "Sin fuente documental disponible en el escenario",
        updatedOn:
          operation.situation === "Pendiente documental"
            ? operation.updatedOn
            : null,
        limitation:
          "La consulta se abstiene de inferir documentos o requisitos no presentes en una fuente autorizada.",
      }
    case "deadline":
      return {
        title: "Sin vencimiento verificable",
        message:
          "No hay una fecha de vencimiento disponible en esta ficha. No puedo confirmar un plazo.",
        source: "La ficha de operación no incluye una fecha límite",
        updatedOn: null,
        limitation:
          "No se infiere un vencimiento a partir de estados o textos de referencia.",
      }
    case "external-status":
      return {
        title: "Estado aduanero no consultado",
        message:
          "No puedo confirmar el estado aduanero: Alpha2000 y ARCA/MOA no están conectados en esta demostración.",
        source: "Sin consulta a fuente externa",
        updatedOn: null,
        limitation:
          "La referencia sintética no equivale a una oficialización, cumplido ni respuesta externa.",
      }
  }
}
