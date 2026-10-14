import { describe, expect, it } from "vitest"

import { demonstrationOperations } from "@/features/operations/data/operations"
import {
  answerAssistedQuestion,
  type AssistedOperationContext,
} from "./assisted-query"

const pendingDocumentOperation = demonstrationOperations.find(
  (operation) => operation.situation === "Pendiente documental"
) as AssistedOperationContext

describe("guided assisted queries", () => {
  it("answers status with fixture source and update date", () => {
    const answer = answerAssistedQuestion("status", pendingDocumentOperation)

    expect(answer.message).toContain(pendingDocumentOperation.reference)
    expect(answer.source).toContain("escenario sintético")
    expect(answer.updatedOn).toBe(pendingDocumentOperation.updatedOn)
    expect(answer.limitation).toContain("no confirma")
  })

  it("abstains instead of guessing missing documents or deadlines", () => {
    const documents = answerAssistedQuestion(
      "documents",
      pendingDocumentOperation
    )
    const deadline = answerAssistedQuestion(
      "deadline",
      pendingDocumentOperation
    )

    expect(documents.message).toContain("no identifica qué documento")
    expect(documents.limitation).toContain("se abstiene")
    expect(deadline.message).toContain("No puedo confirmar un plazo")
    expect(deadline.updatedOn).toBeNull()
  })

  it("never treats a fixture as an external customs confirmation", () => {
    const answer = answerAssistedQuestion(
      "external-status",
      pendingDocumentOperation
    )

    expect(answer.message).toContain("no están conectados")
    expect(answer.source).toBe("Sin consulta a fuente externa")
    expect(answer.updatedOn).toBeNull()
  })
})
