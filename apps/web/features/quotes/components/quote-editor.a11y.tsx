import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { QuoteEditor } from "./quote-editor"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

it("has no known automated accessibility violations in the quote editor", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(<QuoteEditor />)
    await rendered.findByRole("heading", { name: "Nueva cotización" })
    expect(
      (
        await axe(rendered.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)
