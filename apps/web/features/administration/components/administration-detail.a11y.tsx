import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { AdministrationDetail } from "./administration-detail"

it("keeps the operation context accessible without exposing economic values", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    for (const operationId of ["op-demo-3107", "unknown-operation"]) {
      const rendered = renderComponent(
        <AdministrationDetail
          operationId={operationId}
          returnTo="/administracion?q=OP-DEM-3107"
        />
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
