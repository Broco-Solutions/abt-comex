import { axe } from "vitest-axe"
import { expect, it, vi } from "vitest"
import { BrandAttribution } from "./brand-attribution"
import { renderComponent } from "@/test/utils/render"

it("has no known automated accessibility violations", async () => {
  const { container } = renderComponent(<BrandAttribution />)
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)

  try {
    expect(
      (await axe(container, { rules: { "color-contrast": { enabled: false } } }))
        .violations
    ).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
})

it("has no known automated accessibility violations when compact", async () => {
  const { container } = renderComponent(<BrandAttribution compact />)
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)

  try {
    expect(
      (await axe(container, { rules: { "color-contrast": { enabled: false } } }))
        .violations
    ).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
})
