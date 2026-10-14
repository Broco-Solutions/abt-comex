import { describe, expect, it } from "vitest"

import { demonstrationOperations } from "@/features/operations/data/operations"
import { demonstrationOperationProgress } from "@/features/operations/data/operation-progress"
import {
  filterAdministrationQueue,
  getAdministrationQueue,
} from "./administration"

describe("administration demonstration queue", () => {
  it("reuses shared operation lifecycle without inventing invoice or collection values", () => {
    const queue = getAdministrationQueue(demonstrationOperations)
    const ready = queue.find(
      (entry) =>
        entry.kind === "operation" && entry.operationId === "op-demo-3112"
    )
    const invoiced = queue.find(
      (entry) =>
        entry.kind === "operation" && entry.operationId === "op-demo-3107"
    )
    expect(ready?.kind === "operation" && ready.billing).toBe(
      "Lista para facturar"
    )
    expect(invoiced?.kind === "operation" && invoiced.billing).toBe("Facturada")
    expect(invoiced?.kind === "operation" && invoiced.collection).toBe(
      "Sin referencia"
    )
    expect(
      demonstrationOperationProgress.find(
        (item) => item.operationId === "op-demo-3133"
      )?.collection
    ).toBe("Registrada en fixture")
  })

  it("includes the synthetic administrative task without an operation", () => {
    const queue = getAdministrationQueue(demonstrationOperations)
    expect(queue).toContainEqual(
      expect.objectContaining({
        kind: "work",
        reference: "REN-DEM-014",
        status: "Con pendientes",
      })
    )
  })

  it("filters by workflow state and query without changing the source data", () => {
    const queue = getAdministrationQueue(demonstrationOperations)
    expect(
      filterAdministrationQueue(queue, "", "Lista para facturar")
    ).toHaveLength(1)
    expect(filterAdministrationQueue(queue, "REN-DEM-014", "")).toHaveLength(1)
    expect(filterAdministrationQueue(queue, "privado-no-existe", "")).toEqual(
      []
    )
  })
})
