import { describe, expect, it } from "vitest"
import { formatDate, formatDateTime, toIsoDate } from "./date.js"

describe("ABT date format", () => {
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
