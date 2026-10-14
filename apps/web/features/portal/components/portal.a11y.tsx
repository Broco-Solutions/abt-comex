import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { PortalAccess } from "./portal-access"
import { PortalHome } from "./portal-home"
import { PortalOperationDetail } from "./portal-operation-detail"
import { PortalShell } from "./portal-shell"

it("has no known automated accessibility violations in portal states", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const elements = [
      <PortalAccess key="access" />,
      <PortalHome key="home" requestedClientId="client-demo-centro" />,
      <PortalHome key="denied" requestedClientId="client-demo-sur" />,
      <PortalOperationDetail
        key="detail"
        requestedClientId="client-demo-centro"
        operationId="op-demo-3133"
      />,
    ]
    for (const element of elements) {
      const view = renderComponent(<PortalShell>{element}</PortalShell>)
      expect(
        (
          await axe(view.container, {
            rules: { "color-contrast": { enabled: false } },
          })
        ).violations
      ).toEqual([])
      view.unmount()
    }
  } finally {
    canvasContext.mockRestore()
  }
})
