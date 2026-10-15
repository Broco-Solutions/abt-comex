import { describe, expect, it } from "vitest"
import { initialOrganizations } from "@/features/organizations/data/organizations"
import {
  demonstrationOperations,
  filterOperations,
  parseDemoOperations,
  parseOperationFilters,
} from "./operations"
import { getDemonstrationOperationProgress } from "./operation-progress"
import {
  linkOperationParticipant,
  recordHandoff,
} from "./operational-continuity"

describe("operational continuity", () => {
  it("links active operational roles once without treating ABT suppliers as counterparties", () => {
    const operation = demonstrationOperations[0]!
    const party = initialOrganizations.find(
      (item) => item.id === "org-demo-003"
    )!
    const linked = linkOperationParticipant(
      linkOperationParticipant(operation, party),
      party
    )
    expect(linked.participantIds).toEqual([party.id])
    expect(linked.clientId).toBe(operation.clientId)
    expect(() =>
      linkOperationParticipant(
        operation,
        initialOrganizations.find((item) => item.id === "org-demo-001")!
      )
    ).toThrow(/rol/)
    expect(() =>
      linkOperationParticipant(operation, {
        ...party,
        roles: [{ role: "operation-party", active: false }],
      })
    ).toThrow(/activo/)
  })
  it("returns and resubmits with history while operational and financial dimensions remain independent", () => {
    const operation = demonstrationOperations.find(
      (item) => item.id === "op-demo-3107"
    )!
    const before = structuredClone(
      getDemonstrationOperationProgress(operation.id)
    )
    expect(() =>
      recordHandoff(
        operation,
        "Recibida para revisión",
        "Revisar",
        "Evaluación"
      )
    ).toThrow(/Primero/)
    expect(() =>
      recordHandoff(operation, "En revisión administrativa", " ", "Evaluación")
    ).toThrow(/Indicá/)
    const sent = recordHandoff(
      operation,
      "En revisión administrativa",
      "Revisar evidencias",
      "Operación"
    )
    expect(() =>
      recordHandoff(
        sent,
        "En revisión administrativa",
        "Duplicado",
        "Operación"
      )
    ).toThrow(/pendiente/)
    const returned = recordHandoff(
      sent,
      "Devuelta con observaciones",
      "Falta evidencia",
      "Administración"
    )
    const resent = recordHandoff(
      returned,
      "En revisión administrativa",
      "Evidencia referenciada",
      "Operación"
    )
    expect(resent.handoff?.history.map((event) => event.note)).toEqual([
      "Revisar evidencias",
      "Falta evidencia",
      "Evidencia referenciada",
    ])
    expect(resent.situation).toBe(operation.situation)
    expect(getDemonstrationOperationProgress(operation.id)).toEqual(before)
    const stored = demonstrationOperations.map((item) =>
      item.id === resent.id ? resent : item
    )
    expect(parseDemoOperations(JSON.stringify(stored))).toEqual(stored)
  })
  it("filters explicit stable person IDs separately from unassigned and legacy team context", () => {
    const assigned = {
      ...demonstrationOperations[0]!,
      responsibleId: "person-abt-002",
      responsible: "Sergio Mentini",
      responsibleReference: "Equipo Impo A",
    }
    const operations = [assigned, demonstrationOperations[1]!]
    expect(
      filterOperations(
        operations,
        parseOperationFilters({ responsable: "person-abt-002" })
      ).map((item) => item.id)
    ).toEqual([assigned.id])
    expect(
      filterOperations(
        operations,
        parseOperationFilters({ responsable: "pending" })
      ).map((item) => item.id)
    ).toEqual([operations[1]!.id])
    expect(
      filterOperations(
        operations,
        parseOperationFilters({ responsable: "Equipo Impo A" })
      ).map((item) => item.id)
    ).toEqual([assigned.id])
  })
})
