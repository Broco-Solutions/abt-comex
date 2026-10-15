import { describe, expect, it } from "vitest"
import {
  formatDate,
  formatDateTime,
  toIsoDate,
  isIsoCalendarDate,
  parseSpanishDate,
} from "./date.js"

describe("ABT date format", () => {
  it("parses Spanish calendar dates strictly, including leap years and incomplete input", () => {
    expect(parseSpanishDate("29/02/2024")).toBe("2024-02-29")
    expect(parseSpanishDate("14/10/2026")).toBe("2026-10-14")
    for (const value of [
      "29/02/2026",
      "31/04/2026",
      "10/14/2026",
      "14/10/",
      "2026-10-14",
    ])
      expect(parseSpanishDate(value)).toBeUndefined()
    expect(isIsoCalendarDate("2026-02-30")).toBe(false)
  })
  it("formats an ISO calendar date without shifting its day", () => {
    expect(formatDate("2026-10-14")).toBe("14/10/2026")
  })

  it("formats date and time in the product format", () => {
    expect(formatDateTime("2026-10-14T10:42:00")).toBe("14/10/2026 10:42")
  })

  it("keeps local calendar fields when converting to an ISO date", () => {
    expect(toIsoDate(new Date(2026, 9, 14))).toBe("2026-10-14")
  })
})
