import { describe, expect, it } from "vitest"

import { demonstrationOperations } from "@/features/operations/data/operations"
import {
  findPortalOperation,
  getPortalContext,
  PORTAL_DEMO_CLIENT_ID,
} from "./portal"

describe("synthetic client portal projection", () => {
  it("exposes only explicitly projected operations for the demo client", () => {
    const context = getPortalContext(
      PORTAL_DEMO_CLIENT_ID,
      demonstrationOperations
    )
    expect(context.authorized).toBe(true)
    if (!context.authorized) return

    expect(context.client.id).toBe(PORTAL_DEMO_CLIENT_ID)
    expect(context.operations.map(({ id }) => id)).toEqual([
      "op-demo-2054",
      "op-demo-3112",
    ])
    expect(context.operations[0]).toEqual({
      id: "op-demo-2054",
      reference: "OP-DEM-2054",
      kind: "Importación",
      situation: "Pendiente documental",
      updatedOn: "2026-10-12",
    })
    expect(JSON.stringify(context)).not.toMatch(
      /responsible|nextAction|alert|honorarios|margen|costo|\$\s?\d/i
    )
  })

  it("denies other clients without revealing their operations", () => {
    const context = getPortalContext("client-demo-sur", demonstrationOperations)
    expect(context).toEqual({ authorized: false })
    expect(
      findPortalOperation(
        PORTAL_DEMO_CLIENT_ID,
        "op-demo-3141",
        demonstrationOperations
      )
    ).toBeUndefined()
  })
})
