import { screen } from "@testing-library/react"
import { expect, it } from "vitest"

import { renderComponent } from "@/test/utils/render"
import { Worklist } from "./worklist"

it("shows actionable context, keeps filters in links, and does not expose restricted content", () => {
  renderComponent(<Worklist searchParams={{ q: "control", vista: "all" }} />)

  expect(
    screen.getByRole("heading", { level: 1, name: "Mi trabajo" })
  ).toBeVisible()
  expect(screen.getByRole("link", { name: "Ver contexto" })).toHaveAttribute(
    "href",
    "/mi-trabajo?q=control&trabajo=wrk-imp-control-01#wrk-imp-control-01"
  )
  expect(
    screen.queryByText("Información comercial restringida")
  ).not.toBeInTheDocument()
})

it("provides a recoverable state without publishing an unconfirmed zero count", () => {
  renderComponent(
    <Worklist searchParams={{ q: "control", vista: "all", error: "lectura" }} />
  )

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Conservamos la búsqueda, el tipo y la vista"
  )
  expect(screen.getByText(/no confirma conteos/)).toBeVisible()
  expect(
    screen.getByRole("link", { name: "Reintentar lectura" })
  ).toHaveAttribute("href", "/mi-trabajo?q=control")
})
