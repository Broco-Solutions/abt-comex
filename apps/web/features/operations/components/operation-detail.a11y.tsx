import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { OperationDetail, safeReturnTo } from "./operation-detail"

it("renders a readable detail without economic fields or known axe violations", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(
      <OperationDetail operationId="op-demo-2048" searchParams={{}} />
    )
    expect(rendered.getByRole("heading", { name: "OP-DEM-2048" })).toBeTruthy()
    expect(rendered.queryByText(/honorarios:|margen:/i)).toBeNull()
    expect((await axe(rendered.container)).violations).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
})

it("does not disclose whether a restricted operation exists", () => {
  const rendered = renderComponent(
    <OperationDetail
      operationId="not-a-real-id"
      searchParams={{ error: "sin-permiso" }}
    />
  )
  expect(
    rendered.getByRole("heading", { name: "Operación no disponible" })
  ).toBeTruthy()
  expect(rendered.queryByText(/not-a-real-id/)).toBeNull()
})

it("accepts only local return paths from operation or work lists", () => {
  expect(safeReturnTo("/operaciones?tipo=exportacion")).toBe(
    "/operaciones?tipo=exportacion"
  )
  expect(safeReturnTo("/mi-trabajo?vista=mine#wrk-1")).toBe(
    "/mi-trabajo?vista=mine#wrk-1"
  )
  expect(safeReturnTo("https://example.com")).toBe("/operaciones")
  expect(safeReturnTo("//example.com")).toBe("/operaciones")
})
