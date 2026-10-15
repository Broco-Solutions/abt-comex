import { expect, it } from "vitest"
import { documentRequirements, projectDocuments } from "./documents"
it("projects receipt consistently without completing originals, controls or unrelated operations", () => {
  const id = "doc-2048-packing"
  const before = projectDocuments("op-demo-2048", [])
  const after = projectDocuments("op-demo-2048", [id])
  expect(before.find((d) => d.id === id)?.documentName).toBeUndefined()
  expect(after.find((d) => d.id === id)?.documentName).toContain("copia local")
  expect(after.find((d) => d.id === id)?.original).toBe("Pendiente")
  expect(projectDocuments("op-demo-2054", [id])).toEqual(
    projectDocuments("op-demo-2054", [])
  )
})
it("filters external ownership and sharing before forming fields or counts", () => {
  expect(projectDocuments("op-demo-2048", [], true)).toEqual([])
  const external = projectDocuments("op-demo-2054", [], true)
  expect(external.length).toBe(2)
  expect(external.every((d) => !("original" in d))).toBe(true)
  expect(new Set(documentRequirements.map((d) => d.id)).size).toBe(
    documentRequirements.length
  )
})
