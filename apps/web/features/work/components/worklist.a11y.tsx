import { axe } from "vitest-axe"
import { expect, it, vi } from "vitest"

import { renderComponent } from "@/test/utils/render"
import { Worklist } from "./worklist"

it("has no known automated accessibility violations in normal, error, and restricted states", async () => {
  const defaultRender = renderComponent(<Worklist searchParams={{}} />)
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)

  try {
    expect(
      (
        await axe(defaultRender.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    defaultRender.unmount()
    const errorRender = renderComponent(
      <Worklist searchParams={{ error: "lectura" }} />
    )
    expect(
      (
        await axe(errorRender.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    errorRender.unmount()
    const restrictedRender = renderComponent(
      <Worklist searchParams={{ error: "sin-permiso" }} />
    )
    expect(
      (
        await axe(restrictedRender.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)
