import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { DjveDetail } from "./djve-detail"
import { DjveList } from "./djve-list"

it("has no known automated accessibility violations in the DJVE list", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(<DjveList />)
    await rendered.findByRole("heading", { name: "DJVE y permisos" })
    expect((await axe(rendered.container)).violations).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)

it("has no known automated accessibility violations in a DJVE detail", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(<DjveDetail djveId="djve-demo-2026-01" />)
    await rendered.findByRole("heading", { name: "DJVE-DEM-2026-01" })
    expect((await axe(rendered.container)).violations).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)
