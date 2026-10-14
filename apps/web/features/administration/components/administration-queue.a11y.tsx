import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { AdministrationQueue } from "./administration-queue"

it("has no known automated accessibility violations and omits economics in all queue states", async () => {
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
        <AdministrationQueue searchParams={searchParams} />
      )
      const text = rendered.container.textContent ?? ""
      expect(text).not.toMatch(/\$\s?\d/)
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
