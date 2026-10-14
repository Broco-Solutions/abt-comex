import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { ImportationWorkspace } from "./importation-workspace"

it("has no known automated accessibility violations in the importation workspace", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(
      <ImportationWorkspace operationId="op-demo-2048" searchParams={{}} />
    )
    await rendered.findByRole("heading", {
      name: "Importación · OP-DEM-2048",
    })
    expect((await axe(rendered.container)).violations).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)
