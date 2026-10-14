import { describe, expect, it } from "vitest"

import {
  canCompleteExportDoubleControl,
  demonstrationDjves,
  demonstrationPermits,
  getExportationProgress,
  isValidExportReviewerPair,
  parseExportationScenarios,
} from "./exportation-scenarios"

describe("exportation demonstration data", () => {
  it("requires two distinct known people for its local double control", () => {
    expect(
      isValidExportReviewerPair(
        "demo-export-person-01",
        "demo-export-person-01"
      )
    ).toBe(false)
    expect(isValidExportReviewerPair("demo-export-person-01", "unknown")).toBe(
      false
    )
    expect(
      isValidExportReviewerPair(
        "demo-export-person-01",
        "demo-export-person-02"
      )
    ).toBe(true)
    expect(
      canCompleteExportDoubleControl({
        firstReviewer: "demo-export-person-01",
        secondReviewer: "demo-export-person-02",
        completed: true,
      })
    ).toBe(true)
  })

  it("keeps an autonomous DJVE related to multiple permits and permits without DJVE", () => {
    const autonomous = demonstrationDjves.find((item) => item.autonomous)
    expect(autonomous?.permitIds).toHaveLength(2)
    expect(demonstrationPermits.some((item) => !item.djveId)).toBe(true)
    expect(
      demonstrationPermits.filter((item) => item.djveId === autonomous?.id)
    ).toHaveLength(2)
  })

  it("keeps invoice, fulfilled, post-shipment and documentary close independent", () => {
    const progress = getExportationProgress("op-demo-3107")
    expect(progress.billing).toBe("Facturada")
    expect(progress.fulfilled).toBe("Pendiente")
    expect(progress.postShipment).toBe("Pendiente")
    expect(progress.documentaryClose).toBe("Pendiente")
    expect(progress.physicalOriginals).not.toBe(progress.digitalCopy)
  })

  it("rejects malformed and duplicate local scenarios", () => {
    expect(parseExportationScenarios("not-json")).toEqual([])
    expect(
      parseExportationScenarios(
        JSON.stringify([
          {
            operationId: "op-demo-3107",
            doubleControl: {
              firstReviewer: "demo-export-person-01",
              secondReviewer: "demo-export-person-02",
              completed: true,
            },
          },
          {
            operationId: "op-demo-3107",
            doubleControl: {
              firstReviewer: "demo-export-person-01",
              secondReviewer: "demo-export-person-02",
              completed: true,
            },
          },
        ])
      )
    ).toEqual([])
  })
})
