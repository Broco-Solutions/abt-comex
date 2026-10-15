import { expect, it, vi } from "vitest"
import { fireEvent } from "@testing-library/react"
import { axe } from "vitest-axe"
import { renderComponent } from "@/test/utils/render"
import { ComboboxReference } from "./combobox-reference"

it("exposes an accessible expanded combobox and selected option", async () => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const view = renderComponent(<ComboboxReference />)
    fireEvent.focus(view.getByRole("combobox"))
    expect(
      view.getByRole("option", { name: /Organización Norte/ })
    ).toHaveAttribute("aria-selected", "true")
    expect(
      (
        await axe(view.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
  } finally {
    canvas.mockRestore()
  }
})
