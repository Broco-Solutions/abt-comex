import { screen } from "@testing-library/react"
import { expect, it } from "vitest"

import { renderComponent } from "@/test/utils/render"
import { AccessDeniedState, ReadOnlyState } from "./application-state"

it("explains denied access without revealing protected content", () => {
  renderComponent(<AccessDeniedState />)
  expect(
    screen.getByRole("heading", { name: "No tenés acceso a este contenido" })
  ).toBeVisible()
  expect(screen.getByText(/no se muestran datos/i)).toBeVisible()
  expect(screen.getByRole("link", { name: "Volver a Inicio" })).toHaveAttribute(
    "href",
    "/inicio"
  )
})

it("distinguishes read-only content from disabled content", () => {
  renderComponent(<ReadOnlyState />)
  expect(
    screen.getByRole("heading", {
      name: "Contenido disponible sólo para consulta",
    })
  ).toBeVisible()
  expect(
    screen.getByText(/acciones de edición no están habilitadas/i)
  ).toBeVisible()
})
