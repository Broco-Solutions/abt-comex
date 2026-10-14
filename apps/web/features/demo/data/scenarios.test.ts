import { expect, it } from "vitest"
import { canVisit, getScenario, scenarioKind } from "./scenarios"

it("operational responsibility never grants commercial or financial visibility", () => {
  for (const id of ["import", "export", "operations"]) {
    const scenario = getScenario(id)
    expect(scenario.commercial).toBe(false)
    expect(scenario.financial).toBe(false)
    expect(canVisit(scenario, "/cotizaciones/quote-demo-001")).toBe(false)
    expect(canVisit(scenario, "/administracion/finanzas")).toBe(false)
    expect(canVisit(scenario, "/gestion")).toBe(false)
  }
  expect(scenarioKind(getScenario("import"))).toBe("Importación")
  expect(scenarioKind(getScenario("export"))).toBe("Exportación")
})

it("external and internal surfaces remain distinct", () => {
  expect(canVisit(getScenario("client"), "/inicio")).toBe(false)
  expect(canVisit(getScenario("client"), "/portal")).toBe(true)
  expect(getScenario("administration").commercial).toBe(false)
})
