import { expect, it } from "vitest"
import { projectWorkItems } from "./work-items"
import { initialDemoQuotes } from "@/features/quotes/data/quotes"
import {
  demonstrationDjves,
  demonstrationPermits,
} from "@/features/exportation/data/exportation-scenarios"

it("removes only a completed local control and preserves unrelated tasks", () => {
  const before = projectWorkItems([])
  const after = projectWorkItems([
    {
      operationId: "op-demo-2048",
      doubleControl: {
        firstReviewer: "demo-person-01",
        secondReviewer: "demo-person-02",
        completed: true,
      },
    },
  ])
  expect(after.some((item) => item.id === "wrk-imp-control-01")).toBe(false)
  expect(before.length - after.length).toBe(1)
  expect(after.some((item) => item.id === "wrk-admin-no-operation-05")).toBe(
    true
  )
})

it("work quote references identify an existing version", () => {
  for (const item of projectWorkItems([]).filter(
    (item) => item.relatedQuoteId
  )) {
    const quote = initialDemoQuotes.find(
      (quote) => quote.id === item.relatedQuoteId
    )
    expect(quote).toBeDefined()
    expect(item.reference).toContain(quote?.reference)
  }
})

it("DJVE relations agree in both directions and retain unlinked permits", () => {
  for (const djve of demonstrationDjves) {
    expect(djve.permitIds).toEqual(
      demonstrationPermits
        .filter((permit) => permit.djveId === djve.id)
        .map((permit) => permit.id)
    )
  }
  expect(
    demonstrationPermits.find((permit) => permit.id === "permit-demo-1403")
      ?.djveId
  ).toBeUndefined()
})
