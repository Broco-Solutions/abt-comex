import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { QuotesList } from "./quotes-list"

it("has no known automated accessibility violations in regular, error, or restricted quote lists", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    for (const searchParams of [
      {},
      { error: "lectura" },
      { error: "sin-permiso" },
    ]) {
      const rendered = renderComponent(
        <QuotesList searchParams={searchParams} />
      )
      expect(
        (
          await axe(rendered.container, {
            rules: { "color-contrast": { enabled: false } },
          })
        ).violations
      ).toEqual([])
      rendered.unmount()
    }
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)
