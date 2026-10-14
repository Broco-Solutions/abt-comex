import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { ExportationWorkspace } from "./exportation-workspace"

it("has no known automated accessibility violations in the exportation workspace", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(
      <ExportationWorkspace operationId="op-demo-3107" searchParams={{}} />
    )
    await rendered.findByRole("heading", {
      name: "Exportación · OP-DEM-3107",
    })
    expect((await axe(rendered.container)).violations).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)
