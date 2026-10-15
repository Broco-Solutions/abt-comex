import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { renderComponent } from "@/test/utils/render"
import { ExecutiveOverview } from "./executive-overview"
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))
it("keeps local query answers, clarifications, abstentions and source drilldown accessible", async () => {
  for (const pregunta of [
    "Cuánto facturamos este mes",
    "ingresos",
    "Cuánto se facturó a demo en este período",
    "Cuánto facturamos entre 31/02/2026 y 14/10/2026",
    "Cuánto se cobró del cliente seleccionado",
    "Qué gastos registrados hubo por categoría en este período",
  ]) {
    const rendered = renderComponent(
      <ExecutiveOverview searchParams={{ vista: "consultas", pregunta }} />
    )
    expect(
      (
        await axe(rendered.container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations
    ).toEqual([])
    rendered.unmount()
  }
}, 30000)
