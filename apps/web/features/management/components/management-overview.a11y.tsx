import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { ManagementOverview } from "./management-overview"

it("has no known automated accessibility violations in management views and restricted states", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    for (const searchParams of [
      {},
      { vista: "operaciones" },
      { vista: "clientes" },
      { vista: "trabajo" },
      { vista: "economia" },
      { error: "lectura" },
      { error: "sin-permiso" },
    ]) {
      const rendered = renderComponent(
        <ManagementOverview searchParams={searchParams} />
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
}, 30000)
