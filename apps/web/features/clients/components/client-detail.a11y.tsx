import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { renderComponent } from "@/test/utils/render"

import { ClientDetail } from "./client-detail"

it("has no detected accessibility violations in the client detail", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const { container } = renderComponent(
      <ClientDetail clientId="client-demo-norte" searchParams={{}} />
    )
    expect((await axe(container)).violations).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
})
