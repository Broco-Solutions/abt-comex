import { expect, it } from "vitest"
import { fireEvent } from "@testing-library/react"
import { renderComponent } from "@/test/utils/render"
import { ComboboxReference } from "./combobox-reference"

it("filters, selects by keyboard and preserves the selection on Escape and no matches", () => {
  const view = renderComponent(<ComboboxReference />)
  const input = view.getByRole("combobox")
  fireEvent.focus(input)
  expect(view.getAllByRole("option")).toHaveLength(3)
  fireEvent.change(input, { target: { value: "contraparte" } })
  expect(view.getAllByRole("option")).toHaveLength(1)
  fireEvent.keyDown(input, { key: "Enter" })
  expect(input).toHaveValue("Contraparte Exterior")
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value: "inexistente" } })
  expect(view.getByRole("status")).toHaveTextContent("Sin coincidencias")
  fireEvent.keyDown(input, { key: "Escape" })
  expect(input).toHaveValue("Contraparte Exterior")
  expect(input).toHaveAttribute("aria-expanded", "false")
})
