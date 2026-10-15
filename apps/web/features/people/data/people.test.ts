import { expect, it } from "vitest"
import {
  initialPeople,
  parsePeople,
  pendingAssignments,
  suspendAccess,
} from "./people"
import { hasCapability } from "@/features/demo/data/capabilities"
import { canVisit, getScenario } from "@/features/demo/data/scenarios"
it("keeps membership distinct from active access and does not infer economic access from responsibility", () => {
  expect(
    initialPeople.members.find((item) => item.id === "member-demo-07")?.access
  ).toBe("Sin acceso")
  for (const id of ["import", "export", "operations"]) {
    expect(hasCapability(getScenario(id), "finance.billing")).toBe(false)
    expect(hasCapability(getScenario(id), "commercial.read")).toBe(false)
  }
  expect(parsePeople(JSON.stringify(initialPeople))).toEqual(initialPeople)
  expect(parsePeople('{"members":[]}')).toEqual(initialPeople)
})
it("suspends access and transfers current assignments without deleting the person or historical records", () => {
  const next = suspendAccess(initialPeople, "member-demo-01", "member-demo-03")
  expect(next.members).toHaveLength(initialPeople.members.length)
  expect(
    next.members.find((item) => item.id === "member-demo-01")?.access
  ).toBe("Suspendido")
  expect(pendingAssignments("member-demo-01", next)).toEqual([])
  expect(pendingAssignments("member-demo-03", next)).toContain(
    "wrk-imp-control-01"
  )
  expect(initialPeople.assignments["wrk-imp-control-01"]).toBe("member-demo-01")
  expect(() =>
    suspendAccess(initialPeople, "member-demo-01", "member-demo-06")
  ).toThrow()
  expect(() =>
    suspendAccess(initialPeople, "member-demo-01", "member-demo-01")
  ).toThrow()
})
it("capabilities, not perspective or area, govern internal administrative routes", () => {
  const scenario = { ...getScenario("direction"), capabilities: [] }
  expect(canVisit(scenario, "/gestion")).toBe(false)
  expect(canVisit(scenario, "/administracion/finanzas")).toBe(false)
  expect(canVisit(scenario, "/configuracion/personas")).toBe(false)
  expect(
    canVisit(
      { ...scenario, capabilities: ["people.manage"] },
      "/configuracion/personas"
    )
  ).toBe(true)
  expect(
    canVisit(
      { ...getScenario("client"), capabilities: ["people.manage"] },
      "/configuracion/personas"
    )
  ).toBe(false)
})
