import { expect, it } from "vitest"
import { renderComponent } from "@/test/utils/render"

import { OperationsList } from "./operations-list"

it("links to a useful operation detail without exposing economics", () => {
  const { getAllByRole, getByRole, queryByText } = renderComponent(
    <OperationsList
      searchParams={{ tipo: "importacion", situacion: "En seguimiento" }}
    />
  )
  expect(getByRole("heading", { name: "Importaciones" })).toBeTruthy()
  const detailLink = getAllByRole("link", { name: "OP-DEM-2048" })[0]
  if (!detailLink) throw new Error("Expected an operation detail link")
  expect(detailLink.getAttribute("href")).toContain(
    "/operaciones/op-demo-2048?returnTo="
  )
  expect(detailLink.getAttribute("href")).toContain("tipo%3Dimportacion")
  expect(queryByText(/ARS|USD|honorarios|margen/i)).toBeNull()
})

it("does not publish rows or counts in the restricted state", () => {
  const { getByRole, queryByText } = renderComponent(
    <OperationsList searchParams={{ error: "sin-permiso" }} />
  )
  expect(getByRole("heading", { name: "Vista no disponible" })).toBeTruthy()
  expect(
    queryByText("9 operaciones visibles en este escenario ficticio")
  ).toBeNull()
  expect(queryByText("OP-DEM-2048")).toBeNull()
})

it("preserves filters while showing a recoverable source error without fabricated totals", () => {
  const { getByRole, getByText } = renderComponent(
    <OperationsList searchParams={{ q: "centro", error: "lectura" }} />
  )
  expect(getByRole("alert")).toHaveTextContent("Conservamos filtros y contexto")
  expect(
    getByRole("link", { name: "Reintentar" }).getAttribute("href")
  ).toContain("q=centro")
  expect(getByText(/no confirma un total/)).toBeTruthy()
})
