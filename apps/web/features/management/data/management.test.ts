import { describe, expect, it } from "vitest"

import { demonstrationClients } from "@/features/clients/data/clients"
import { demonstrationOperations } from "@/features/operations/data/operations"
import { visibleWorkItems } from "@/features/work/data/work-items"
import { getManagementSnapshot, managementSourceFamilies } from "./management"

describe("management demonstration snapshot", () => {
  it("derives operational counts and drill-down groups from shared fixtures", () => {
    const snapshot = getManagementSnapshot(
      demonstrationOperations,
      demonstrationClients,
      visibleWorkItems()
    )
    expect(snapshot.operationCount).toBe(demonstrationOperations.length)
    expect(snapshot.importCount + snapshot.exportCount).toBe(
      snapshot.operationCount
    )
    expect(snapshot.clientActivity.map(({ client }) => client.id)).toContain(
      "client-demo-norte"
    )
    expect(
      snapshot.statusGroups.reduce((total, group) => total + group.count, 0)
    ).toBe(snapshot.operationCount)
    expect(snapshot.workCount).toBe(visibleWorkItems().length)
  })

  it("does not include financial values or formulas in the metric model", () => {
    const serialized = JSON.stringify(managementSourceFamilies)
    expect(serialized).not.toMatch(/\$\s?\d|\bformula\s*:/i)
    expect(managementSourceFamilies).toHaveLength(4)
    expect(
      managementSourceFamilies.every((family) =>
        family.validationOwner.includes("ABT")
      )
    ).toBe(true)
    expect(managementSourceFamilies[2].source).toContain("sólo lectura")
  })
})
