import { fireEvent } from "@testing-library/react"
import { expect, it } from "vitest"
import { renderComponent } from "@/test/utils/render"
import { DateFieldReference } from "./date-field-reference"
it("keeps incomplete or reversed custom drafts unapplied and accepts inclusive Spanish dates", () => {
  const view = renderComponent(<DateFieldReference />)
  fireEvent.change(view.getByLabelText("Período", { exact: true }), {
    target: { value: "custom" },
  })
  fireEvent.change(view.getByLabelText("Desde", { exact: true }), {
    target: { value: "" },
  })
  fireEvent.click(view.getByRole("button", { name: "Aplicar período" }))
  expect(view.getByRole("alert").textContent).toContain(
    "Completá Desde y Hasta"
  )
  expect(view.getByText(/01\/10\/2026–14\/10\/2026/)).toBeTruthy()
  fireEvent.change(view.getByLabelText("Desde", { exact: true }), {
    target: { value: "14/10/2026" },
  })
  fireEvent.change(view.getByLabelText("Hasta", { exact: true }), {
    target: { value: "01/10/2026" },
  })
  fireEvent.click(view.getByRole("button", { name: "Aplicar período" }))
  expect(view.getByRole("alert").textContent).toContain("anterior o igual")
  fireEvent.change(view.getByLabelText("Hasta", { exact: true }), {
    target: { value: "14/10/2026" },
  })
  fireEvent.click(view.getByRole("button", { name: "Aplicar período" }))
  expect(view.queryByRole("alert")).toBeNull()
  expect(view.getByText(/14\/10\/2026–14\/10\/2026/)).toBeTruthy()
  view.unmount()
})
