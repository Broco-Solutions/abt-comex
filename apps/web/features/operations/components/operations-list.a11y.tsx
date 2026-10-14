import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { OperationsList } from "./operations-list"

it("has no known automated accessibility violations in list, error, and restricted states", async () => {
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
        <OperationsList searchParams={searchParams} />
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
