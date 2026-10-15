import { describe, expect, it } from "vitest"

import {
  filterWorkItems,
  getWorkSummary,
  parseWorkFilters,
  visibleWorkItems,
} from "./work-items"

describe("demonstration work items", () => {
  it("derives counts from the visible collection and omits restricted items", () => {
    const visible = visibleWorkItems()
    const summary = getWorkSummary(visible)

    expect(visible).toHaveLength(7)
    expect(
      visible.some((item) => item.id === "wrk-commercial-restricted-08")
    ).toBe(false)
    expect(summary).toEqual({
      total: 7,
      blocking: 1,
      controls: 1,
      upcoming: 2,
      overdue: 2,
      reviews: 2,
      exceptions: 1,
    })
  })

  it("keeps task-without-operation visible without an operation identifier", () => {
    const item = visibleWorkItems().find(
      (entry) => entry.id === "wrk-admin-no-operation-05"
    )

    expect(item?.origin).toContain("sin operación")
    expect(item).not.toHaveProperty("operationId")
  })

  it("combines type, view, and case-insensitive text filters", () => {
    const filters = parseWorkFilters({
      q: "post-embarque",
      tipo: "tarea",
      vista: "mine",
    })
    const results = filterWorkItems(visibleWorkItems(), filters)

    expect(filters).toEqual({
      query: "post-embarque",
      kind: "Tarea",
      view: "mine",
    })
    expect(results.map((item) => item.id)).toEqual(["wrk-exp-post-embarque-02"])
  })

  it("does not manufacture a freshness timestamp for a local item", () => {
    const item = visibleWorkItems().find(
      (entry) => entry.id === "wrk-doc-review-03"
    )

    expect(item?.source).toBe("ABT Comex · registro local")
    expect(item?.sourceUpdatedAt).toBeUndefined()
  })
})
