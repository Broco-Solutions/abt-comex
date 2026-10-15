import { expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { fireEvent } from "@testing-library/react"
import { renderComponent } from "@/test/utils/render"
import { ManagementRatesPage } from "./management-rates-page"
import { UsdEquivalent } from "./usd-equivalent"

it("keeps management rates, their editor and conversion disclosure accessible", async () => {
  const canvas = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  try {
    const rendered = renderComponent(
      <>
        <ManagementRatesPage />
        <UsdEquivalent amount={1325} currency="ARS" date="2026-10-14" />
      </>
    )
    await rendered.findByRole("heading", { name: "Cotizaciones de gestión" })
    expect((await axe(rendered.container)).violations).toEqual([])
    fireEvent.click(
      rendered.getByRole("button", { name: "Nueva cotización de gestión" })
    )
    await rendered.findByRole("dialog")
    expect((await axe(document.body)).violations).toEqual([])
  } finally {
    canvas.mockRestore()
  }
})
