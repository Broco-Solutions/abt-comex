import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { QuoteDetail } from "./quote-detail"

it("has no known automated accessibility violations in detail and restricted states", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const detail = renderComponent(
      <QuoteDetail quoteId="quote-demo-001" searchParams={{}} />
    )
    await detail.findByRole("heading", { name: "COT-DEM-001" })
    expect(
      (
        await axe(detail.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    detail.unmount()

    const restricted = renderComponent(
      <QuoteDetail
        quoteId="quote-demo-001"
        searchParams={{ error: "sin-permiso" }}
      />
    )
    expect(
      (
        await axe(restricted.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    restricted.unmount()
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)
