import { expect, it } from "vitest"
import { renderComponent } from "@/test/utils/render"

import { OperationsList } from "./operations-list"

it("renders searchable operations and a useful contextual destination without exposing economics", () => {
  const { getByRole, getByText, queryByText } = renderComponent(
    <OperationsList
      searchParams={{ tipo: "importacion", operacion: "op-demo-2048" }}
    />
  )
  expect(getByRole("heading", { name: "Importaciones" })).toBeTruthy()
  expect(getByRole("heading", { name: "Contexto de OP-DEM-2048" })).toBeTruthy()
  expect(
    getByText(/ficha común de Operación corresponde a una etapa posterior/)
  ).toBeTruthy()
  expect(
    getByRole("link", {
      name: "Cerrar contexto y volver a resultados",
    }).getAttribute("href")
  ).toContain("tipo=importacion")
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
