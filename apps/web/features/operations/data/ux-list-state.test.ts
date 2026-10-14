import { expect, it } from "vitest"
import {
  demonstrationOperations,
  filterOperations,
  operationHref,
  parseOperationFilters,
} from "./operations"

it("explicit neutral sort survives URL round trips and preserves source order", () => {
  const filters = parseOperationFilters({
    orden: "ninguno",
    tipo: "importacion",
    agrupar: "responsible",
  })
  expect(filters.sort).toBe("")
  const url = operationHref(filters)
  expect(url).toContain("orden=ninguno")
  expect(url).toContain("agrupar=responsible")
  expect(
    filterOperations(demonstrationOperations, filters).map((item) => item.id)
  ).toEqual(
    demonstrationOperations
      .filter((item) => item.kind === "Importación")
      .map((item) => item.id)
  )
})
