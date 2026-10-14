import { describe, expect, it } from "vitest"

import {
  demonstrationOperations,
  filterOperations,
  operationHref,
  parseOperationFilters,
} from "./operations"

describe("operations list data", () => {
  it("parses only supported query values and normalizes page", () => {
    expect(
      parseOperationFilters({ tipo: "inventado", pagina: "-2", orden: "monto" })
    ).toMatchObject({
      kind: "",
      page: 1,
      sort: "updatedOn",
      direction: "desc",
    })
  })

  it("combines type, text, team, situation, and date filters", () => {
    const result = filterOperations(
      demonstrationOperations,
      parseOperationFilters({
        tipo: "importacion",
        q: "demo norte",
        responsable: "Equipo Impo A",
        situacion: "En seguimiento",
        desde: "2026-10-13",
        hasta: "2026-10-13",
      })
    )
    expect(result.map((item) => item.id)).toEqual(["op-demo-2048"])
  })

  it("keeps a safe, synthetic context and active list filters in a URL", () => {
    const filters = parseOperationFilters({
      tipo: "exportacion",
      q: "norte",
      agrupar: "kind",
    })
    expect(operationHref(filters, { operation: "op-demo-3107" })).toBe(
      "/operaciones?q=norte&tipo=exportacion&agrupar=kind&operacion=op-demo-3107"
    )
  })

  it("contains no monetary fields and only stable fictional references", () => {
    expect(
      demonstrationOperations.every((item) =>
        item.reference.startsWith("OP-DEM-")
      )
    ).toBe(true)
    expect(
      demonstrationOperations.some(
        (item) => "amount" in item || "honorarios" in item
      )
    ).toBe(false)
    expect(new Set(demonstrationOperations.map((item) => item.id)).size).toBe(
      demonstrationOperations.length
    )
  })
})
