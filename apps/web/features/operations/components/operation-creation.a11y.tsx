import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { renderComponent } from "@/test/utils/render"
import { OperationCreation } from "./operation-creation"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

it("has no known automated accessibility violations in the opening wizard", async () => {
  const canvasContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(<OperationCreation searchParams={{}} />)
    await rendered.findByRole("heading", { name: "Crear operación" })
    expect(
      (
        await axe(rendered.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
  } finally {
    canvasContext.mockRestore()
  }
}, 20000)
