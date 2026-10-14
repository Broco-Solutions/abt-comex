import { describe, expect, it } from "vitest"

import {
  canCompleteDoubleControl,
  getImportationScenario,
  parseImportationScenarios,
} from "./importation-scenarios"

describe("importation demonstration controls", () => {
  it("requires two different known demonstration people", () => {
    expect(
      canCompleteDoubleControl({
        firstReviewer: "demo-person-01",
        secondReviewer: "demo-person-02",
        completed: false,
      })
    ).toBe(true)
    expect(
      canCompleteDoubleControl({
        firstReviewer: "demo-person-01",
        secondReviewer: "demo-person-01",
        completed: false,
      })
    ).toBe(false)
  })

  it("rejects malformed or forged completed states from session data", () => {
    expect(
      parseImportationScenarios(
        JSON.stringify([
          {
            operationId: "op-demo-2048",
            doubleControl: {
              firstReviewer: "demo-person-01",
              secondReviewer: "demo-person-01",
              completed: true,
            },
          },
        ])
      )
    ).toEqual([])
    expect(
      parseImportationScenarios(
        JSON.stringify([
          {
            operationId: "op-demo-2048",
            doubleControl: {
              firstReviewer: "demo-person-01",
              secondReviewer: "unknown-person",
              completed: true,
            },
          },
        ])
      )
    ).toEqual([])
    expect(parseImportationScenarios("not json")).toEqual([])
  })

  it("keeps an unrecorded operation in a pending state", () => {
    expect(getImportationScenario("op-demo-2048", []).doubleControl).toEqual({
      firstReviewer: "",
      secondReviewer: "",
      completed: false,
    })
  })
})
