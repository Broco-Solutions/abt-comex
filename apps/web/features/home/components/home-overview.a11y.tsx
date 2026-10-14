import { axe } from "vitest-axe"
import { expect, it, vi } from "vitest"

import { renderComponent } from "@/test/utils/render"
import { HomeOverview } from "./home-overview"

it("has no known automated accessibility violations in Inicio", async () => {
  const { container } = renderComponent(<HomeOverview />)
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)

  try {
    expect(
      (
        await axe(container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
})
