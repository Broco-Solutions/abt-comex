import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { fireEvent } from "@testing-library/react"
import { renderComponent } from "@/test/utils/render"
import { DateFieldReference } from "./date-field-reference"

it("keeps Spanish date entry, malformed drafts and calendar month/year controls accessible", async () => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const view = renderComponent(
      <main>
        <DateFieldReference />
      </main>
    )
    const input = view.getByRole("textbox", {
      name: "Fecha de referencia · DD/MM/AAAA",
    })
    fireEvent.change(input, { target: { value: "31/02/2026" } })
    fireEvent.blur(input)
    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(
      view.getByText("Ingresá una fecha válida en DD/MM/AAAA.")
    ).toBeTruthy()
    fireEvent.change(input, { target: { value: "14/10/2026" } })
    expect(input.getAttribute("aria-invalid")).toBe("false")
    fireEvent.click(
      view.getByRole("button", {
        name: "Elegir fecha: Fecha de referencia · DD/MM/AAAA",
      })
    )
    expect(await view.findByRole("combobox", { name: "Mes" })).toBeTruthy()
    expect(view.getByRole("combobox", { name: "Año" })).toBeTruthy()
    expect((await axe(document.body)).violations).toEqual([])
  } finally {
    canvas.mockRestore()
  }
})
