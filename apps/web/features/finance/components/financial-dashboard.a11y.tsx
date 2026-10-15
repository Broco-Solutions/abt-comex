import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { renderComponent } from "@/test/utils/render"
import { FinancialDashboard } from "./financial-dashboard"
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))
it.each([
  {},
  { serie: "expense", dimension: "category", grupo: "Documentación" },
  { error: "lectura" },
  { desde: "2026-10-13", hasta: "2026-05-01" },
  { desde: "2026-99-99", moneda: "USD" },
])("keeps finance charts and recovery accessible: %j", async (searchParams) => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(
      <FinancialDashboard searchParams={searchParams} />
    )
    expect(
      (
        await axe(rendered.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    rendered.unmount()
  } finally {
    canvas.mockRestore()
  }
})
