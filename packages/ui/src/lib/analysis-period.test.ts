import { describe, expect, it } from "vitest"
import {
  analysisPeriodError,
  comparisonPeriod,
  presetPeriod,
} from "@workspace/ui/lib/analysis-period"

describe("analysis periods", () => {
  it("uses the explicit reference for month, quarter, year and previous complete month", () => {
    expect(presetPeriod("this-month", "2026-10-14")).toMatchObject({
      from: "2026-10-01",
      to: "2026-10-14",
    })
    expect(presetPeriod("previous-month", "2026-10-14")).toMatchObject({
      from: "2026-09-01",
      to: "2026-09-30",
    })
    expect(presetPeriod("this-quarter", "2026-08-14")).toMatchObject({
      from: "2026-07-01",
      to: "2026-08-14",
    })
    expect(presetPeriod("this-year", "2026-10-14")).toMatchObject({
      from: "2026-01-01",
      to: "2026-10-14",
    })
    expect(presetPeriod("previous-month", "2026-01-14")).toMatchObject({
      from: "2025-12-01",
      to: "2025-12-31",
    })
  })
  it("compares partial periods with equivalent cuts, never a partial month with a whole month", () => {
    expect(
      comparisonPeriod(presetPeriod("this-month", "2026-10-14"), "previous")
    ).toMatchObject({ from: "2026-09-01", to: "2026-09-14", comparable: true })
    expect(
      comparisonPeriod(presetPeriod("this-quarter", "2026-10-14"), "previous")
    ).toMatchObject({ from: "2026-07-01", to: "2026-07-14", comparable: true })
    expect(
      comparisonPeriod(
        { preset: "custom", from: "2026-10-05", to: "2026-10-14" },
        "previous"
      )
    ).toMatchObject({ from: "2026-09-25", to: "2026-10-04", days: 10 })
  })
  it("keeps year comparisons and leap-day differences explicit", () => {
    expect(
      comparisonPeriod(presetPeriod("this-month", "2026-10-14"), "year")
    ).toMatchObject({ from: "2025-10-01", to: "2025-10-14" })
    expect(
      comparisonPeriod(
        { preset: "custom", from: "2024-02-29", to: "2024-02-29" },
        "year"
      )
    ).toMatchObject({ from: "2023-02-28", to: "2023-02-28", comparable: true })
    expect(
      comparisonPeriod(
        { preset: "custom", from: "2024-02-01", to: "2024-03-01" },
        "year"
      )?.comparable
    ).toBe(false)
    expect(
      comparisonPeriod(presetPeriod("this-month", "2026-03-30"), "previous")
        ?.comparable
    ).toBe(false)
  })
  it("rejects incomplete, impossible, reversed and future ranges without coercion", () => {
    for (const [from, to] of [
      ["", "2026-10-14"],
      ["2026-02-30", "2026-10-14"],
      ["2026-10-14", "2026-10-01"],
      ["2026-10-01", "2026-10-15"],
    ])
      expect(analysisPeriodError(from!, to!, "2026-10-14")).not.toBe("")
    expect(
      comparisonPeriod(
        { preset: "custom", from: "", to: "2026-10-14" },
        "previous"
      )
    ).toBeUndefined()
  })
})
