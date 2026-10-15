import { expect, it, vi } from "vitest"
import { renderComponent } from "@/test/utils/render"
import { PortalHome } from "./portal-home"

vi.mock("@/features/demo/state/scenario-provider", async () => {
  const { getScenario } = await import("@/features/demo/data/scenarios")
  return {
    useScenario: () => ({ active: true, scenario: getScenario("client") }),
  }
})

it("uses shared authorized copies instead of claiming that no documents exist", () => {
  const view = renderComponent(
    <PortalHome requestedClientId="client-demo-centro" />
  )
  expect(
    view.getByRole("link", { name: "Factura comercial · OP-DEM-2054" })
  ).toHaveAttribute(
    "href",
    "/portal/operaciones/op-demo-2054?cliente=client-demo-centro"
  )
  expect(view.queryByText(/No hay documentos externos/)).toBeNull()
  expect(view.queryByText(/PE-DEM-1401/)).toBeNull()
})
