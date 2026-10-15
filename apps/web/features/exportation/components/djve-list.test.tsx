import { expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderComponent } from "@/test/utils/render"
import { demonstrationDjves } from "../data/exportation-scenarios"
import { DjveList } from "./djve-list"
it.each([2, 20, 100])(
  "keeps the compact DJVE list bounded at synthetic design volume %i",
  (count) => {
    const djves = Array.from({ length: count }, (_, i) => ({
      ...demonstrationDjves[0]!,
      id: "volume-" + i,
      reference: "DJVE-VOLUMEN-" + i,
    }))
    const view = renderComponent(<DjveList djves={djves} query="" page={1} />)
    expect(
      screen.getByRole("list", { name: "Trámites DJVE" }).children.length
    ).toBe(Math.min(10, count))
    if (count > 10)
      expect(screen.getByRole("link", { name: "Siguiente" })).toHaveAttribute(
        "href",
        expect.stringContaining("pagina=2")
      )
    view.rerender(
      <DjveList djves={djves} query={"VOLUMEN-" + (count - 1)} page={1} />
    )
    expect(
      screen.getByRole("list", { name: "Trámites DJVE" }).children.length
    ).toBe(1)
  }
)
