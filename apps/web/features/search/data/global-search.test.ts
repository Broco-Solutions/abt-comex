import { describe, expect, it } from "vitest"
import { getScenario } from "@/features/demo/data/scenarios"
import { demonstrationOperations } from "@/features/operations/data/operations"
import { initialDemoQuotes } from "@/features/quotes/data/quotes"
import { initialOrganizations } from "@/features/organizations/data/organizations"
import { isApplicationReturn } from "@/components/navigation/return-context"
import { buildSearchIndex, searchIndex } from "./global-search"

const source = {
  operations: demonstrationOperations,
  quotes: initialDemoQuotes,
  organizations: initialOrganizations,
}

describe("global navigation search", () => {
  it("matches authorized objects, accents and screen paths without indexing economic fields", () => {
    const index = buildSearchIndex({
      ...source,
      scenario: getScenario("direction"),
    })
    expect(searchIndex(index, "2048").map((row) => row.href)).toContain(
      "/operaciones/op-demo-2048"
    )
    expect(searchIndex(index, "cot-dem-001")[0]?.group).toBe("Cotizaciones")
    expect(
      searchIndex(index, "direccion").some((row) => row.href === "/gestion")
    ).toBe(true)
    expect(searchIndex(index, "cuentas cobrar").map((row) => row.href)).toEqual(
      ["/administracion/carteras?cartera=cobrar"]
    )
    expect(searchIndex(index, "no-existe-zzz")).toEqual([])
    expect(searchIndex(index, "").every((row) => !row.record)).toBe(true)
    expect(JSON.stringify(index)).not.toMatch(
      /unitPrice|conditions|openBalance|amount|ARS|USD/
    )
  })
  it("removes unavailable families and kinds before filtering or counting, including external scenarios", () => {
    const index = buildSearchIndex({
      ...source,
      scenario: getScenario("import"),
    })
    expect(index.some((row) => row.href.includes("3107"))).toBe(false)
    expect(index.some((row) => row.group === "Cotizaciones")).toBe(false)
    expect(searchIndex(index, "finanzas")).toEqual([])
    expect(index.some((row) => row.href.includes("exportacion"))).toBe(false)
    const partial = buildSearchIndex({
      ...source,
      scenario: {
        ...getScenario("direction"),
        capabilities: ["finance.billing"],
      },
    })
    expect(searchIndex(partial, "comprobantes")).toHaveLength(1)
    for (const query of [
      "cuentas cobrar",
      "cuentas pagar",
      "rendiciones",
      "ingresos",
      "personas",
      "gastos",
    ])
      expect(searchIndex(partial, query)).toEqual([])
    expect(
      buildSearchIndex({ ...source, scenario: getScenario("client") })
    ).toEqual([])
  })
  it("projects additions and renames from the same source identities without a parallel search dataset", () => {
    const organization = {
      ...initialOrganizations[0]!,
      name: "Cliente actualizado Álamo",
    }
    const operation = {
      ...demonstrationOperations[0]!,
      id: "op-demo-9999",
      reference: "OP-DEM-9999",
      clientId: organization.id,
    }
    const quote = {
      ...initialDemoQuotes[0]!,
      id: "quote-demo-999",
      reference: "COT-DEM-999",
      clientId: organization.id,
    }
    const index = buildSearchIndex({
      scenario: getScenario("direction"),
      operations: [operation],
      quotes: [quote],
      organizations: [organization],
    })
    expect(
      searchIndex(index, "alamo").filter((row) => row.record)
    ).toHaveLength(3)
    expect(searchIndex(index, "9999")[0]?.context).toContain(organization.name)
    expect(searchIndex(index, "COT-DEM-999")[0]?.href).toBe(
      "/cotizaciones/quote-demo-999"
    )
  })
  it("only accepts existing internal return families and preserves their filters and anchors", () => {
    for (const value of [
      "/gestion?vista=clientes&desde=2026-10-01#detalle",
      "/operaciones/op-demo-2048/importacion?returnTo=%2Fmi-trabajo",
      "/administracion/movimientos?q=REF",
      "/configuracion/personas/person-abt-001",
    ])
      expect(isApplicationReturn(value)).toBe(true)
    for (const value of [
      "https://example.com",
      "//example.com",
      "javascript:alert(1)",
      "/\\example.com",
      "/sin-ruta",
      "/clientes/../../acceso",
      "/portal",
    ])
      expect(isApplicationReturn(value)).toBe(false)
  })
})
